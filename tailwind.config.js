/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1f2a44',
        surface: '#111827',
        sidebar: '#0f172a',
        accent: '#3b82f6',
      },
      boxShadow: {
        card: '0 8px 24px rgba(0,0,0,0.24)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    },
  },
  plugins: [],
}