import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/bn.css'
import App from './App'
import './styles/sazi-mobile-fix.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
