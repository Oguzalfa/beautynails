import { services } from '../config/site'

const alts = [
  'Pembe French tırnak yakın planı, konsept görsel',
  'İpek kirpik ve ela göz yakın planı, konsept görsel',
  'Pembe dudak yakın planı, konsept görsel',
  'Kaş ve göz çevresi yakın planı, konsept görsel',
]

export function Works() {
  return (
    <section id="calismalarimiz" className="bn-section bn-gallery">
      <div className="bn-container--wide">
        <div className="bn-heading-row">
          <div>
            <p className="bn-font-label">Çalışmalarımız</p>
            <h2 className="bn-font-section">
              <span>İmzamız, <em className="bn-font-display">detaylarda.</em></span>
            </h2>
          </div>
          <a className="bn-text-link" href="#calismalarimiz">Tüm Çalışmalar →</a>
        </div>
        <div className="bn-photo-grid">
          {services.map((service, index) => (
            <img
              key={service.id}
              className="bn-gallery__photo"
              src={service.image}
              alt={alts[index]}
              width={512}
              height={341}
              loading="lazy"
            />
          ))}
        </div>
        <p className="bn-gallery__note">Size özel dokunuşlar.</p>
      </div>
      <hr className="bn-rule" />
    </section>
  )
}
