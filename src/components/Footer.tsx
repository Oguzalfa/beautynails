import { siteConfig } from '../config/site'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner section">
        <div>
          <strong className="logo__name">{siteConfig.brand.toLowerCase()}</strong>
          <p>{siteConfig.tagline}</p>
        </div>
        <div className="site-footer__meta">
          {siteConfig.address ? <p>{siteConfig.address}</p> : null}
          {siteConfig.phone ? (
            <p>
              <a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>
            </p>
          ) : (
            <p>İletişim bilgileri yakında güncellenecek.</p>
          )}
          {siteConfig.workingHours ? <p>{siteConfig.workingHours}</p> : null}
          {siteConfig.instagramUrl ? (
            <p>
              <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
