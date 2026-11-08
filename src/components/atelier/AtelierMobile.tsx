import { useEffect, useId, useRef, type MouseEvent } from 'react'
import { siteConfig } from '../../config/site'
import { PremiumIcon, type PremiumIconName } from '../premium/BeautyNailsPremium'
import { Wordmark } from '../Wordmark'
import { BeautyGallery } from '../editorial/BeautyGallery'
import { BeautyJournal } from '../editorial/BeautyJournal'
import { ServiceLinks } from '../ServiceLinks'
import { useLocale } from '../../i18n/LocaleContext'

type Props = {
  onOpenBooking: () => void
  onOpenService: (id: string) => void
}

function Arrow() {
  return (
    <svg className="bn-at-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M4 12h14M13 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Cta({
  children,
  onClick,
  fit = false,
}: {
  children: string
  onClick: () => void
  fit?: boolean
}) {
  return (
    <button type="button" className={fit ? 'bn-at-cta bn-at-cta--fit' : 'bn-at-cta'} onClick={onClick}>
      <span>{children}</span>
      <Arrow />
    </button>
  )
}

function Pair({
  left,
  right,
}: {
  left: { icon: PremiumIconName; label: string }
  right: { icon: PremiumIconName; label: string }
}) {
  return (
    <ul className="bn-at-pair">
      <li>
        <PremiumIcon name={left.icon} size={40} tone="dark" animated={false} />
        <span>{left.label}</span>
      </li>
      <li>
        <PremiumIcon name={right.icon} size={40} tone="dark" animated={false} />
        <span>{right.label}</span>
      </li>
    </ul>
  )
}

export function AtelierMobile({ onOpenBooking, onOpenService }: Props) {
  const { locale, t, href } = useLocale()
  const rootRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const phoneHref = `tel:+${siteConfig.whatsappNumber}`
  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}`
  const [nailsLead, ...nailsRest] = t('Tırnak Sanatı').split(' ')
  const [makeupLead, ...makeupRest] = t('Kalıcı Makyaj').split(' ')

  useEffect(() => {
    let active = true
    let frame = 0
    const navigate = () => {
      if (!active || !window.matchMedia('(max-width: 767px)').matches) return
      const id = window.location.hash.slice(1)
      if (!id) return
      const target = rootRef.current?.querySelector<HTMLElement>(`[data-at-anchor="${CSS.escape(id)}"]`)
      target?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(navigate)
    }
    schedule()
    // Native hashes resolve to the hidden desktop sections on phones. Resolve
    // them again after font layout settles so shared links reach visible content.
    void document.fonts.ready.then(() => { if (active) schedule() })
    window.addEventListener('hashchange', schedule)
    return () => {
      active = false
      cancelAnimationFrame(frame)
      window.removeEventListener('hashchange', schedule)
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const reveals = [...root.querySelectorAll<HTMLElement>('.bn-at-reveal')]
    const chromes = [...root.querySelectorAll<HTMLElement>('.bn-at-chrome')]
    const visibleChromes = new Set<Element>()
    const syncChrome = () => {
      chromes.forEach((el) => {
        const paused = !visibleChromes.has(el) || reduce.matches || document.hidden
        el.setAttribute('data-paused', paused ? 'true' : 'false')
      })
    }
    const apply = () => {
      if (reduce.matches) {
        root.classList.remove('is-script')
        reveals.forEach((el) => el.classList.add('is-in'))
      } else {
        root.classList.add('is-script')
      }
      syncChrome()
    }
    apply()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        })
      },
      { threshold: 0.18 },
    )
    reveals.forEach((el) => io.observe(el))
    const pause = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) visibleChromes.add(entry.target)
            else visibleChromes.delete(entry.target)
        })
          syncChrome()
      },
      { threshold: 0.01 },
    )
    chromes.forEach((el) => pause.observe(el))
    document.addEventListener('visibilitychange', syncChrome)
    reduce.addEventListener('change', apply)
    return () => {
      io.disconnect()
      pause.disconnect()
      document.removeEventListener('visibilitychange', syncChrome)
      reduce.removeEventListener('change', apply)
    }
  }, [])

  const go = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.querySelector(`[data-at-anchor="${id}"]`)
    if (!(target instanceof HTMLElement)) return
    event.preventDefault()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }


  return (
    <div className="sazi-mobile-v3" ref={rootRef}>
      <section className="bn-at-hero" data-at-anchor="deneyim" tabIndex={-1} aria-labelledby={titleId}>
        <h1 id={titleId} className="bn-at-title">
          <span>{t('Sıradanın')}</span>{' '}
          <em>{t('ötesinde.')}</em>
        </h1>
        <div className="bn-at-portrait">
          <img
            src="/images/fx/hero-portrait-glass.webp"
            alt={t('Şazi Beauty portresi, yüz ve el bakımı')}
            width={1200}
            height={800}
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="bn-at-hero-foot">
          <figure className="bn-at-mani">
            <img
              src="/images/service-manikur.webp"
              alt=""
              width={640}
              height={480}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <p>{t('Size özel bakım. Kusursuz detaylar.')}</p>
          <Cta fit onClick={onOpenBooking}>
            {t('Randevu Al')}
          </Cta>
        </div>
        <ul className="bn-at-trust">
          <li>
            <PremiumIcon name="diamond" size={32} tone="dark" animated={false} />
            <span>{locale === 'tr' ? <>Premium<br />Deneyim</> : t('Premium Deneyim')}</span>
          </li>
          <li>
            <PremiumIcon name="lotus" size={32} tone="dark" animated={false} />
            <span>{locale === 'tr' ? <>Uzman<br />Ekip</> : t('Uzman Ekip')}</span>
          </li>
          <li>
            <PremiumIcon name="heart" size={32} tone="dark" animated={false} />
            <span>{locale === 'tr' ? <>Size Özel<br />Bakım</> : t('Size Özel Bakım')}</span>
          </li>
        </ul>
      </section>

      <section className="bn-at-nails bn-at-reveal" data-at-anchor="hizmetler" tabIndex={-1} aria-labelledby="at-nails-title">
        <span className="bn-at-ribbon" aria-hidden="true" />
        <div className="bn-at-kicker">
          <p>{t('HİZMETLERİMİZ')}</p>
          <span className="bn-at-badge">01</span>
        </div>
        <h2 id="at-nails-title" className="bn-at-name">
          <span>{nailsLead}</span>{nailsRest.length ? <> <em>{nailsRest.join(' ')}</em></> : null}
        </h2>
        <p className="bn-at-sub">{t('Zarif, modern ve size özel.')}</p>
        <div className="bn-at-frame">
          <span className="bn-at-rail" aria-hidden="true">
            ŞAZİ BEAUTY
          </span>
          <div className="bn-at-photo">
            <img
              src="/images/fx/nails-macro.webp"
              alt={t('Fransız manikür tırnak uygulaması')}
              width={900}
              height={1000}
              loading="lazy"
              decoding="async"
            />
            <span className="bn-at-pill">{t('Kalıcı görünüm')}</span>
            <figure className="bn-at-inset">
              <img
                src="/images/bn/service-nails.webp"
                alt=""
                width={450}
                height={500}
                loading="lazy"
                decoding="async"
              />
              <figcaption>{t('MANİKÜR & PEDİKÜR')}</figcaption>
            </figure>
          </div>
        </div>
        <Pair
          left={{ icon: 'sparkle', label: t('Kişiye özel tasarım') }}
          right={{ icon: 'leaf', label: t('Özenli tırnak bakımı') }}
        />
        <Cta onClick={() => onOpenService('tirnak-sanati')}>{t('Detayları Keşfedin')}</Cta>
        <span className="bn-at-wave" aria-hidden="true" />
      </section>

      <section className="bn-at-lashes bn-at-reveal" aria-labelledby="at-lash-title">
        <span className="bn-at-badge">02</span>
        <h2 id="at-lash-title" className="bn-at-lash-title">
          {t('İpek Kirpik')}
        </h2>
        <p className="bn-at-sub">{t('Bakışınızda zarif bir dokunuş.')}</p>
        <div className="bn-at-photo bn-at-photo--lash">
          <img
            src="/images/fx/lashes-macro.webp"
            alt={t('İpek kirpik uygulanmış göz')}
            width={1000}
            height={520}
            loading="lazy"
            decoding="async"
          />
          <span className="bn-at-pill bn-at-pill--low">
            {locale === 'tr' ? <>Doğal<br />görünüm</> : t('Doğal görünüm')}
          </span>
          <span className="bn-at-chrome bn-at-lash-chrome" aria-hidden="true" data-paused="true" />
        </div>
        <Pair
          left={{ icon: 'leaf', label: t('Hafif ve konforlu') }}
          right={{ icon: 'sparkle', label: t('Uzman uygulama') }}
        />
        <Cta onClick={() => onOpenService('ipek-kirpik')}>{t('Kirpiği Keşfet')}</Cta>
      </section>

      <section className="bn-at-makeup bn-at-reveal" aria-labelledby="at-makeup-title">
        <span className="bn-at-badge">03</span>
        <h2 id="at-makeup-title" className="bn-at-name bn-at-name--makeup">
          <span>{makeupLead}</span>{makeupRest.length ? <> <em>{makeupRest.join(' ')}</em></> : null}
        </h2>
        <p className="bn-at-sub">{t('Doğal güzellik, her zaman.')}</p>
        <div className="bn-at-photo bn-at-photo--lips">
          <img
            src="/images/fx/lips-macro.webp"
            alt={t('Kalıcı makyaj dudak uygulaması')}
            width={1000}
            height={450}
            loading="lazy"
            decoding="async"
          />
          <figure className="bn-at-brow">
            <img
              src="/images/bn/service-brows.webp"
              alt={t('Kaş detayı')}
              width={420}
              height={300}
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
        <Pair
          left={{ icon: 'lips', label: t('Yüzünüze uygun tasarım') }}
          right={{ icon: 'sparkle', label: t('Doğal ve estetik görünüm') }}
        />
        <Cta onClick={() => onOpenService('kalici-makyaj')}>{t('Makyajı Keşfet')}</Cta>
      </section>

      <BeautyGallery variant="mobile" />
      <BeautyJournal variant="mobile" />

      <section className="bn-at-book bn-at-reveal" data-at-anchor="iletisim" tabIndex={-1} aria-labelledby="at-book-title">
        <img
          className="bn-at-chrome bn-at-orb"
          src="/images/fx/appointment-chrome.webp"
          alt=""
          width={600}
          height={600}
          loading="lazy"
          decoding="async"
          data-paused="true"
        />
        <h2 id="at-book-title" className="bn-at-book-title">
          <span>
            {t('Kendinize')} <em>{t('özel')}</em>
          </span>
          <span>{t('bir zaman ayırın.')}</span>
        </h2>
        <p className="bn-at-sub">{t('Size uygun bakımı birlikte planlayalım.')}</p>
        <Cta onClick={onOpenBooking}>{t('Randevu Al')}</Cta>
        <div className="bn-at-quick">
          <a href={whatsappHref} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a href={phoneHref}>{t('Ara')}</a>
        </div>
      </section>

      <footer className="bn-at-foot">
        <a className="bn-at-foot-logo" href={href('#top')}>
          <Wordmark />
        </a>
        <nav className="bn-at-foot-nav" aria-label={t('Kısa bağlantılar')}>
          <a href={href('#hizmetler')} onClick={go('hizmetler')}>
            {t('Hizmetler')}
          </a>
          <a href={href('#iletisim')} onClick={go('iletisim')}>
            {t('İletişim')}
          </a>
          <a href={href('#makaleler')} onClick={go('makaleler')}>{t('Makaleler')}</a>
          <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </nav>
        <ServiceLinks />
        <p>© {siteConfig.brand}</p>
      </footer>


    </div>
  )
}
