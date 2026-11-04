import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/bn.css'
import App from './App'
import './styles/sazi-mobile-fix.css'
import './styles/atelier-mobile.css'

const container = document.getElementById('root')!
const app = <StrictMode><App /></StrictMode>
if (container.hasChildNodes()) hydrateRoot(container, app, {identifierPrefix:'sazi-'})
else createRoot(container, {identifierPrefix:'sazi-'}).render(app)

import './styles/editorial.css'
