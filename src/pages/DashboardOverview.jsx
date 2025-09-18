import React from 'react'
import { Search, Grid3X3, BarChart3, Users, TrendingUp, Zap } from 'lucide-react'

export default function DashboardOverview({ setActive }) {
  const stats = [
    { title: 'Herramientas Activas', value: '2', description: 'Herramientas disponibles', icon: Zap, trend: '+1 esta semana' },
    { title: 'Banners Gestionados', value: '125', description: 'Total de banners', icon: BarChart3, trend: '+12% vs mes anterior' },
    { title: 'Usuarios Activos', value: '1', description: 'Usuarios activos hoy', icon: Users, trend: 'En línea ahora' },
    { title: 'Rendimiento', value: '98.5%', description: 'Tiempo de actividad', icon: TrendingUp, trend: '+0.5% vs ayer' },
  ]

  const tools = [
    { id: 'banner-search', name: 'Buscador Banner', description: 'Gestiona y busca banners HTML', category: 'Emails', icon: 'Search', isActive: true },
    { id: 'layout-grid', name: 'Layout Grid', description: 'Compón interfaces con grillas', category: 'UI', icon: 'Grid3X3', isActive: false },
  ]

  const openTool = (id) => {
    if (id === 'banner-search') setActive?.('banner')
    if (id === 'layout-grid') setActive?.('grid')
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className="card hover:bg-slate-800 transition-colors">
            <div className="flex items-center justify-between pb-2">
              <div className="text-sm font-medium text-slate-300">{s.title}</div>
              <s.icon className="h-4 w-4 text-slate-400" />
            </div>
            <div className="text-2xl font-semibold text-slate-100">{s.value}</div>
            <p className="text-xs text-slate-400">{s.description}</p>
            <p className="text-xs text-indigo-400 mt-1">{s.trend}</p>
          </div>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => tool.isActive && openTool(tool.id)}
            className={`card text-left group ${tool.isActive ? 'cursor-pointer hover:bg-slate-800' : 'opacity-80'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {tool.icon === 'Search' && <Search className="h-6 w-6 text-indigo-400" />}
                {tool.icon === 'Grid3X3' && <Grid3X3 className="h-6 w-6 text-slate-400" />}
                <div>
                  <div className="text-lg font-semibold text-slate-100">{tool.name}</div>
                  <div className="text-sm text-slate-400">{tool.description}</div>
                </div>
              </div>
              {tool.isActive ? (
                <span className="badge bg-emerald-600/20 text-emerald-300 border border-emerald-600/20">Activa</span>
              ) : (
                <span className="badge">Próximamente</span>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-slate-400">Categoría: {tool.category}</span>
              <span className={`text-sm ${tool.isActive ? 'text-indigo-400 group-hover:underline' : 'text-slate-500'}`}>
                {tool.isActive ? 'Abrir' : 'Próximamente'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="mb-3">
          <div className="text-slate-100 font-semibold">Acciones Rápidas</div>
          <div className="text-slate-400 text-sm">Accede rápidamente a las funciones más utilizadas</div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => openTool('banner-search')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-violet-500 hover:from-sky-600 hover:to-violet-600 text-white rounded-xl px-3 py-2 text-sm"
          >
            <Search className="w-4 h-4" />
            Buscar Banners
          </button>
          <button disabled className="inline-flex items-center gap-2 border border-slate-700/80 text-slate-300 rounded-xl px-3 py-2 text-sm opacity-70">
            <Grid3X3 className="w-4 h-4" />
            Layout Grid (Próximamente)
          </button>
        </div>
      </div>
    </div>
  )
}
