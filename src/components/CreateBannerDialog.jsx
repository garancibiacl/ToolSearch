import React, { useEffect, useState } from "react";

function normalizeHrefToAmp(h) {
  const href = String(h || "").trim();
  if (!href) return "";
  if (/RedirectTo\(concat\(/.test(href)) return href; // ya está en AMPscript
  try {
    const url = new URL(href, "https://www.sodimac.cl");
    const isSodimac = /(^|\.)sodimac\.cl$/i.test(url.hostname);
    if (isSodimac) {
      const hasQuery = href.includes("?");
      const sep = hasQuery ? "&" : "?";
      return `%%=RedirectTo(concat('${href}${sep}',@prefix))=%%`;
    }
  } catch {
    // Si no es URL válida, la dejamos tal cual
  }
  return href;
}

function normalizeImg(u) {
  const val = String(u || "").trim();
  if (!val) return "";
  if (val.startsWith("http")) return val;
  if (val.startsWith("/")) return `https://www.sodimac.cl${val}`;
  return val;
}

export default function CreateBannerDialog({ open, onClose, initial }) {
  const [nombre, setNombre] = useState(initial?.nombre || "");
  const [href, setHref] = useState(initial?.href || "");
  const [img, setImg] = useState(initial?.img_src || "");
  const [alt, setAlt] = useState(initial?.alt || "");
  const [htmlSrc, setHtmlSrc] = useState("");

  useEffect(() => {
    if (open) {
      setNombre(initial?.nombre || "");
      setHref(initial?.href || "");
      setImg(initial?.img_src || "");
      setAlt(initial?.alt || "");
      setHtmlSrc("");
    }
  }, [open, initial]);

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

  function handleSubmit(e) {
    e.preventDefault();
    if (!nombre || !img) return; // href opcional para huinchas
    const payload = {
      nombre,
      href: normalizeHrefToAmp(href),
      img_src: normalizeImg(img),
      alt,
    };
    onClose?.(payload);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start md:items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-soft">
        <div className="text-lg font-semibold mb-4">
          {initial ? "Editar banner" : "Crear banner"}
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <label className="text-sm space-y-1">
              <span>Nombre</span>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
                required
              />
            </label>
            <label className="text-sm space-y-1">
              <span>Alt</span>
              <input
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
                placeholder="Texto alternativo"
              />
            </label>
          </div>

          <label className="text-sm space-y-1 block">
            <span>URL destino (href)</span>
            <input
              value={href}
              onChange={(e) => setHref(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
              placeholder="https://... (opcional)"
            />
          </label>

          <label className="text-sm space-y-1 block">
            <span>Imagen (src)</span>
            <input
              value={img}
              onChange={(e) => setImg(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
              required
            />
          </label>

          <details className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <summary className="cursor-pointer text-sm text-slate-300 mb-2">
              Importar desde HTML
            </summary>
            <textarea
              value={htmlSrc}
              onChange={(e) => setHtmlSrc(e.target.value)}
              className="w-full h-28 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono"
              placeholder="<table>..."
            />
            <div className="mt-2">
              <button
                type="button"
                onClick={importHtml}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700"
              >
                Extraer datos
              </button>
            </div>
          </details>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onClose?.(null)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              {initial ? "Guardar cambios" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
