import { FeatureSet, PremiumAppointment } from './premium/BeautyNailsPremium'

type Props = {
  onOpenBooking: () => void
}

export function Hero({ onOpenBooking }: Props) {
  return (
    <section className="bn-hero" id="deneyim" aria-labelledby="hero-title">
      <img
        className="bn-hero__art"
        src="/images/fx/hero-portrait-glass.webp"
        alt=""
        width={1774}
        height={887}
        fetchPriority="high"
        decoding="async"
      />
      <div className="bn-hero__copy">
        <h1 id="hero-title" className="bn-hero__title">
          <span>Sıradanın</span>
          <em>ötesinde.</em>
        </h1>
        <p className="bn-hero__intro">Size özel bakım. Kusursuz detaylar.</p>
        <PremiumAppointment
          href="#iletisim"
          onClick={(event) => {
            event.preventDefault()
            onOpenBooking()
          }}
        >
          Özel Randevu Al
        </PremiumAppointment>
        <FeatureSet kind="hero" />
      </div>
    </section>
  )
}
