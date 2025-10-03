import React, { useEffect, useState } from 'react';
import UrlToAmpScript from './UrlToAmpScript';
import { Home, Search, Grid3X3, ChevronLeft, ChevronRight, SunMoon, Settings, HelpCircle, PlusCircle, Link2 } from 'lucide-react'

const navItems = [
  { id: 'dashboard', title: 'Dashboard', icon: Home, target: 'dashboard' },
]

const toolItems = [
  { id: 'banner-search', title: 'Buscador Banner', icon: Search, target: 'banner' },
  { id: 'layout-grid', title: 'Layout Grid', icon: Grid3X3, target: 'grid', disabled: false },
  { id: 'url-converter', title: 'Conversor de URL', icon: Link2, target: 'url-converter', isAction: true },
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

  const [showUrlConverter, setShowUrlConverter] = useState(false);

  const handleToolClick = (target, disabled, isAction = false) => {
    if (disabled) return;
    
    if (isAction) {
      if (target === 'url-converter') {
        setShowUrlConverter(true);
      }
    } else {
      setActive(target);
    }
  }

  return (
    <aside className="h-screen sticky top-0 bg-sidebar border-r border-slate-800 z-40">
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
          <button onClick={() => setCollapsed(v => !v)} className="icon-btn z-50 relative" aria-label="Toggle sidebar">
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
                  onClick={() => handleToolClick(item.target, item.disabled, item.isAction)}
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
                  onClick={() => handleToolClick(item.target, item.disabled, item.isAction)}
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

          <button 
            onClick={toggleTheme} 
            aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
            className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-slate-200 hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <SunMoon className="h-5 w-5 text-amber-300" />
              ) : (
                <SunMoon className="h-5 w-5 text-slate-600" />
              )}
              {!collapsed && (
                <span className="text-sm">
                  {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
                </span>
              )}
            </div>
            {!collapsed && (
              <div className="relative w-10 h-6">
                <div className={`absolute inset-0 rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-blue-600' : 'bg-slate-300'
                }`} />
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  theme === 'dark' ? 'translate-x-4' : 'translate-x-0'
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {theme === 'dark' ? (
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            )}
          </button>
        </div>
      </div>
      
      {/* URL to AMPscript Modal */}
      <UrlToAmpScript 
        isOpen={showUrlConverter} 
        onClose={() => setShowUrlConverter(false)} 
      />
    </aside>
  )
}