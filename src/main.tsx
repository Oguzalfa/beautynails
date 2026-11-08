import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/bn.css'
import App from './App'
import './styles/sazi-mobile-fix.css'
import './styles/atelier-mobile.css'
import './styles/localized-home.css'
import { LocaleProvider } from './i18n/LocaleContext'
import { normalizeLocale } from './i18n/routes.mjs'

const container = document.getElementById('root')!
const locale = normalizeLocale(document.documentElement.lang)
const app = <StrictMode><LocaleProvider locale={locale}><App /></LocaleProvider></StrictMode>
if (container.hasChildNodes()) hydrateRoot(container, app, {identifierPrefix:'sazi-'})
else createRoot(container, {identifierPrefix:'sazi-'}).render(app)

import './styles/editorial.css'
