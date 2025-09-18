import React, { useMemo, useState } from 'react'
import { Copy, Grid, Layers } from 'lucide-react'

// Embedded layout data to avoid external imports
const gridLayouts = [
  {
    id: 'grid-2x2',
    name: 'Grid 2 x 2',
    img: '/img/grid-header-main-footer.png',
    html: `<table width="600" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td colspan="2" align="center" valign="top">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td colspan="2" align="center">
              <a href="%%=RedirectTo(concat('https://www.sodimac.cl/sodimac-cl/seleccion/maestro-de-la-casa?',@prefix))=%%" target="_blank">
                <img src="https://www.sodimac.cl/static/envioweb/2025/06-junio/13-grupo-b/images/13-grupo-B-1.png" alt="Ir a Maestro de la casa" style="display: block" border="0" />
              </a>
            </td>
          </tr>
          <tr>
            <td colspan="2" align="center">
              <a href="%%=RedirectTo(concat('https://www.sodimac.cl/sodimac-cl/seleccion/guardian-del-jardin?',@prefix))=%%" target="_blank">
                <img src="https://www.sodimac.cl/static/envioweb/2025/06-junio/13-grupo-b/images/13-grupo-B-2.png" alt="Ir a Guardian del jardin" style="display: block" border="0" />
              </a>
            </td>
          </tr>
        </table>
      </td>
      <td colspan="2" align="center" valign="top">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td colspan="2" align="center">
              <a href="%%=RedirectTo(concat('https://www.sodimac.cl/sodimac-cl/seleccion/parrillero-de-la-casa?',@prefix))=%%" target="_blank">
                <img src="https://www.sodimac.cl/static/envioweb/2025/06-junio/13-grupo-b/images/13-grupo-B-3.png" alt="Ir a Parrillero de la casa" style="display: block" border="0" />
              </a>
            </td>
          </tr>
          <tr>
            <td colspan="2" align="center">
              <a href="%%=RedirectTo(concat('https://www.sodimac.cl/sodimac-cl/seleccion/el-mas-tecnologico?',@prefix))=%%" target="_blank">
                <img src="https://www.sodimac.cl/static/envioweb/2025/06-junio/13-grupo-b/images/13-grupo-B-4.png" alt="Ir a El mas tecnologico" style="display: block" border="0" />
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`
  },
  {
    id: 'grid-1x2',
    name: 'Grid 1 x 2',
    img: '/img/grid-infinite.png',
    html: `<table width="600" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td colspan="2" align="center" valign="top">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td colspan="2" align="center">
              <a href="%%=RedirectTo(concat('https://www.sodimac.cl/sodimac-cl/seleccion/maestro-de-la-casa?',@prefix))=%%" target="_blank">
                <img src="https://www.sodimac.cl/static/envioweb/2025/06-junio/11-productos-wow/images/11-productos-wow-8.png" alt="Ir a Maestro de la casa" style="display:block;" border="0">
              </a>
            </td>
          </tr>
        </table>
      </td>
      <td colspan="2" align="center" valign="top">
        <table width="100%" cellspacing="0" cellpadding="0" align="center">
          <tr>
            <td colspan="2" align="center">
              <a href="%%=RedirectTo(concat('https://www.sodimac.cl/sodimac-cl/seleccion/guardian-del-jardin?',@prefix))=%%" target="_blank">
                <img src="https://www.sodimac.cl/static/envioweb/2025/06-junio/11-productos-wow/images/11-productos-wow-9.png" alt="Ir a Guardian del jardin" style="display:block;" border="0">
              </a>
            </td>
          </tr>
          <tr>
            <td colspan="2" align="center">
              <a href="%%=RedirectTo(concat('https://www.sodimac.cl/sodimac-cl/seleccion/guardian-del-jardin?',@prefix))=%%" target="_blank">
                <img src="https://www.sodimac.cl/static/envioweb/2025/06-junio/11-productos-wow/images/11-productos-wow-10.png" alt="Ir a Guardian del jardin" style="display:block;" border="0">
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`
  },
  {
    id: 'grid-3x1',
    name: 'Grid 3 x 1',
    img: '/img/grid-holy.png',
    html: `<table width="600" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td colspan="2" align="center" valign="top">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td colspan="2" align="center">
              <a href="%%=RedirectTo(concat('https://www.sodimac.cl/sodimac-cl/content/preparate-para-el-invierno?',@prefix))=%%" target="_blank">
                <img src="https://www.sodimac.cl/static/envioweb/2025/07-julio/02-fan-diseno/images/02-fan-diseno-2.png" alt="Ir a Preparate para el invierno" style="display:block;" border="0">
              </a>
            </td>
          </tr>
          <tr>
            <td colspan="2" align="center">
              <a href="%%=RedirectTo(concat('https://www.sodimac.cl/sodimac-cl/lista/cat2073/Ropa-de-Cama?sid=SO_HO__365851?',@prefix))=%%" target="_blank">
                <img src="https://www.sodimac.cl/static/envioweb/2025/07-julio/02-fan-diseno/images/02-fan-diseno-3.png" alt="Ir a Ropa de Cama" style="display:block;" border="0">
              </a>
            </td>
          </tr>
          <tr>
            <td colspan="2" align="center">
              <a href="%%=RedirectTo(concat('https://www.sodimac.cl/sodimac-cl/lista/cat5540010/Cortinas-y-rollers?sid=SO_HO__365853?',@prefix))=%%" target="_blank">
                <img src="https://www.sodimac.cl/static/envioweb/2025/07-julio/02-fan-diseno/images/02-fan-diseno-4.png" alt="Ir a Cortinas y rollers" style="display:block;" border="0">
              </a>
            </td>
          </tr>
        </table>
      </td>
      <td colspan="2" align="center" valign="top">
        <table width="100%" cellspacing="0" cellpadding="0" align="center">
          <tr>
            <td colspan="2" align="center">
              <a href="%%=RedirectTo(concat('https://www.sodimac.cl/sodimac-cl/buscar?Ntt=9077952+9077391&sid=SO_HO__366153&',@prefix))=%%" target="_blank">
                <img src="https://www.sodimac.cl/static/envioweb/2025/07-julio/02-fan-diseno/images/02-fan-diseno-5.gif" alt="Ir a COleccion Sherpa" style="display:block;" border="0">
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`
  }
]

const flexLayouts = [
  { id: 'flex-row', name: 'Row', img: '/img/grid-infinite-areas.png', html: `<div class="d-flex">\n  <div class="flex-item">Item 1<\/div>\n  <div class="flex-item">Item 2<\/div>\n  <div class="flex-item">Item 3<\/div>\n<\/div>` },
  { id: 'flex-wrap', name: 'Row Wrap', img: '/img/grid-sidebar.png', html: `<div class="d-flex flex-wrap">\n  <div class="flex-item">Item 1<\/div>\n  <div class="flex-item">Item 2<\/div>\n  <div class="flex-item">Item 3<\/div>\n  <div class="flex-item">Item 4<\/div>\n<\/div>` },
]

// Simple toast inside this page
function Toasts({ items }) {
  if (!items.length) return null
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-[10000]">
      {items.map(t => (
        <div key={t.id} className={`px-3 py-2 rounded-lg text-sm shadow-soft border ${t.variant==='warn' ? 'bg-red-500/15 border-red-500/40 text-red-100' : 'bg-slate-800/90 border-slate-700 text-slate-100'}`}>
          {t.text}
        </div>
      ))}
    </div>
  )
}

export default function LayoutGridApp() {
  const [tab, setTab] = useState('grid') // 'grid' | 'flex'
  const [selectedLayout, setSelectedLayout] = useState(null)
  const [toasts, setToasts] = useState([])

  const showToast = (text, variant='default') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, text, variant }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 1800)
  }

  const currentList = useMemo(() => tab === 'grid' ? gridLayouts : flexLayouts, [tab])

  const copyToClipboard = async (html, name) => {
    try {
      await navigator.clipboard.writeText(html)
      showToast(`HTML copiado: ${name}`)
    } catch {
      showToast('No se pudo copiar el HTML', 'warn')
    }
  }

  const LayoutCard = ({ layout, category }) => (
    <div className="card group hover:shadow-lg transition-all duration-300 cursor-pointer border border-slate-800/60">
      <div className="p-4">
        <div className="aspect-video bg-slate-800/60 rounded-lg mb-3 overflow-hidden border border-slate-700/70">
          <img src={layout.img} alt={layout.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-slate-100 truncate">{layout.name}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-md border ${category==='grid' ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40' : 'bg-teal-500/15 text-teal-300 border-teal-500/40'}`}>{category==='grid' ? 'Grid' : 'Flex'}</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 h-9 inline-flex items-center justify-center rounded-lg border border-slate-700/80 hover:bg-slate-800 text-slate-200"
              onClick={() => setSelectedLayout(layout)}
            >
              <Layers className="w-4 h-4 mr-1" /> Vista previa
            </button>
            <button
              type="button"
              className="h-9 px-3 inline-flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100"
              onClick={() => copyToClipboard(layout.html, layout.name)}
            >
              <Copy className="w-4 h-4 mr-1" /> Copiar
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-full">
      <div className="card">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg grid place-items-center bg-gradient-to-br from-indigo-500 to-violet-600">
            <Grid className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-100">Layout Generator</h1>
            <p className="text-sm text-slate-300">Genera layouts HTML para email marketing con grids y flexbox</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4">
          <div className="inline-flex rounded-xl border border-slate-700/70 bg-slate-900/60 p-1">
            <button
              onClick={() => setTab('grid')}
              className={`px-3 py-1.5 text-sm rounded-lg ${tab==='grid' ? 'bg-slate-800 text-slate-100' : 'text-slate-300 hover:text-slate-100'}`}
            >
              <span className="inline-flex items-center gap-2"><Grid className="w-4 h-4"/> Layouts Grid</span>
            </button>
            <button
              onClick={() => setTab('flex')}
              className={`px-3 py-1.5 text-sm rounded-lg ${tab==='flex' ? 'bg-slate-800 text-slate-100' : 'text-slate-300 hover:text-slate-100'}`}
            >
              <span className="inline-flex items-center gap-2"><Layers className="w-4 h-4"/> Layouts Flexbox</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Gallery */}
        <div className="xl:col-span-2 card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentList.map(l => (
              <LayoutCard key={l.id} layout={l} category={tab} />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="text-slate-200 font-medium">Vista previa</div>
            {selectedLayout && (
              <button
                className="text-xs px-2 py-1 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
                onClick={() => copyToClipboard(selectedLayout.html, selectedLayout.name)}
              >
                <Copy className="w-3 h-3 mr-1 inline"/> Copiar
              </button>
            )}
          </div>
          {selectedLayout ? (
            <div className="space-y-3">
              <img src={selectedLayout.img} alt={selectedLayout.name} className="w-full rounded-lg border border-slate-700/70"/>
              <label className="text-sm text-slate-300">Código HTML:</label>
              <textarea readOnly value={selectedLayout.html} className="w-full h-64 bg-slate-900/70 border border-slate-700/80 rounded-xl p-3 text-xs font-mono text-slate-200" />
            </div>
          ) : (
            <div className="text-sm text-slate-400">Selecciona un layout para previsualizar su HTML.</div>
          )}
        </div>
      </div>

      <Toasts items={toasts} />
    </div>
  )
}
