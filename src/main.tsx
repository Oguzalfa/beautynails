import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/bn.css'
import App from './App'
import './styles/sazi-mobile-fix.css'
import './styles/atelier-mobile.css'
import './styles/atelier-desktop.css'
import './motion/sazi-motion.css'
import './styles/sazi-motion-bind.css'
import './styles/satin-home.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
