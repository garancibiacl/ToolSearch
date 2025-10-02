# AGENTS.md - Guía para Agentes de Codificación



## Mision
Este agente ayuda a mantener y extender el repositorio de ToolSearch.

## 📋 Fuente de verdad
- README.md
- /context/rules.md
- /AGENTS.md



## 📋 Información General del Proyecto

**Nombre:** ToolSearch (Dashboard Dark Sidebar)  
**Tipo:** Aplicación web React con backend Express  
**Propósito:** Sistema de gestión y búsqueda de banners HTML para email marketing con herramientas adicionales (Layout Grid, Dashboard)

---

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico

#### Frontend
- **Framework:** React 18.2.0
- **Build Tool:** Vite 5.3.1
- **Estilos:** TailwindCSS 3.4.10 + PostCSS + Autoprefixer
- **Iconos:** Lucide React 0.453.0
- **Búsqueda:** Fuse.js 6.6.2 (fuzzy search)
- **Idioma:** Español

#### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 4.19.2
- **CORS:** Habilitado
- **Almacenamiento:** Sistema de archivos JSON (fs-extra 11.2.0)
- **Puerto:** 5177

---

## 📁 Estructura de Directorios

```
ToolSearch/
├── backend/
│   ├── data/
│   │   └── banners.json          # Datos completos (id, createdAt, etc.)
│   └── server.js                 # API REST
├── public/
│   └── backend/
│       └── data/
│           └── banners.json      # Datos públicos (solo nombre, href, img_src, alt)
├── src/
│   ├── api/                      # Clientes API
│   ├── components/
│   │   ├── CreateBannerDialog.jsx
│   │   ├── Sidebar.jsx
│   │   └── Topbar.jsx
│   ├── context/                  # Context API de React
│   ├── hooks/                    # Custom hooks
│   ├── lib/                      # Utilidades
│   ├── pages/
│   │   ├── BannerSearchApp.jsx   # Página principal de búsqueda
│   │   ├── DashboardOverview.jsx # Dashboard de herramientas
│   │   └── LayoutGridApp.jsx     # Sistema de cuadrícula
│   ├── App.jsx                   # Componente raíz
│   ├── main.jsx                  # Entry point
│   └── styles.css                # Estilos globales
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 🚀 Comandos Principales

```bash
# Desarrollo
npm run dev              # Inicia Vite dev server (puerto 5173 por defecto)
npm run backend          # Inicia backend Express (puerto 5177)

# Producción
npm run build            # Build para producción
npm run preview          # Preview del build
```

**Nota:** Para desarrollo completo, ejecutar ambos comandos en terminales separadas.

---

## 🔌 API Backend

### Base URL
- Desarrollo: `http://127.0.0.1:5177`
- Proxy configurado en Vite: `/api` → `http://127.0.0.1:5177`

### Endpoints

#### `GET /api/health`
Verifica el estado del servidor.
```json
{ "ok": true }
```

#### `GET /api/banners`
Obtiene todos los banners.
```json
{
  "ok": true,
  "data": [
    {
      "id": 1234567890,
      "nombre": "Banner Ejemplo",
      "href": "https://example.com",
      "img_src": "https://example.com/image.jpg",
      "alt": "Descripción",
      "createdAt": "2025-10-01T20:00:00.000Z"
    }
  ]
}
```

#### `POST /api/banners`
Crea un nuevo banner.
```json
// Request
{
  "nombre": "Banner Ejemplo",
  "href": "https://example.com",
  "img_src": "https://example.com/image.jpg",
  "alt": "Descripción"
}

// Response (201)
{
  "ok": true,
  "data": { /* banner creado */ }
}
```

#### `POST /api/sync-public`
Sincroniza el backend desde el archivo público `public/backend/data/banners.json`.
```json
{
  "ok": true,
  "imported": 5
}
```

---

## 🎨 Sistema de Diseño

### Tema
- **Modo:** Dark (clase `dark` en root)
- **Persistencia:** localStorage (`theme`)

### Colores Personalizados (Tailwind)
```js
{
  primary: '#1f2a44',
  surface: '#111827',
  sidebar: '#0f172a',
  accent: '#3b82f6'
}
```

### Componentes Principales
- **Sidebar:** Navegación lateral con tema toggle
- **Topbar:** Barra superior con búsqueda
- **CreateBannerDialog:** Modal para crear banners
- **BannerSearchApp:** Búsqueda fuzzy con Fuse.js
- **LayoutGridApp:** Sistema de cuadrícula visual
- **DashboardOverview:** Vista general de herramientas

---

## 🔄 Estado y Navegación

### Gestión de Estado
- **Pestaña activa:** localStorage (`active-tab`)
  - Valores: `'banner'`, `'grid'`, `'dashboard'`
- **Tema:** localStorage (`theme`)
  - Valores: `'dark'`, `'light'`

### Navegación
La navegación se maneja mediante estado local en `App.jsx`:
```jsx
const [active, setActive] = useState(() => localStorage.getItem('active-tab') || 'banner')
```

---

## 📦 Almacenamiento de Datos

### Dual Storage System
1. **Backend (`backend/data/banners.json`):**
   - Datos completos con `id`, `createdAt`
   - Fuente de verdad del servidor

2. **Público (`public/backend/data/banners.json`):**
   - Solo campos: `nombre`, `href`, `img_src`, `alt`
   - Para visibilidad/distribución

### Sincronización
- Escritura: Backend → Público (automático en `writeStore`)
- Lectura: Público → Backend (endpoint `/api/sync-public`)

---

## 🛠️ Convenciones de Código

### Estilo
- **Componentes:** PascalCase (ej: `BannerSearchApp.jsx`)
- **Hooks:** camelCase con prefijo `use` (ej: `useBanners`)
- **Archivos de configuración:** kebab-case (ej: `vite.config.js`)

### Imports
- Usar ES Modules (`import/export`)
- Backend usa `"type": "module"` en package.json

### React
- Componentes funcionales con hooks
- `useMemo` para optimización de renderizado
- `useEffect` para side effects (localStorage, DOM)

---

## 🔍 Búsqueda (Fuse.js)

La búsqueda fuzzy está implementada en `BannerSearchApp.jsx`:
- Busca en campos: `nombre`, `alt`, `href`
- Threshold configurable para precisión
- Resultados en tiempo real

---

## ⚠️ Consideraciones Importantes

### Para Agentes de Codificación

1. **Idioma:** Todo el contenido de la UI debe estar en **español**
2. **Tema:** La aplicación está diseñada para modo oscuro por defecto
3. **Persistencia:** Usar localStorage para preferencias del usuario
4. **API:** Todas las llamadas API deben manejar errores apropiadamente
5. **Datos:** Respetar el sistema dual de almacenamiento (backend/público)
6. **Estilos:** Usar clases de TailwindCSS, evitar CSS inline
7. **Iconos:** Usar componentes de `lucide-react`
8. **Navegación:** Mantener sincronizado el estado `active` con localStorage

### Limitaciones Conocidas
- No hay autenticación/autorización
- Almacenamiento en archivos JSON (no base de datos)
- Sin paginación en listados
- Límite de payload: 1MB

---

## 🧪 Testing y Debugging

### Verificación Rápida
```bash
# Backend health check
curl http://127.0.0.1:5177/api/health

# Listar banners
curl http://127.0.0.1:5177/api/banners
```

### Logs
- Backend: `console.log` en terminal del servidor
- Frontend: DevTools del navegador

---

## 📝 Tareas Comunes

### Agregar una nueva página
1. Crear componente en `src/pages/`
2. Importar en `App.jsx`
3. Agregar caso en `useMemo` del Content
4. Agregar opción en `Sidebar.jsx`
5. Actualizar título y descripción en el header

### Modificar el esquema de banners
1. Actualizar `POST /api/banners` en `backend/server.js`
2. Actualizar `writeStore` para el mapeo público
3. Actualizar componentes que consumen los datos
4. Actualizar `CreateBannerDialog.jsx` si es necesario

### Cambiar estilos globales
1. Modificar `tailwind.config.js` para colores/temas
2. Modificar `src/styles.css` para estilos base
3. Usar clases de Tailwind en componentes

---

## 🔗 Recursos Útiles

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [TailwindCSS Docs](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Fuse.js Docs](https://fusejs.io)
- [Express Docs](https://expressjs.com)

---

**Última actualización:** 2025-10-01  
**Versión:** 1.0.0
