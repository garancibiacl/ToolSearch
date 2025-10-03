import React, { useEffect, useState } from "react";

/**
 * Normaliza una URL para que utilice el patrón AMPscript `RedirectTo` cuando el dominio pertenece a Sodimac.
 *
 * @param {string} h - URL original proporcionada por el usuario.
 * @returns {string} URL convertida a AMPscript o sin modificar si no corresponde.
 * @example
 * normalizeHrefToAmp('https://www.sodimac.cl/promos')
 * // => "%%=RedirectTo(concat('https://www.sodimac.cl/promos?',@prefix))=%%"
 */
function normalizeHrefToAmp(h) {
  const href = String(h || "").trim();
  if (!href) return "";
  if (/RedirectTo\(concat\(/.test(href)) return href; // ya está en AMPscript

  try {
    const baseHref =
      href.startsWith("http") || href.startsWith("/")
        ? href
        : `https://${href}`;
    const url = new URL(baseHref, "https://www.sodimac.cl");
    const isSodimac = /(^|\.)sodimac\.cl$/i.test(url.hostname);

    if (isSodimac) {
      const normalizedSearch = url.search.length > 1 ? url.search : "";
      const base = `${url.origin}${url.pathname}${normalizedSearch}`;
      const separator = normalizedSearch ? "&" : "?";
      return `%%=RedirectTo(concat('${base}${separator}',@prefix))=%%`;
    }

    return url.href;
  } catch {
    // Si no es URL válida, la dejamos tal cual
  }

  return href;
}

/**
 * Asegura que la ruta de la imagen tenga un host válido cuando se emplean rutas relativas.
 *
 * @param {string} u - Ruta de la imagen ingresada.
 * @returns {string} Ruta absoluta si se reconoce como relativa, o el valor original.
 * @example
 * normalizeImg('/img/banner.png')
 * // => "https://www.sodimac.cl/img/banner.png"
 */
function normalizeImg(u) {
  const val = String(u || "").trim();
  if (!val) return "";
  if (val.startsWith("http")) return val;
  if (val.startsWith("/")) return `https://www.sodimac.cl${val}`;
  return val;
}

/**
 * Modal de creación y edición de banners, normaliza URLs y permite importar datos desde HTML pegado.
 *
 * @param {object} props - Propiedades del componente.
 * @param {boolean} props.open - Controla la visibilidad del modal.
 * @param {Function} props.onClose - Callback al cerrar, recibe el payload creado/actualizado o null.
 * @param {object} [props.initial] - Banner existente para modo edición.
 * @param {Function} [props.onSaved] - Callback de éxito tras guardar.
 * @param {Function} [props.onError] - Callback de error al guardar.
 * @returns {JSX.Element|null} Modal listo para renderizar o null cuando está cerrado.
 * @example
 * <CreateBannerDialog open={open} onClose={handleClose} />
 */
export default function CreateBannerDialog({ open, onClose, initial, onSaved, onError }) {
  const [nombre, setNombre] = useState(initial?.nombre || "");
  const [href, setHref] = useState(initial?.href || "");
  const [img, setImg] = useState(initial?.img_src || "");
  const [alt, setAlt] = useState(initial?.alt || "");
  const [htmlSrc, setHtmlSrc] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setNombre(initial?.nombre || "");
      setHref(initial?.href || "");
      setImg(initial?.img_src || "");
      setAlt(initial?.alt || "");
      setHtmlSrc("");
    }
  }, [open, initial]);

  /**
   * Extrae href, src y alt de un fragmento HTML y actualiza los inputs del formulario.
   *
   * @returns {void}
   * @example
   * importHtml();
   */
  function importHtml() {
    try {
      // Extracción muy básica: busca href, src y alt en el HTML pegado
      const hrefMatch = htmlSrc.match(/href\s*=\s*"([^"]+)"/i);
      const imgMatch = htmlSrc.match(/<img[^>]*src\s*=\s*"([^"]+)"/i);
      const altMatch = htmlSrc.match(/<img[^>]*alt\s*=\s*"([^"]*)"/i);
      if (hrefMatch) setHref(hrefMatch[1]);
      if (imgMatch) setImg(imgMatch[1]);
      if (altMatch) {
        setAlt(altMatch[1]);
        if (!nombre && altMatch[1]) setNombre(altMatch[1]);
      }
    } catch {
      // noop
    }
  }

  /**
   * Gestiona el envío del formulario, llama al backend cuando se crea un banner nuevo
   * y devuelve los datos normalizados al componente padre.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - Evento de formulario.
   * @returns {Promise<void>} Operación asíncrona que resuelve tras guardar o manejar el error.
   * @example
   * <form onSubmit={handleSubmit}>…</form>
   */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!nombre || !img) return; // href opcional para huinchas
    setSaving(true);
    setError("");
    const payload = {
      nombre,
      href: normalizeHrefToAmp(href),
      img_src: normalizeImg(img),
      alt,
    };
    // Modo edición: si viene un "initial" con id, no llamar al backend.
    // Devolvemos los datos editados al contenedor para que actualice su estado.
    if (initial?.id) {
      try {
        try { onSaved && onSaved(payload); } catch {}
        onClose?.(payload);
      } catch (err) {
        console.error(err);
        setError(String(err.message || err) || 'Error desconocido');
        try { onError && onError(String(err.message || err)); } catch {}
      } finally {
        setSaving(false);
      }
      return;
    }
    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || 'No se pudo guardar el banner');
      }
      const saved = json?.data || payload;
      // Avisar éxito hacia el contenedor
      try { onSaved && onSaved(saved); } catch {}
      onClose?.(saved);
    } catch (err) {
      console.error(err);
      setError(String(err.message || err) || 'Error desconocido');
      try { onError && onError(String(err.message || err)); } catch {}
    } finally {
      setSaving(false);
    }
  }
  
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start md:items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-5 shadow-soft" data-component-name="CreateBannerDialog">
        <div className="text-xl font-semibold mb-4 text-slate-100" data-component-name="CreateBannerDialog">
          {initial ? "Editar banner" : "Crear banner"}
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <label className="text-sm space-y-1">
              <span className="text-slate-300">Nombre</span>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </label>
            <label className="text-sm space-y-1">
              <span className="text-slate-300">Alt</span>
              <input
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Texto alternativo"
              />
            </label>
          </div>

          <label className="text-sm space-y-1 block">
            <span className="text-slate-300">URL destino (href)</span>
            <input
              value={href}
              onChange={(e) => setHref(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://... (opcional)"
            />
          </label>

          <label className="text-sm space-y-1 block">
            <span className="text-slate-300">Imagen (src)</span>
            <input
              value={img}
              onChange={(e) => setImg(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </label>

          <details className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <summary className="cursor-pointer text-sm text-slate-200 mb-2">
              Importar desde HTML
            </summary>
            <textarea
              value={htmlSrc}
              onChange={(e) => setHtmlSrc(e.target.value)}
              className="w-full h-28 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200 placeholder-slate-500"
              placeholder="<table>..."
            />
            <div className="mt-2">
              <button
                type="button"
                onClick={importHtml}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100"
              >
                Extraer datos
              </button>
            </div>
          </details>

          {error && (
            <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onClose?.(null)}
              className="px-3 py-1.5 rounded-lg border border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white"
            >
              {saving ? 'Guardando…' : (initial ? "Guardar cambios" : "Crear")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
