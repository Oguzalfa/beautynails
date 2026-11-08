import { FeatureSet, PremiumAppointment } from './premium/BeautyNailsPremium'
import { useLocale } from '../i18n/LocaleContext'

type Props = {
  onOpenBooking: () => void
}

export function Hero({ onOpenBooking }: Props) {
  const { t, href } = useLocale()
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
          <span>{t('Sıradanın')}</span>{' '}
          <em>{t('ötesinde.')}</em>
        </h1>
        <p className="bn-hero__intro">{t('Size özel bakım. Kusursuz detaylar.')}</p>
        <PremiumAppointment
          href={href('#iletisim')}
          onClick={(event) => {
            event.preventDefault()
            onOpenBooking()
          }}
        >
          {t('Özel Randevu Al')}
        </PremiumAppointment>
        <FeatureSet kind="hero" />
      </div>
    </section>
  )
}
