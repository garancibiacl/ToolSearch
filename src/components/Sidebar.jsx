import React, { useEffect, useState } from 'react'
import { Home, Search, Grid3X3, ChevronLeft, ChevronRight, SunMoon, Settings, HelpCircle, PlusCircle } from 'lucide-react'

const navItems = [
  { id: 'dashboard', title: 'Dashboard', icon: Home, target: 'dashboard' },
]

const toolItems = [
  { id: 'banner-search', title: 'Buscador Banner', icon: Search, target: 'banner' },
  { id: 'layout-grid', title: 'Layout Grid', icon: Grid3X3, target: 'grid', disabled: false },
  { id: 'url-precio', title: 'URL Precio', icon: Grid3X3, target: 'url-precio', disabled: true },
]

const footerItems = [
  { id: 'settings', title: 'Configuración', icon: Settings },
  { id: 'help', title: 'Ayuda', icon: HelpCircle },
]

function MenuButton({ icon: Icon, title, active, disabled, collapsed, onClick, rightBadge }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700/50'
      } ${active ? 'bg-slate-700 text-white' : 'text-slate-300'}`}
    >
      <Icon className="h-5 w-5" />
      {!collapsed && (
        <span className="flex-1 text-sm font-medium flex items-center justify-between">
          {title}
          {rightBadge}
        </span>
      )}
    </button>
  )
}

export default function Sidebar({ active, setActive, theme, setTheme }) {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sb-collapsed') === '1')

  useEffect(() => {
    localStorage.setItem('sb-collapsed', collapsed ? '1' : '0')
  }, [collapsed])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  const handleToolClick = (target, disabled) => {
    if (!disabled) setActive(target)
  }

  return (
    <aside className="h-screen sticky top-0 bg-sidebar border-r border-slate-800">
      <div className={`flex flex-col h-full ${collapsed ? 'w-16' : 'w-64'} transition-[width] duration-300`}>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-3 py-4 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-lg grid place-items-center">
              <span className="text-white font-bold text-sm">AD</span>
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-slate-100 font-semibold leading-tight">DevTools</h1>
                <p className="text-xs text-slate-400">Dashboard Pro</p>
              </div>
            )}
          </div>
          <button onClick={() => setCollapsed(v => !v)} className="icon-btn" aria-label="Toggle sidebar">
            {collapsed ? <ChevronRight className="h-4 w-4 text-slate-300"/> : <ChevronLeft className="h-4 w-4 text-slate-300"/>}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Navigation */}
          <div className="mt-3 px-3">
            {!collapsed && <div className="px-1 pb-2 text-[11px] uppercase tracking-wide text-slate-400">Navegación</div>}
            <nav className="space-y-1">
              {navItems.map(item => (
                <MenuButton
                  key={item.id}
                  icon={item.icon}
                  title={item.title}
                  active={active === item.target}
                  collapsed={collapsed}
                  onClick={() => handleToolClick(item.target)}
                />
              ))}
            </nav>
          </div>

          {/* Tools */}
          <div className="mt-4 px-3">
            {!collapsed && <div className="px-1 pb-2 text-[11px] uppercase tracking-wide text-slate-400">Herramientas</div>}
            <nav className="space-y-1">
              {toolItems.map(item => (
                <MenuButton
                  key={item.id}
                  icon={item.icon}
                  title={item.title}
                  active={active === item.target}
                  disabled={item.disabled}
                  collapsed={collapsed}
                  onClick={() => handleToolClick(item.target, item.disabled)}
                  rightBadge={item.disabled ? (
                    <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">Próximamente</span>
                  ) : null}
                />
              ))}
            </nav>

            {/* CTA */}
            <button className={`mt-3 w-full ${collapsed ? 'px-0' : 'px-3'} py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-sky-500 to-violet-500 hover:from-sky-600 hover:to-violet-600`}>
              {collapsed ? <PlusCircle className="h-5 w-5 mx-auto" /> : (
                <span className="inline-flex items-center gap-2"><PlusCircle className="h-5 w-5"/>Nueva Herramienta</span>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto px-3 pb-4 space-y-2 border-t border-slate-800/60 pt-3">
          {footerItems.map(item => (
            <button key={item.id} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-700/50">
              <item.icon className="h-5 w-5" />
              {!collapsed && <span className="text-sm">{item.title}</span>}
            </button>
          ))}

          <button onClick={toggleTheme} className="w-full flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200">
            <div className="flex items-center gap-3">
              <SunMoon className="h-5 w-5" />
              {!collapsed && <span className="text-sm">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>}
            </div>
            <div className={`relative ${collapsed ? 'hidden' : 'block'}`}>
              <div className="w-10 h-6 rounded-full bg-slate-600" />
              <div className={`absolute top-0.5 ${theme==='dark' ? 'left-0.5' : 'left-4'} w-5 h-5 rounded-full bg-white transition-all`} />
            </div>
          </button>
        </div>
      </div>
    </aside>
  )
}