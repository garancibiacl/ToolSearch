# 🛠️ ToolSearch - Dashboard de Herramientas

[![Netlify Status](https://api.netlify.com/api/v1/badges/12345678-1234-1234-1234-123456789abc/deploy-status)](https://app.netlify.com/sites/toolsearcho/deploys)

## 🌟 Visión General

ToolSearch es un dashboard moderno y eficiente diseñado para la gestión y búsqueda de banners HTML para email marketing, con herramientas adicionales que mejoran el flujo de trabajo de desarrollo.

**URL de Producción:** [https://toolsearcho.netlify.app](https://toolsearcho.netlify.app)

## 🚀 Características Principales

- **Búsqueda Avanzada** de banners con filtros y búsqueda en tiempo real
- **Sistema de Diseño Unificado** con modo oscuro
- **Herramientas Integradas** para desarrollo frontend
- **Interfaz Responsive** que se adapta a cualquier dispositivo
- **Fácil Integración** con flujos de trabajo existentes

## 🏗️ Tecnologías Principales

- **Frontend:**
  - React 18.2
  - Vite 5.3.1
  - TailwindCSS 3.4.10
  - React Router DOM
  - Fuse.js para búsqueda difusa

- **Backend (API):**
  - Node.js
  - Express 4.19.2
  - Almacenamiento en archivos JSON

## 🧭 Navegación

### 📊 Dashboard Principal
**URL:** `/`
Vista general con estadísticas y acceso rápido a las herramientas más utilizadas.

### 🔍 Buscador de Banners
**URL:** `/banners`
- Búsqueda avanzada con filtros
- Vista previa en tiempo real
- Acciones rápidas (copiar, editar, eliminar)

### 🎨 Editor de Layout
**URL:** `/layout`
- Sistema de cuadrícula visual
- Arrastrar y soltar componentes
- Exportar a HTML/CSS

### ⚙️ Configuración
**URL:** `/settings`
- Preferencias de usuario
- Personalización de tema
- Configuración de API

## 🚀 Cómo Empezar

### Requisitos Previos
- Node.js 16+ y npm 8+
- Git

### Instalación Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/toolsearch.git
   cd toolsearch
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar servidor de desarrollo:
   ```bash
   # Frontend
   npm run dev
   
   # Backend (en otra terminal)
   npm run backend
   ```

4. Abrir en el navegador:
   ```
   http://localhost:5173
   ```

## 📦 Estructura del Proyecto

```
toolsearch/
├── backend/           # Código del servidor
│   ├── data/          # Archivos de datos
│   └── server.js      # Servidor Express
├── public/            # Archivos estáticos
└── src/               # Código fuente de la aplicación
    ├── assets/        # Recursos estáticos
    ├── components/    # Componentes reutilizables
    ├── pages/         # Páginas de la aplicación
    ├── styles/        # Estilos globales
    └── utils/         # Utilidades y helpers
```

## 🤝 Contribuir

1. Hacer fork del proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Hacer commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Hacer push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

## ✉️ Contacto

Tu Nombre - [@tuusuario](https://twitter.com/tuusuario) - email@ejemplo.com

Enlace del Proyecto: [https://github.com/tu-usuario/toolsearch](https://github.com/tu-usuario/toolsearch)

## 🙏 Agradecimientos

- [3draw-app](https://github.com/garancibiacl/3draw-app) por la inspiración en la estructura del proyecto
- A todos los contribuyentes que han ayudado a mejorar este proyecto
