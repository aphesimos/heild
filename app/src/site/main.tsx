import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import './site.css'
import './tema.css'
import './heild-logo.js'
import { SiteApp } from './SiteApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteApp />
  </StrictMode>,
)
