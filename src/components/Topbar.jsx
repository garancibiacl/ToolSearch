import React from 'react'
import { Search, Bell } from 'lucide-react'

export default function Topbar({ onSearch }) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/70 backdrop-blur border-b border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Search */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              onChange={(e) => onSearch?.(e.target.value)}
              placeholder="Buscar herramientas..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="icon-btn" aria-label="Notificaciones">
              <Bell className="h-5 w-5 text-slate-300" />
            </button>
            {/* Notification badge */}
            <span className="absolute -top-0.5 -right-0.5 inline-block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-slate-900" />
          </div>

          {/* User pill */}
          <div className="hidden sm:flex items-center gap-3 bg-slate-800/70 border border-slate-700 rounded-xl pl-2 pr-3 py-1.5">
            <div className="h-7 w-7 rounded-lg bg-indigo-500/20 text-indigo-300 grid place-items-center text-xs font-semibold">AD</div>
            <div className="leading-tight">
              <div className="text-slate-100 text-sm">Admin</div>
              <div className="text-slate-400 text-[11px]">Desarrollador</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}