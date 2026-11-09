import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { instalarEsmaecerRolagem } from '../lib/esmaecer-rolagem'
import './site.css'
import './tema.css'
import './heild-logo.js'
import { SiteApp } from './SiteApp'

instalarEsmaecerRolagem()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteApp />
  </StrictMode>,
)
