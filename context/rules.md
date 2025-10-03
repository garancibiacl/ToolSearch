# Reglas de Desarrollo

## 1. Estándares de Código

### Documentación
- Cada función debe incluir un bloque de comentarios que explique:
  - Propósito de la función
  - Parámetros que recibe
  - Valor de retorno
  - Ejemplo de uso

### Estructura de Componentes
- Usar nombres descriptivos para componentes, variables y funciones
- Mantener los componentes pequeños y enfocados en una sola responsabilidad
- Seguir la convención de nombres de React (PascalCase para componentes)
- Separar componentes en archivos individuales
- Usar carpetas para agrupar componentes relacionados

## 2. JavaScript Moderno y React

### Buenas Prácticas de JavaScript
- Usar características de ES6+ (arrow functions, destructuring, spread/rest, etc.)
- Preferir `const` y `let` sobre `var`
- Usar métodos funcionales de arrays (map, filter, reduce, etc.)
- Implementar async/await para operaciones asíncronas
- Validar parámetros con valores por defecto
- Usar template literals para cadenas complejas

### Estructura de Módulos
```javascript
// Buen ejemplo de estructura de módulo
export const functionName = (params) => {
  // Código claro y conciso
  return result;
};
```

### React Específico
- Usar componentes funcionales con Hooks
- Mantener el estado lo más local posible
- Usar `useCallback` y `useMemo` para optimización
- Implementar PropTypes o JSX para validación de props
- Separar lógica de negocio con custom hooks
- Usar Context API para estado global cuando sea necesario

### Patrones de Diseño
- Componentes Compuestos para lógica compartida
- Render Props o Custom Hooks para reutilización de lógica
- Componentes Presentacionales vs Contenedores

## 3. Estilos y Diseño

### UI/UX y Control de Calidad Visual

#### Diseño Responsivo
- Implementar Mobile-First como estrategia de desarrollo
- Usar unidades relativas (rem, em, %) en lugar de píxeles fijos
- Implementar breakpoints estándar:
  ```css
  /* Mobile: hasta 640px (por defecto) */
  @media (min-width: 640px) { /* sm */ }
  @media (min-width: 768px) { /* md */ }
  @media (min-width: 1024px) { /* lg */ }
  @media (min-width: 1280px) { /* xl */ }
  ```
- Probar en múltiples dispositivos y navegadores
- Usar `srcset` para imágenes responsivas

#### Rendimiento Web
- Optimizar imágenes (usar formatos modernos como WebP/AVIF)
- Implementar lazy loading para imágenes y componentes fuera del viewport
- Minificar y comprimir recursos estáticos (CSS, JS, imágenes)
- Usar CDN para recursos estáticos
- Implementar estrategias de caché efectivas
- Limitar el uso de fuentes web personalizadas

#### Core Web Vitals y Rendimiento

**Largest Contentful Paint (LCP) < 2.5s**
- Optimizar imágenes críticas (usar WebP/AVIF con fallback)
- Implementar precarga de recursos críticos:
  ```html
  <link rel="preload" href="fuente.woff2" as="font" type="font/woff2" crossorigin>
  ```
- Usar `loading="eager"` para contenido crítico
- Minimizar CSS/JS bloqueante

**First Input Delay (FID) < 100ms**
- Dividir código JavaScript en chunks
- Usar Web Workers para tareas pesadas
- Implementar código no bloqueante con `defer`/`async`
- Evitar largas tareas en el hilo principal

**Cumulative Layout Shift (CLS) < 0.1**
- Definir dimensiones explícitas para imágenes/embeds:
  ```html
  <img width="600" height="400" src="imagen.jpg" alt="...">
  ```
- Reservar espacio para anuncios/embeds dinámicos
- Evitar insertar contenido encima del existente
- Usar `transform` para animaciones

**Total Blocking Time (TBT) < 300ms**
- Dividir tareas largas (>50ms)
- Usar `requestIdleCallback` para tareas de baja prioridad
- Implementar virtualización para listas largas
- Usar `content-visibility: auto` para contenido fuera del viewport

**Optimizaciones Adicionales**
- Implementar Service Workers para offline-first
- Usar `IntersectionObserver` para carga perezosa
- Comprimir con Brotli (Brotli > Gzip)
- Implementar priorización de recursos con `fetchpriority`
- Usar `preconnect`/`dns-prefetch` para dominios de terceros

#### Accesibilidad (a11y)
- Contraste mínimo de 4.5:1 para texto normal
- Navegación completa por teclado
- Textos alternativos descriptivos en imágenes
- Uso correcto de encabezados (h1-h6)
- Aria-labels para elementos interactivos
- Validación de formularios accesible

#### Testing de Calidad Visual
- Realizar pruebas en diferentes navegadores (Chrome, Firefox, Safari, Edge)
- Verificar en diferentes tamaños de pantalla
- Probar modo oscuro/claro
- Validar con herramientas como:
  - Lighthouse
  - WebPageTest
  - axe DevTools
  - Wave Evaluation Tool

### HTML Semántico y Accesibilidad
- Usar etiquetas HTML con significado semántico
- Estructurar el contenido de manera lógica
- Implementar ARIA attributes cuando sea necesario
- Asegurar navegación por teclado
- Mantener contraste adecuado

### CSS y Estilizado con TailwindCSS
- Seguir el sistema de diseño establecido
- Usar clases de utilidad de Tailwind
- Mantener consistencia en espaciados y colores
- Implementar diseño responsive
- Usar componentes reutilizables para patrones comunes

### Ejemplo de Componente Estilizado
```jsx
// components/ui/Button.jsx
const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-medium rounded transition-colors focus:outline-none';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

## 3. Flujo de Trabajo

### Desarrollo de Características

1. Crear una rama descriptiva para cada característica
2. Implementar pruebas unitarias
3. Documentar cambios en el código
4. Crear o actualizar historias de usuario

### Control de Calidad

- Revisar el código antes de hacer commit
- Asegurar que el código pase todas las pruebas
- Verificar la accesibilidad
- Optimizar el rendimiento

## 4. Documentación

### Historias de Usuario

- Definir el rol, objetivo y beneficio
- Incluir criterios de aceptación
- Especificar requisitos técnicos

### Casos de Uso

- Describir los flujos principales
- Incluir casos límite
- Documentar interacción con APIs

## 5. Mejoras Futuras

- Revisar y actualizar periódicamente estas reglas
- Incorporar nuevas mejores prácticas
- Mantener la consistencia en todo el proyecto
