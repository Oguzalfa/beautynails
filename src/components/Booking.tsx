import { siteConfig } from '../config/site'
import { PremiumAppointment } from './premium/BeautyNailsPremium'

type Props = { onOpenBooking: () => void }

export function Booking({ onOpenBooking }: Props) {
  return (
    <section className="bn-appointment" id="iletisim" aria-labelledby="appointment-title">
      <img
        className="bn-appointment__art bn-drift"
        src="/images/fx/appointment-chrome.webp"
        alt=""
        width={2098}
        height={749}
        loading="lazy"
        decoding="async"
      />
      <div className="bn-appointment__copy">
        <p className="bn-eyebrow">Randevunuzu planlayın</p>
        <h2 id="appointment-title" className="bn-appointment__title">
          <span>Kendinize <em>özel</em></span>
          <span>bir zaman ayırın.</span>
        </h2>
        <p className="bn-appointment__intro">Size uygun bakımı birlikte planlayalım.</p>
        {siteConfig.phone && siteConfig.whatsappNumber ? (
          <p className="bn-appointment__phone">
            <a href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noreferrer">
              WhatsApp {siteConfig.phone}
            </a>
          </p>
        ) : null}
        <PremiumAppointment
          href="#iletisim"
          onClick={(event) => {
            event.preventDefault()
            onOpenBooking()
          }}
        >
          Özel Randevu Al
        </PremiumAppointment>
      </div>
    </section>
  )
}
