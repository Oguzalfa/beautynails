import { navLinks, siteConfig } from '../config/site'
import { Wordmark } from './Wordmark'
import { ServiceLinks } from './ServiceLinks'
import { useLocale } from '../i18n/LocaleContext'

export function Footer() {
  const { t, href } = useLocale()
  return (
    <footer className="bn-footer">
      <a className="bn-logo" href={href('#top')}>
        <Wordmark />
      </a>
      <nav className="bn-footer__links" aria-label={t('Alt menü')}>
        {navLinks.map((link) => (
          <a key={link.href} href={href(link.href)}>{t(link.label)}</a>
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
