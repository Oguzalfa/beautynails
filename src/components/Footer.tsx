import { navLinks, siteConfig } from '../config/site'
import { Wordmark } from './Wordmark'
import { ServiceLinks } from './ServiceLinks'

export function Footer() {
  return (
    <footer className="bn-footer">
      <a className="bn-logo" href="#top">
        <Wordmark />
      </a>
      <nav className="bn-footer__links" aria-label="Alt menü">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href}>{link.label}</a>
        ))}
      </nav>
      {siteConfig.phone && siteConfig.whatsappNumber ? (
        <p className="bn-footer__contact">
          <a href={`tel:+${siteConfig.whatsappNumber}`}>{siteConfig.phone}</a>
          <a href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer">Instagram</a>
        </p>
      ) : null}
      <p className="bn-footer__legal">© {siteConfig.brand}</p>
      <ServiceLinks />
    </footer>
  )
}
