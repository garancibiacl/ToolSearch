import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Search,
  Code,
  Eye,
  Copy,
  Download,
  Upload,
  Trash2,
  Image as ImageIcon,
  X,
  Pencil,
} from "lucide-react";
import { useBanners } from "../context/BannerContext.jsx";
import CreateBannerDialog from "../components/CreateBannerDialog.jsx";

export default function BannerSearchApp() {
  // Contexto compartido de banners
  const {
    banners,
    selectAndAppend,
    selected,
    selectedStack,
    clearStack,
    deleteBanner,
    copyHtml,
    searchCatalog,
    addBanner,
  } = useBanners();

  // Modal de creación de banner
  const [openCreate, setOpenCreate] = useState(false);
  const onCloseCreate = (payload) => {
    setOpenCreate(false);
    if (payload) {
      const created = addBanner(payload);
      // Apilar inmediatamente para que se vea en Vista previa
      selectAndAppend(created);
    }
  };
  // Fuente externa: ahora usamos searchCatalog del contexto para sugerencias
  const [external, setExternal] = useState([]);
  const [extLoaded, setExtLoaded] = useState(false);

  const categories = useMemo(() => {
    const allCats = banners
      .map((b) => b.category || b.categoria)
      .filter(Boolean);
    return ["Todos", ...Array.from(new Set(allCats))];
  }, [banners]);

  // Estado del buscador (persistente en localStorage)
  const [searchQuery, setSearchQuery] = useState("");
  const [local, setLocal] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const boxRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ left: 0, top: 0, width: 0 });
  const [debouncedLocal, setDebouncedLocal] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [useAmpScript, setUseAmpScript] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const listRef = useRef(null);
  const [loaded, setLoaded] = useState(() => new Set());
  const listItemRefs = useRef({});

  // Simple toast system
  const [toasts, setToasts] = useState([]);
  const showToast = (text, variant = "default") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, text, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 1800);
  };

  const focusListItem = (id) => {
    // scroll the left list to the target item if present
    const el = listItemRefs.current[id];
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      // flash highlight
      el.classList.add("flash-highlight");
      setTimeout(() => {
        el.classList.remove("flash-highlight");
      }, 1200);
    }
  };

  // La búsqueda principal no filtra la lista; solo la categoría lo hace.
  // Mezclamos banners con selectedStack para asegurar que lo recién agregado aparezca de inmediato.
  const merged = useMemo(() => {
    const map = new Map();
    [...banners, ...selectedStack].forEach((b) => {
      if (!b || !("id" in b)) return;
      if (!map.has(b.id)) map.set(b.id, b);
    });
    return Array.from(map.values());
  }, [banners, selectedStack]);

  const filteredBanners = merged.filter((b) => {
    const category = b.category || b.categoria || "";
    const matchesCat =
      selectedCategory === "Todos" || category === selectedCategory;
    return matchesCat;
  });

  const selectedBanner = selected || filteredBanners[0] || banners[0];
  // Normalizar para vista/código
  const normalizedSelected = selectedBanner
    ? {
        src: selectedBanner.src || selectedBanner.img_src,
        alt: selectedBanner.alt || "",
        href: selectedBanner.href || "#",
        width: selectedBanner.width || 600,
        height: selectedBanner.height || 200,
      }
    : null;

  const generateHtmlCode = (banner) => {
    if (!banner) return "";
    const imageHtml = `<img src="${banner.src}" alt="${banner.alt}" width="${
      banner.width || 600
    }" height="${
      banner.height || 200
    }" style="display: block; max-width: 100%;">`;
    if (useAmpScript) {
      return `<table width="600" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">\n  <tr>\n    <td>\n      %%[\n      var @link = "${banner.href}"\n      ]%%\n      <a href="%%=v(@link)=%%" target="_blank" style="text-decoration: none;">\n        ${imageHtml}\n      </a>\n    </td>\n  </tr>\n</table>`;
    }
    return `<table width="600" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">\n  <tr>\n    <td>\n      <a href="${banner.href}" target="_blank" style="text-decoration: none;">\n        ${imageHtml}\n      </a>\n    </td>\n  </tr>\n</table>`;
  };

  const code = useMemo(
    () =>
      generateHtmlCode(
        selectedBanner
          ? {
              src: normalizedSelected.src,
              alt: normalizedSelected.alt,
              href: normalizedSelected.href,
              width: normalizedSelected.width,
              height: normalizedSelected.height,
            }
          : null
      ),
    [selectedBanner, useAmpScript]
  );

  // Cargar y persistir el término de búsqueda en localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bannerSearchQuery") || "";
      setLocal(saved);
      setSearchQuery(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("bannerSearchQuery", local);
    } catch {}
  }, [local]);

  // Debounce del término local
  useEffect(() => {
    const id = setTimeout(() => setDebouncedLocal(local.trim()), 250);
    return () => clearTimeout(id);
  }, [local]);

  // Reset activeIndex when list changes or opens
  useEffect(() => {
    if (dropdownOpen) setActiveIndex(0);
  }, [dropdownOpen, debouncedLocal]);

  // Código AMPscript combinado según elementos en la vista previa (selectedStack)
  const bannerToAmpRow = (b) => {
    if (!b) return "";
    const href = b.href || "#";
    const src = b.src || b.img_src || "";
    const alt = b.alt || "";
    return `  <tr>\n    <td colspan="2" align="center">\n      <a href="%%=RedirectTo(concat('${href}',@prefix))=%%" target="_blank">\n         <img src="${src}" alt="${alt}" style="display:block; width: 100%;" border="0">\n       </a>\n    </td>\n  </tr>`;
  };
  const combinedCode = useMemo(() => {
    if (!selectedStack || selectedStack.length === 0) return "";
    const rows = selectedStack.map(bannerToAmpRow).join("\n");
    return `<table width="600" cellspacing="0" cellpadding="0" align="center">\n\n${rows}\n\n</table>`;
  }, [selectedStack]);

  // Calcular posición del dropdown para portal
  const updateDropdownPosition = () => {
    const el = boxRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // 8px de separación (similar a mt-2)
    setDropdownPos({
      left: rect.left,
      top: rect.bottom + 8,
      width: rect.width,
    });
  };

  useEffect(() => {
    if (!dropdownOpen) return;
    updateDropdownPosition();
    const onWin = () => updateDropdownPosition();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);
    return () => {
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [dropdownOpen]);

  // Ya no necesitamos fetch manual: searchCatalog del contexto cubre la fuente externa

  // Sugerencias basadas en el término "local" (combina internos + catálogo)
  const suggestions = useMemo(() => {
    const q = (debouncedLocal || "").toLowerCase().trim();
    if (!q) return [];
    // Internos (banners ya agregados)
    const internalMatches = banners
      .filter((b) => {
        const name = b.name || b.nombre || "";
        const category = b.category || b.categoria || "";
        const tagStr = (b.tags || []).join(" ");
        const text = [name, b.alt || "", b.href || "", category, tagStr]
          .join(" ")
          .toLowerCase();
        return text.includes(q);
      })
      .map((b) => ({
        source: "internal",
        id: b.id,
        nombre: b.name || b.nombre,
        alt: b.alt,
        href: b.href,
        img_src: b.src || b.img_src,
      }));
    // Catálogo (externo) vía contexto
    const catalog = searchCatalog ? searchCatalog(q, 8) : [];
    const catalogMatches = catalog.map((b) => ({
      source: "catalog",
      id: b.id,
      nombre: b.nombre || b.name,
      alt: b.alt,
      href: b.href,
      img_src: b.img_src || b.src,
      _raw: b,
    }));

    return [...internalMatches, ...catalogMatches].slice(0, 8);
  }, [debouncedLocal, banners, searchCatalog]);

  const selectSuggestion = (s) => {
    setLocal(s.nombre);
    setSearchQuery(s.nombre);

    let added;
    if (s.source === "internal" && typeof s.id === "number") {
      const found = banners.find((d) => d.id === s.id);
      if (found) added = selectAndAppend(found);
    } else if (s.source === "catalog" && s._raw) {
      // Agregar desde catálogo y luego seleccionar por id
      const payload = addBanner
        ? addBanner({
            id: s._raw.id,
            nombre: s._raw.nombre,
            alt: s._raw.alt || "",
            href: s._raw.href || "#",
            img_src: s._raw.img_src || "",
            categoria: s._raw.categoria || "Importado",
            width: s._raw.width || 600,
            height: s._raw.height || 200,
            tags: s._raw.tags || ["externo"],
          })
        : null;
      // Importante: pasar el objeto para apilar de inmediato, no solo el id
      added = payload ? selectAndAppend(payload) : null;
    }

    // Asegurar visibilidad del ítem seleccionado en la lista
    setSelectedCategory("Todos");

    // Limpiar input y storage para evitar confusión y cerrar menú
    setLocal("");
    setSearchQuery("");
    try {
      localStorage.removeItem("bannerSearchQuery");
    } catch {}
    setDropdownOpen(false);

    // Toast
    if (s?.nombre) showToast(`Agregado: ${s.nombre}`);

    // Hacer scroll hacia el ítem agregado
    if (added?.id) {
      // esperar a que el DOM pinte la nueva fila
      requestAnimationFrame(() => focusListItem(added.id));
    }
  };

  // Acción: limpiar pila seleccionada
  const onClearLocalStack = () => {
    clearStack();
    setLoaded(new Set());
  };

  // Auto-scroll al final cuando hay 5+ items en la pila
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    if ((selectedStack?.length || 0) >= 5) {
      el.scrollTop = el.scrollHeight;
    }
  }, [selectedStack]);

  // Cerrar dropdown al clickear fuera
  useEffect(() => {
    const onClick = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  const onImport = () => {
    /* placeholder */
  };
  const onDelete = () => {
    /* placeholder */
  };

  return (
    <div className="space-y-6">
      {/* Controles de búsqueda */}
      <div className="card">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-200 font-medium">Filtros de Búsqueda</h3>
        </div>
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          {/* Buscador centrado con sugerencias */}
          <div className="relative flex-1 z-[9999]" ref={boxRef}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              value={local}
              onChange={(e) => {
                setLocal(e.target.value);
                setDropdownOpen(true);
                setSearchQuery(e.target.value);
              }}
              onFocus={() => setDropdownOpen(true)}
              onKeyDown={(e) => {
                if (!dropdownOpen || suggestions.length === 0) return;
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActiveIndex((i) =>
                    Math.min(i + 1, suggestions.length - 1)
                  );
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveIndex((i) => Math.max(i - 1, 0));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  const s = suggestions[activeIndex];
                  if (s) selectSuggestion(s);
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  setDropdownOpen(false);
                }
              }}
              type="text"
              placeholder="Escribe nombre de banner Ej. Catálogo OTIN..."
              className="w-full pl-12 pr-14 py-3 rounded-full bg-slate-900/80 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-soft text-sm text-slate-200 placeholder-slate-400"
            />
            {local && (
              <button
                type="button"
                onClick={() => {
                  setLocal("");
                  setSearchQuery("");
                  setDropdownOpen(false);
                  localStorage.removeItem("bannerSearchQuery");
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-7 w-7 inline-flex items-center justify-center rounded-full hover:bg-slate-700/70 text-slate-300"
                title="Limpiar búsqueda"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {dropdownOpen &&
              suggestions.length > 0 &&
              createPortal(
                <div
                  className="fixed rounded-2xl border border-slate-700/80 bg-slate-900 shadow-soft overflow-hidden z-[9999]"
                  style={{
                    left: dropdownPos.left,
                    top: dropdownPos.top,
                    width: dropdownPos.width,
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {suggestions.map((s, i) => (
                    <button
                      key={s.id || i}
                      onClick={() => selectSuggestion(s)}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 ${
                        i === activeIndex
                          ? "bg-slate-800"
                          : "hover:bg-slate-800"
                      }`}
                    >
                      <img
                        src={s.img_src}
                        alt={s.alt || s.nombre}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium text-sm text-slate-100">
                          {s.nombre}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {s.alt || s.href}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>,
                document.body
              )}
          </div>

          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setOpenCreate(true)}
            className="inline-flex items-center gap-2 justify-center bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-3 py-2 text-sm"
            data-component-name="BannerSearchApp"
          >
            <Plus className="h-4 w-4" />
            Agregar Banner
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Banners */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="mb-2">
              <div className="text-slate-200 font-medium">
                Banners ({filteredBanners.length})
              </div>
              <div className="text-slate-400 text-sm">
                Selecciona un banner para ver la vista previa y obtener el
                código
              </div>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredBanners.map((b) => (
                <button
                  key={b.id}
                  ref={(el) => {
                    if (el) {
                      listItemRefs.current[b.id] = el;
                    }
                  }}
                  onClick={() => {
                    const ret = selectAndAppend(b);
                    if (ret?.id) focusListItem(ret.id);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    selected?.id === b.id
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-slate-700/80 hover:border-indigo-500/50 hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={b.src || b.img_src}
                      alt={b.alt || b.name || b.nombre}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">
                        {(() => {
                          const n = b.nombre || b.name || "";
                          const isHuincha = n
                            .trim()
                            .toUpperCase()
                            .startsWith("HUINCHA ");
                          return isHuincha ? `HUINCHA · ${n}` : n;
                        })()}
                      </div>
                      <div className="mt-1 text-xs text-slate-400 truncate">
                        {b.alt}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        title="Editar"
                        aria-label="Editar"
                        onClick={(e) => {
                          e.stopPropagation(); /* TODO: onEdit(b) */
                        }}
                        className="p-1 rounded-md hover:bg-slate-700/70 text-slate-300"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        title="Eliminar"
                        aria-label="Eliminar"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBanner(b.id);
                          showToast("Banner eliminado", "warn");
                        }}
                        className="p-1 rounded-md hover:bg-slate-700/70 text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        title="Copiar HTML"
                        aria-label="Copiar HTML"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyHtml(b);
                          showToast("HTML copiado");
                        }}
                        className="p-1 rounded-md hover:bg-slate-700/70 text-blue-400"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </button>
              ))}
              {filteredBanners.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  No se encontraron banners
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vista Previa (pila de seleccionados) */}
        <div className="lg:col-span-1">
          <div className="card">
            {/* Encabezado y contador */}
            <div className="flex items-center justify-between mb-2">
              <div className="text-slate-200 font-medium">Vista previa</div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-600/40">
                  {selectedStack?.length || 0} banners agregados
                </span>
                <button
                  type="button"
                  onClick={onClearLocalStack}
                  disabled={(selectedStack?.length || 0) === 0}
                  className={`text-xs px-2 py-1 rounded-lg border ${
                    (selectedStack?.length || 0) === 0
                      ? "border-slate-800 text-slate-500 cursor-not-allowed"
                      : "border-slate-700 text-slate-300 hover:bg-slate-800"
                  }`}
                  title="Limpiar seleccionados"
                  aria-label="Limpiar seleccionados"
                >
                  Limpiar
                </button>
              </div>
            </div>

            {/* Estado vacío */}
            {(selectedStack?.length || 0) === 0 && (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                <ImageIcon className="h-14 w-14 mb-2 opacity-60" />
                <div className="text-sm">Esperando selección…</div>
              </div>
            )}

            {/* Lista scrolleable con placeholders */}
            {(selectedStack?.length || 0) > 0 && (
              <div className="mt-2">
                <div
                  ref={listRef}
                  className="max-h-96 overflow-auto space-y-6 pr-1"
                >
                  {selectedStack.map((b, idx) => {
                    const key = `${b.id}-${idx}`;
                    const isLoaded = loaded.has(key);
                    return (
                      <div key={key} className="bg-transparent">
                        <div className="relative">
                          {!isLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 border border-slate-800 rounded-xl animate-pulse">
                              <ImageIcon className="h-10 w-10 opacity-60" />
                            </div>
                          )}
                          <img
                            src={b.src || b.img_src}
                            alt={b.alt || b.name || b.nombre}
                            className="w-full rounded-xl object-cover border border-slate-800"
                            onLoad={() =>
                              setLoaded((prev) => {
                                const n = new Set(prev);
                                n.add(key);
                                return n;
                              })
                            }
                          />
                        </div>

                        {/* Título + chip */}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <div className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 max-w-full truncate">
                            {b.name || b.nombre || "Sin título"}
                          </div>
                          {(() => {
                            const nombre = (b.nombre || b.name || "")
                              .trim()
                              .toUpperCase();
                            const isHuinchaByName =
                              nombre === "HUINCHA VOA HOGAR";
                            const label = isHuinchaByName
                              ? "Huincha"
                              : "Banner";
                            const bg = isHuinchaByName ? "#ffcba4" : "#b0eac4";
                            const color = "#0a0a0a";
                            return (
                              <span
                                className="text-[10px] px-2 py-0.5 rounded-md"
                                style={{ backgroundColor: bg, color }}
                              >
                                {label}
                              </span>
                            );
                          })()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Código HTML */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="mb-3">
              <div className="text-slate-200 font-medium">Código HTML</div>
              <div className="text-slate-400 text-sm">
                Código optimizado para email marketing
              </div>
            </div>

            {/* Toggle AMPScript */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-300">
                Usar AMPscript (Salesforce)
              </span>
              <button
                onClick={() => setUseAmpScript((v) => !v)}
                className={`relative w-14 h-7 rounded-full ${
                  useAmpScript ? "bg-indigo-500" : "bg-slate-600"
                }`}
              >
                <span
                  className={`absolute top-0.5 ${
                    useAmpScript ? "left-7" : "left-0.5"
                  } w-6 h-6 rounded-full bg-white transition-all`}
                />
              </button>
            </div>

            <div className="relative">
              <textarea
                className="w-full h-56 bg-slate-900/70 border border-slate-700/80 rounded-xl p-3 text-xs font-mono text-slate-200"
                readOnly
                value={combinedCode}
              />
              <button
                className="absolute top-3 right-12 inline-flex items-center justify-center h-9 w-9 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600"
                title="Copiar"
                onClick={() => {
                  copy(combinedCode);
                  showToast("HTML copiado");
                }}
              >
                <Copy className="h-5 w-5" />
              </button>
              <button
                className="absolute top-3 right-3 inline-flex items-center justify-center h-9 w-9 rounded-xl bg-slate-700 text-white hover:bg-slate-600"
                title="Descargar"
              >
                <Download className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={onImport}
                className="inline-flex items-center gap-2 border border-slate-700/80 text-slate-200 rounded-xl px-3 py-2 text-sm"
              >
                <Upload className="w-4 h-4" />
                Importar HTML
              </button>
              <button
                onClick={onDelete}
                className="inline-flex items-center gap-2 border border-slate-700/80 text-slate-200 rounded-xl px-3 py-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer items={toasts} />
      {openCreate &&
        createPortal(
          <CreateBannerDialog
            open={openCreate}
            onClose={onCloseCreate}
            initial={null}
            onSaved={(saved) => showToast(`Guardado: ${saved?.nombre || saved?.name || 'banner'}`)}
            onError={(msg) => showToast(msg || 'Error al guardar', 'warn')}
          />,
          document.body
        )}
    </div>
  );
}

// Toast container portal
function ToastContainer({ items }) {
  if (!items || items.length === 0) return null;
  return createPortal(
    <div className="fixed bottom-4 right-4 space-y-2 z-[10000]">
      {items.map((t) => (
        <div
          key={t.id}
          className={`px-3 py-2 rounded-lg text-sm shadow-soft border ${
            t.variant === "warn"
              ? "bg-red-500/15 border-red-500/40 text-red-100"
              : "bg-slate-800/90 border-slate-700 text-slate-100"
          }`}
        >
          {t.text}
        </div>
      ))}
    </div>,
    document.body
  );
}
