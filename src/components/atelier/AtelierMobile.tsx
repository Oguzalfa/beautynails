import { useEffect, useId, useRef, useState, type MouseEvent } from 'react'
import { siteConfig } from '../../config/site'
import { PremiumIcon, type PremiumIconName } from '../premium/BeautyNailsPremium'
import { Wordmark } from '../Wordmark'

type Props = {
  onOpenBooking: () => void
  onOpenService: (id: string) => void
}

type Shot = {
  src: string
  alt: string
  label: string
  width: number
  height: number
  position?: string
}

const shots: Shot[] = [
  {
    src: '/images/fx/nails-macro.webp',
    alt: 'Stüdyo tırnak fotoğrafı',
    label: 'Tırnak',
    width: 900,
    height: 620,
  },
  {
    src: '/images/fx/lashes-macro.webp',
    alt: 'Stüdyo kirpik fotoğrafı',
    label: 'Kirpik',
    width: 900,
    height: 520,
  },
  {
    src: '/images/fx/lips-macro.webp',
    alt: 'Stüdyo makyaj fotoğrafı',
    label: 'Makyaj',
    width: 900,
    height: 450,
  },
  {
    src: '/images/service-kas.webp',
    alt: 'Stüdyo kaş bakımı fotoğrafı',
    label: 'Bakım',
    width: 800,
    height: 700,
    position: '50% 22%',
  },
]

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
  const rootRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const [shot, setShot] = useState<number | null>(null)
  const dialogOpen = shot !== null
  const phoneHref = `tel:+${siteConfig.whatsappNumber}`
  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}`

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const reveals = [...root.querySelectorAll<HTMLElement>('.bn-at-reveal')]
    const chromes = [...root.querySelectorAll<HTMLElement>('.bn-at-chrome')]
    const apply = () => {
      if (reduce.matches) {
        root.classList.remove('is-script')
        reveals.forEach((el) => el.classList.add('is-in'))
        chromes.forEach((el) => el.setAttribute('data-paused', 'true'))
        return
      }
      root.classList.add('is-script')
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
          const paused = !entry.isIntersecting || reduce.matches || document.hidden
          entry.target.setAttribute('data-paused', paused ? 'true' : 'false')
        })
      },
      { threshold: 0.01 },
    )
    chromes.forEach((el) => pause.observe(el))
    const onHide = () => {
      chromes.forEach((el) => {
        if (document.hidden || reduce.matches) el.setAttribute('data-paused', 'true')
      })
    }
    document.addEventListener('visibilitychange', onHide)
    reduce.addEventListener('change', apply)
    return () => {
      io.disconnect()
      pause.disconnect()
      document.removeEventListener('visibilitychange', onHide)
      reduce.removeEventListener('change', apply)
    }
  }, [])

  useEffect(() => {
    if (!dialogOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShot(null)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
      openerRef.current?.focus()
    }
  }, [dialogOpen])

  const openShot = (index: number, opener: HTMLElement) => {
    openerRef.current = opener
    setShot(index)
  }

  const go = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.querySelector(`[data-at-anchor="${id}"]`)
    if (!(target instanceof HTMLElement)) return
    event.preventDefault()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  const current = shot === null ? null : shots[shot]

  return (
    <div className="sazi-mobile-v3" ref={rootRef}>
      <section className="bn-at-hero bn-at-reveal" data-at-anchor="deneyim" aria-labelledby={titleId}>
        <h1 id={titleId} className="bn-at-title">
          <span>Sıradanın</span>
          <em>ötesinde.</em>
        </h1>
        <div className="bn-at-portrait">
          <img
            src="/images/fx/hero-portrait-glass.webp"
            alt="Şazi Beauty portresi, yüz ve el bakımı"
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
            <figcaption>MANİKÜR &amp; PEDİKÜR</figcaption>
          </figure>
          <p>Size özel bakım. Kusursuz detaylar.</p>
          <Cta fit onClick={onOpenBooking}>
            Randevu Al
          </Cta>
        </div>
        <ul className="bn-at-trust">
          <li>
            <PremiumIcon name="diamond" size={32} tone="dark" animated={false} />
            <span>Premium Deneyim</span>
          </li>
          <li>
            <PremiumIcon name="lotus" size={32} tone="dark" animated={false} />
            <span>Uzman Ekip</span>
          </li>
          <li>
            <PremiumIcon name="heart" size={32} tone="dark" animated={false} />
            <span>Size Özel Bakım</span>
          </li>
        </ul>
      </section>

      <section className="bn-at-nails bn-at-reveal" data-at-anchor="hizmetler" aria-labelledby="at-nails-title">
        <span className="bn-at-ribbon" aria-hidden="true" />
        <div className="bn-at-kicker">
          <p>HİZMETLERİMİZ</p>
          <span className="bn-at-badge">01</span>
        </div>
        <h2 id="at-nails-title" className="bn-at-name">
          <span>Tırnak</span>
          <em>Sanatı</em>
        </h2>
        <p className="bn-at-sub">Zarif, modern ve size özel.</p>
        <div className="bn-at-frame">
          <span className="bn-at-rail" aria-hidden="true">
            ŞAZİ BEAUTY
          </span>
          <div className="bn-at-photo">
            <img
              src="/images/fx/nails-macro.webp"
              alt="Fransız manikür tırnak uygulaması"
              width={900}
              height={1000}
              loading="lazy"
              decoding="async"
            />
            <span className="bn-at-pill">Kalıcı görünüm</span>
            <figure className="bn-at-inset">
              <img
                src="/images/bn/service-nails.webp"
                alt=""
                width={450}
                height={500}
                loading="lazy"
                decoding="async"
              />
              <figcaption>MANİKÜR &amp; PEDİKÜR</figcaption>
            </figure>
          </div>
        </div>
        <Pair
          left={{ icon: 'sparkle', label: 'Kişiye özel tasarım' }}
          right={{ icon: 'leaf', label: 'Özenli tırnak bakımı' }}
        />
        <Cta onClick={() => onOpenService('tirnak-sanati')}>Detayları Keşfedin</Cta>
        <span className="bn-at-wave" aria-hidden="true" />
      </section>

      <section className="bn-at-lashes bn-at-reveal" aria-labelledby="at-lash-title">
        <span className="bn-at-badge">02</span>
        <h2 id="at-lash-title" className="bn-at-lash-title">
          İpek Kirpik
        </h2>
        <p className="bn-at-sub">Bakışınızda zarif bir dokunuş.</p>
        <div className="bn-at-photo bn-at-photo--lash">
          <img
            src="/images/fx/lashes-macro.webp"
            alt="İpek kirpik uygulanmış göz"
            width={1000}
            height={520}
            loading="lazy"
            decoding="async"
          />
          <span className="bn-at-pill bn-at-pill--low">
            Doğal
            <br />
            görünüm
          </span>
          <span className="bn-at-chrome bn-at-lash-chrome" aria-hidden="true" data-paused="true" />
        </div>
        <Pair
          left={{ icon: 'leaf', label: 'Hafif ve konforlu' }}
          right={{ icon: 'sparkle', label: 'Uzman uygulama' }}
        />
        <Cta onClick={() => onOpenService('ipek-kirpik')}>Kirpiği Keşfet</Cta>
      </section>

      <section className="bn-at-makeup bn-at-reveal" aria-labelledby="at-makeup-title">
        <span className="bn-at-badge">03</span>
        <h2 id="at-makeup-title" className="bn-at-name bn-at-name--makeup">
          <span>Kalıcı</span>
          <em>Makyaj</em>
        </h2>
        <p className="bn-at-sub">Doğal güzellik, her zaman.</p>
        <div className="bn-at-photo bn-at-photo--lips">
          <img
            src="/images/fx/lips-macro.webp"
            alt="Kalıcı makyaj dudak uygulaması"
            width={1000}
            height={450}
            loading="lazy"
            decoding="async"
          />
          <figure className="bn-at-brow">
            <img
              src="/images/bn/service-brows.webp"
              alt="Kaş detayı"
              width={420}
              height={300}
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
        <Pair
          left={{ icon: 'lips', label: 'Yüzünüze uygun tasarım' }}
          right={{ icon: 'sparkle', label: 'Doğal ve estetik görünüm' }}
        />
        <Cta onClick={() => onOpenService('kalici-makyaj')}>Makyajı Keşfet</Cta>
      </section>

      <section className="bn-at-gallery bn-at-reveal" data-at-anchor="calismalarimiz" aria-labelledby="at-gallery-title">
        <span className="bn-at-ribbon bn-at-ribbon--gallery" aria-hidden="true" />
        <p className="bn-at-kicker-label">ÇALIŞMALARIMIZ</p>
        <h2 id="at-gallery-title" className="bn-at-name bn-at-name--gallery">
          <span>İmzamız,</span>
          <em>detaylarda.</em>
        </h2>
        <ul className="bn-at-grid">
          {shots.map((item, index) => (
            <li key={item.label}>
              <button
                type="button"
                className="bn-at-tile"
                onClick={(event) => openShot(index, event.currentTarget)}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  decoding="async"
                  style={item.position ? { objectPosition: item.position } : undefined}
                />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="bn-at-more"
          onClick={(event) => openShot(0, event.currentTarget)}
        >
          Tüm Çalışmalar
          <Arrow />
        </button>
      </section>

      <section className="bn-at-book bn-at-reveal" data-at-anchor="iletisim" aria-labelledby="at-book-title">
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
            Kendinize <em>özel</em>
          </span>
          <span>bir zaman ayırın.</span>
        </h2>
        <p className="bn-at-sub">Size uygun bakımı birlikte planlayalım.</p>
        <Cta onClick={onOpenBooking}>Randevu Al</Cta>
        <div className="bn-at-quick">
          <a href={whatsappHref} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a href={phoneHref}>Ara</a>
        </div>
      </section>

      <footer className="bn-at-foot">
        <a className="bn-at-foot-logo" href="#top">
          <Wordmark />
        </a>
        <nav className="bn-at-foot-nav" aria-label="Kısa bağlantılar">
          <a href="#hizmetler" onClick={go('hizmetler')}>
            Hizmetler
          </a>
          <a href="#iletisim" onClick={go('iletisim')}>
            İletişim
          </a>
          <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </nav>
        <p>© {siteConfig.brand}</p>
      </footer>

      {current ? (
        <div
          className="bn-at-dialog"
          role="presentation"
          onClick={() => setShot(null)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={current.label}
            onClick={(event) => event.stopPropagation()}
          >
            <button ref={closeRef} type="button" onClick={() => setShot(null)}>
              Kapat
            </button>
            <img src={current.src} alt={current.alt} width={current.width} height={current.height} />
            <p>{current.label}</p>
            <div className="bn-at-dialog-nav">
              <button
                type="button"
                onClick={() => setShot((value) => (value === null ? 0 : (value + shots.length - 1) % shots.length))}
              >
                Önceki
              </button>
              <button
                type="button"
                onClick={() => setShot((value) => (value === null ? 0 : (value + 1) % shots.length))}
              >
                Sonraki
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
