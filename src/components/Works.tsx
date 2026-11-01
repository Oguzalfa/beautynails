import { services, siteConfig } from '../config/site'

export function Works() {
  return (
    <section id="calismalarimiz" className="works section">
      <p className="eyebrow">ÇALIŞMALARIMIZ</p>
      <h2 className="section-title">İmza bakımlardan seçkiler</h2>
      <p className="works__note">
        {siteConfig.realPortfolioApproved
          ? 'Salon çalışmalarımızdan seçilmiş görseller.'
          : 'Hizmet atmosferini yansıtan konsept görseller. Gerçek müşteri sonucu veya before/after kanıtı değildir.'}
      </p>
      <div className="works__grid">
        {services.map((service) => (
          <figure key={service.id} className="works__item">
            <img src={service.image} alt={service.title} width={512} height={512} loading="lazy" />
            <figcaption>{service.title}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
