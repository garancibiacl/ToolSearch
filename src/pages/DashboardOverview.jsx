import React, { useEffect, useState } from "react";
import {
  Search,
  Grid3X3,
  BarChart3,
  Users,
  TrendingUp,
  Zap,
} from "lucide-react";

export default function DashboardOverview({ setActive }) {
  const [bannersCount, setBannersCount] = useState(0);

  const fetchBannersCount = async () => {
    try {
      const res = await fetch("/backend/data/banners.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setBannersCount(Array.isArray(data) ? data.length : 0);
    } catch (e) {
      setBannersCount(0);
    }
  };

  useEffect(() => {
    fetchBannersCount();
    const id = setInterval(fetchBannersCount, 60_000);
    return () => clearInterval(id);
  }, []);

  const stats = [
    {
      title: "Herramientas Activas",
      value: "2",
      description: "Herramientas disponibles",
      icon: Zap,
      trend: "+1 esta semana",
    },
    {
      title: "Banners Gestionados",
      value: String(bannersCount),
      description: "Total de banners",
      icon: BarChart3,
      trend: "+12% vs mes anterior",
    },
    {
      title: "Usuarios Activos",
      value: "1",
      description: "Usuarios activos hoy",
      icon: Users,
      trend: "En línea ahora",
    },
    {
      title: "Rendimiento",
      value: "98.5%",
      description: "Tiempo de actividad",
      icon: TrendingUp,
      trend: "+0.5% vs ayer",
    },
  ];

  const tools = [
    {
      id: "banner-search",
      name: "Buscador Banner",
      description: "Gestiona y busca banners HTML",
      category: "Emails",
      icon: "Search",
      isActive: true,
    },
    {
      id: "layout-grid",
      name: "Layout Grid",
      description: "Compón interfaces con grillas",
      category: "UI",
      icon: "Grid3X3",
      isActive: true,
    },
    // Placeholder para futura herramienta de Precio (inactiva)
    {
      id: "price-url",
      name: "Precio",
      description: "Consulta y gestión de URL de Precio",
      category: "Datos",
      icon: "TrendingUp",
      isActive: false,
    },
  ];

  const openTool = (id) => {
    if (id === "banner-search") setActive?.("banner");
    if (id === "layout-grid") setActive?.("grid");
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => {
          const isHighlight = s.title === "Herramientas Activas";
          const isBannerStat = s.title === "Banners Gestionados";
          return (
            <div
              key={i}
              className={`card transition-colors ${
                isHighlight
                  ? "border border-emerald-600/40 ring-1 ring-emerald-500/20 bg-emerald-500/5"
                  : "hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center justify-between pb-2">
                <div className="text-sm font-medium text-slate-300">
                  {s.title}
                </div>
                <div className="flex items-center gap-2">
                  <s.icon
                    className={`h-4 w-4 ${
                      isHighlight ? "text-emerald-400" : "text-slate-400"
                    }`}
                  />
                </div>
              </div>
              <div
                className={`text-2xl font-semibold ${
                  isHighlight ? "text-emerald-300" : "text-slate-100"
                }`}
              >
                {s.value}
              </div>
              <p className="text-xs text-slate-400">{s.description}</p>
              <p
                className={`text-xs mt-1 ${
                  isHighlight ? "text-emerald-400" : "text-indigo-400"
                }`}
              >
                {s.trend}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tools Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => tool.isActive && openTool(tool.id)}
            className={`card text-left group ${
              tool.isActive
                ? "cursor-pointer border border-emerald-700/40 ring-1 ring-emerald-500/10 hover:ring-emerald-500/30 hover:bg-emerald-500/5"
                : "opacity-80"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {tool.icon === "Search" && (
                  <Search className="h-6 w-6 text-indigo-400" />
                )}
                {tool.icon === "Grid3X3" && (
                  <Grid3X3 className="h-6 w-6 text-slate-400" />
                )}
                {tool.icon === "TrendingUp" && (
                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                )}
                <div>
                  <div className="text-lg font-semibold text-slate-100">
                    {tool.name}
                  </div>
                  <div className="text-sm text-slate-400">
                    {tool.description}
                  </div>
                </div>
              </div>
              {tool.isActive ? (
                <span className="badge rounded-full px-3 py-1 bg-emerald-700/20 text-emerald-400 border border-emerald-700/40 ring-1 ring-emerald-600/25">
                  Activa
                </span>
              ) : (
                <span className="badge">Próximamente</span>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Categoría: {tool.category}
              </span>
              <span
                className={`text-sm ${
                  tool.isActive
                    ? "text-emerald-400 group-hover:underline"
                    : "text-slate-500"
                }`}
              >
                {tool.isActive ? "Abrir" : "Próximamente"}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="mb-3">
          <div className="text-slate-100 font-semibold">Acciones Rápidas</div>
          <div className="text-slate-400 text-sm">
            Accede rápidamente a las funciones más utilizadas
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => openTool("banner-search")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-violet-500 hover:from-sky-600 hover:to-violet-600 text-white rounded-xl px-3 py-2 text-sm"
          >
            <Search className="w-4 h-4" />
            Buscar Banners
          </button>
          <button
            onClick={() => openTool("layout-grid")}
            className="inline-flex items-center gap-2 border border-slate-700/80 text-slate-200 rounded-xl px-3 py-2 text-sm hover:bg-slate-800"
          >
            <Grid3X3 className="w-4 h-4" />
            Abrir Layout Grid
          </button>
          <button
            disabled
            className="inline-flex items-center gap-2 border border-slate-700/80 text-slate-300 rounded-xl px-3 py-2 text-sm opacity-70"
          >
            <TrendingUp className="w-4 h-4" />
            Precio (Próximamente)
          </button>
        </div>
      </div>
    </div>
  );
}
