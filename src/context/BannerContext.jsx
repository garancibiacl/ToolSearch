import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchCatalog } from "../api/catalog.js";

const BannerContext = createContext(null);

// Utilidad simple para generar IDs
let AUTO_ID = 1000;
const nextId = () => ++AUTO_ID;

export function BannerProvider({ children }) {
  const initial = useMemo(
    () => [
      {
        id: 1,
        nombre: "Banner Promocional 1",
        alt: "Banner promocional especial",
        categoria: "Promocional",
        fileSize: "45KB",
        href: "https://ejemplo.com/promo1",
        width: 600,
        height: 200,
        img_src:
          "https://placehold.co/600x200/0b1220/9aa7bd?text=Promocional+1",
        tags: ["promo", "especial"],
      },
      {
        id: 2,
        nombre: "Banner Producto 1",
        alt: "Banner de producto destacado",
        categoria: "Producto",
        fileSize: "52KB",
        href: "https://ejemplo.com/prod1",
        width: 600,
        height: 200,
        img_src: "https://placehold.co/600x200/0b1220/c7d2fe?text=Producto+1",
        tags: ["producto"],
      },
      {
        id: 3,
        nombre: "Banner Invierno",
        alt: "Descuentos de temporada",
        categoria: "Estacional",
        fileSize: "39KB",
        href: "https://ejemplo.com/inv",
        width: 600,
        height: 200,
        img_src: "https://placehold.co/600x200/111827/94a3b8?text=Invierno",
        tags: ["invierno", "promo"],
      },
    ],
    []
  );

  const [banners, setBanners] = useState(initial);
  const [catalog, setCatalog] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedStack, setSelectedStack] = useState([]);
  const [recentsMap, setRecentsMap] = useState(() => new Map());

  const ensureInList = (b) => {
    setBanners((prev) => {
      const exists = prev.some((x) => x.id === b.id);
      return exists ? prev : [b, ...prev];
    });
  };

  const selectAndAppend = (bOrId) => {
    let banner;
    if (typeof bOrId === "object") {
      banner = bOrId.id ? bOrId : { ...bOrId, id: nextId() };
    } else {
      const found = banners.find((x) => x.id === bOrId);
      if (!found) return null;
      banner = found;
    }
    ensureInList(banner);
    setSelected(banner);
    setSelectedStack((prev) => {
      const exists = prev.find((x) => x.id === banner.id);
      if (exists) return [...prev];
      return [...prev, banner];
    });
    setRecentsMap((prev) => {
      const m = new Map(prev);
      m.set(banner.id, (m.get(banner.id) || 0) + 1);
      return m;
    });
    return banner;
  };

  // Cargar catálogo externo con API wrapper
  useEffect(() => {
    (async () => {
      const data = await fetchCatalog();
      setCatalog((prev) => (prev.length ? prev : data));
    })();
  }, []);

  const searchCatalog = useCallback(
    (q, limit = 8) => {
      const term = (q || "").toLowerCase().trim();
      if (!term) return [];
      return catalog
        .filter((b) =>
          [b.nombre, b.alt, b.href, (b.tags || []).join(" ")]
            .join(" ")
            .toLowerCase()
            .includes(term)
        )
        .slice(0, limit);
    },
    [catalog]
  );

  const addBanner = useCallback((banner) => {
    const payload = banner.id ? banner : { ...banner, id: nextId() };
    ensureInList(payload);
    return payload;
  }, []);

  const deleteBanner = (idOrBanner) => {
    const id = typeof idOrBanner === "object" ? idOrBanner.id : idOrBanner;
    setBanners((prev) => prev.filter((b) => b.id !== id));
    setSelectedStack((prev) => prev.filter((b) => b.id !== id));
    setSelected((s) => (s?.id === id ? null : s));
  };

  const copyHtml = async (b) => {
    const banner = b || selected;
    if (!banner) return;
    const imageHtml = `<img src="${banner.img_src}" alt="${
      banner.alt || ""
    }" width="${banner.width || 600}" height="${
      banner.height || 200
    }" style="display:block;max-width:100%;">`;
    const html = `<table width="600" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
  <tr>
    <td>
      <a href="${
        banner.href || "#"
      }" target="_blank" style="text-decoration:none;">
        ${imageHtml}
      </a>
    </td>
  </tr>
</table>`;
    try {
      await navigator.clipboard.writeText(html);
    } catch {}
  };

  const clearStack = () => setSelectedStack([]);

  const value = {
    banners,
    setBanners,
    catalog,
    selected,
    setSelected,
    selectedStack,
    setSelectedStack,
    selectAndAppend,
    addBanner,
    searchCatalog,
    deleteBanner,
    copyHtml,
    recentsMap,
    clearStack,
  };

  return (
    <BannerContext.Provider value={value}>{children}</BannerContext.Provider>
  );
}

export const useBanners = () => {
  const ctx = useContext(BannerContext);
  if (!ctx) throw new Error("useBanners must be used within BannerProvider");
  return ctx;
};
