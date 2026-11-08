import { services } from '../config/site'
import { useLocale } from '../i18n/LocaleContext'

export function ServiceLinks() {
  const { t, href } = useLocale()
  return <nav className="sz-service-links" aria-label={t('Hizmet ve iletişim rehberi')}>
    {services.map(service => <a key={service.id} href={href(`/hizmetler/${service.id}/`)}>{t(service.title)}</a>)}
    <a href={href('/bakim-rehberi/')}>{t('Bakım notları')}</a>
    <a href={href('/iletisim/')}>{t('İletişim bilgileri')}</a>
  </nav>
}
