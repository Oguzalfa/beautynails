import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { LocaleProvider } from './i18n/LocaleContext'
import type { Locale } from './i18n/routes.mjs'

export function render(locale: Locale = 'tr') {
  return renderToString(
    <StrictMode><LocaleProvider locale={locale}><App /></LocaleProvider></StrictMode>,
    { identifierPrefix: 'sazi-' },
  )
}
