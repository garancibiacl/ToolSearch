import React, { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import BannerSearchApp from './pages/BannerSearchApp'
import LayoutGridApp from './pages/LayoutGridApp'
import DashboardOverview from './pages/DashboardOverview'

export default function App() {
  const [active, setActive] = useState(() => localStorage.getItem('active-tab') || 'banner')
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [query, setQuery] = useState('')

  useEffect(() => { localStorage.setItem('active-tab', active) }, [active])
  useEffect(() => {
    localStorage.setItem('theme', theme)
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  const Content = useMemo(() => {
    if (active === 'grid') return <LayoutGridApp />
    if (active === 'dashboard') return <DashboardOverview setActive={setActive} />
    return <BannerSearchApp />
  }, [active])

  return (
    <div className="dark bg-slate-900 text-slate-100">
      <div className="flex">
        <Sidebar active={active} setActive={setActive} theme={theme} setTheme={setTheme} />
        <main className="min-h-screen flex-1">
          <Topbar onSearch={setQuery} />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Encabezado */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">{
                  active === 'banner' ? 'Buscador de Banner' : active === 'dashboard' ? 'Dashboard' : 'Layout Grid'
                }</h1>
                {active === 'banner' ? (
                  <p className="text-slate-400 text-sm mt-1">Gestiona y busca banners HTML con código optimizado para email marketing</p>
                ) : active === 'dashboard' ? (
                  <p className="text-slate-400 text-sm mt-1">Bienvenido a tu centro de herramientas de desarrollo</p>
                ) : (
                  <p className="text-slate-400 text-sm mt-1">Sistema de cuadrícula para componer interfaces rápidamente</p>
                )}
              </div>
            </div>

            {/* Contenido dinámico */}
            {Content}
          </div>
        </main>
      </div>
    </div>
  )
}