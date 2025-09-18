import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import { BannerProvider } from './context/BannerContext.jsx'

createRoot(document.getElementById('root')).render(
  <BannerProvider>
    <App />
  </BannerProvider>
)