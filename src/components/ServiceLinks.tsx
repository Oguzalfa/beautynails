import { services } from '../config/site'

export function ServiceLinks() {
  return <nav className="sz-service-links" aria-label="Hizmet ve iletişim rehberi">
    {services.map(service => <a key={service.id} href={`/hizmetler/${service.id}/`}>{service.title}</a>)}
    <a href="/bakim-rehberi/">Bakım notları</a>
    <a href="/iletisim/">İletişim bilgileri</a>
  </nav>
}
