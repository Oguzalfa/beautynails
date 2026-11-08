import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
export { pagePaths } from './routes'
export { getSeo } from './seo'
export { siteConfig } from './config/site'
export function render(pathname: string) {
  return renderToString(<StrictMode><App initialPath={pathname} /></StrictMode>)
}
