import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/bn.css'
import App from './App'
import './styles/sazi-mobile-fix.css'
import './styles/atelier-mobile.css'
import './styles/atelier-desktop.css'
import './motion/sazi-motion.css'
import './styles/sazi-motion-bind.css'
import './styles/satin-home.css'
import './styles/satin-journal.css'
import './styles/satin-pages.css'
import './styles/satin-languages.css'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
if (root.dataset.prerendered === 'true') hydrateRoot(root, app)
else createRoot(root).render(app)
