import { siteConfig } from '../config/site'

export function Wordmark() {
  return (
    <span className="bn-wordmark">
      <span className="bn-wordmark__name">{siteConfig.wordmark}</span>
      <span className="bn-wordmark__tag">{siteConfig.tagline}</span>
    </span>
  )
}
