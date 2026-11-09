import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { instalarEsmaecerRolagem } from './lib/esmaecer-rolagem'
import App from './App'

instalarEsmaecerRolagem()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
