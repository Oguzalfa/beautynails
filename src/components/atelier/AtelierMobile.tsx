import { useEffect, useId, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
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

function fx(vars: Record<string, string>) {
  return vars as CSSProperties
}

function Glint({
  x,
  y,
  delay,
  size = 12,
  priority = 4,
  className,
}: {
  x?: string
  y?: string
  delay: string
  size?: number
  priority?: number
  className?: string
}) {
  return (
    <span
      className={className}
      data-sazi-glint=""
      data-sazi-priority={priority}
      aria-hidden="true"
      style={fx({
        ...(x ? { '--sazi-fx-glint-x': x } : {}),
        ...(y ? { '--sazi-fx-glint-y': y } : {}),
        '--sazi-fx-glint-size': `${size}px`,
        '--sazi-fx-delay': delay,
      })}
    />
  )
}

function Crystal({
  name,
  size,
  delay,
  glintPriority = 2,
}: {
  name: PremiumIconName
  size: number
  delay: string
  glintPriority?: number
}) {
  return (
    <span className="bn-at-gem" data-sazi-drift="" data-sazi-priority={2} style={fx({ '--sazi-fx-delay': delay })}>
      <PremiumIcon name={name} size={size} tone="dark" animated={false} />
      <Glint x="72%" y="26%" delay={delay} size={10} priority={glintPriority} />
    </span>
  )
}

function Arrow() {
  return (
    <svg className="bn-at-arrow sazi-fx-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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
  shine = false,
  delay = '0s',
  priority = 6,
}: {
  children: string
  onClick: () => void
  fit?: boolean
  shine?: boolean
  delay?: string
  priority?: number
}) {
  return (
    <button
      type="button"
      className={fit ? 'bn-at-cta bn-at-cta--fit' : 'bn-at-cta'}
      data-sazi-cta={shine ? '' : undefined}
      data-sazi-shine={shine ? 'edge' : undefined}
      data-sazi-priority={shine ? priority : undefined}
      style={shine ? fx({ '--sazi-fx-delay': delay }) : undefined}
      onClick={onClick}
    >
      <span>{children}</span>
      <Arrow />
    </button>
  )
}

function Pair({
  left,
  right,
}: {
  left: { icon: PremiumIconName; label: string; delay: string; glintPriority?: number }
  right: { icon: PremiumIconName; label: string; delay: string; glintPriority?: number }
}) {
  return (
    <ul className="bn-at-pair">
      <li>
        <Crystal name={left.icon} size={40} delay={left.delay} glintPriority={left.glintPriority} />
        <span>{left.label}</span>
      </li>
      <li>
        <Crystal name={right.icon} size={40} delay={right.delay} glintPriority={right.glintPriority} />
        <span>{right.label}</span>
      </li>
    </ul>
  )
}

export function AtelierMobile({ onOpenBooking, onOpenService }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const [shot, setShot] = useState<number | null>(null)
  const dialogOpen = shot !== null
  const phoneHref = `tel:+${siteConfig.whatsappNumber}`
  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}`

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
    <div className="sazi-mobile-v3">
      <section className="bn-at-hero" data-at-anchor="deneyim" aria-labelledby={titleId}>
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
          <Glint x="16%" y="20%" delay="0.9s" priority={7} />
          <Glint x="10%" y="56%" delay="3.8s" priority={4} size={9} />
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
            <Glint x="86%" y="12%" delay="1.6s" priority={8} size={10} />
          </figure>
          <p>Size özel bakım. Kusursuz detaylar.</p>
          <Cta fit shine delay="0.2s" priority={7} onClick={onOpenBooking}>
            Randevu Al
          </Cta>
        </div>
        <ul className="bn-at-trust">
          <li>
            <Crystal name="diamond" size={32} delay="0.2s" glintPriority={6} />
            <span>Premium Deneyim</span>
          </li>
          <li>
            <Crystal name="lotus" size={32} delay="1.8s" glintPriority={5} />
            <span>Uzman Ekip</span>
          </li>
          <li>
            <Crystal name="heart" size={32} delay="3.4s" glintPriority={3} />
            <span>Size Özel Bakım</span>
          </li>
        </ul>
      </section>

      <section className="bn-at-nails bn-at-reveal" data-sazi-reveal="" data-at-anchor="hizmetler" aria-labelledby="at-nails-title">
        <span className="bn-at-ribbon" aria-hidden="true" />
        <div className="bn-at-kicker">
          <p>HİZMETLERİMİZ</p>
          <span className="bn-at-badge" data-sazi-shine="surface" data-sazi-priority="3" style={fx({ '--sazi-fx-delay': '0.5s' })}>
            01
          </span>
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
            <span className="bn-at-pill" data-sazi-shine="surface" data-sazi-priority="3" style={fx({ '--sazi-fx-delay': '1.3s' })}>
              Kalıcı görünüm
            </span>
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
              <Glint x="16%" y="14%" delay="2.3s" priority={5} size={9} />
            </figure>
          </div>
        </div>
        <Pair
          left={{ icon: 'sparkle', label: 'Kişiye özel tasarım', delay: '0.7s', glintPriority: 4 }}
          right={{ icon: 'leaf', label: 'Özenli tırnak bakımı', delay: '2.5s', glintPriority: 3 }}
        />
        <Cta onClick={() => onOpenService('tirnak-sanati')}>Detayları Keşfedin</Cta>
        <span className="bn-at-wave" aria-hidden="true" />
      </section>

      <section className="bn-at-lashes bn-at-reveal" data-sazi-reveal="" aria-labelledby="at-lash-title">
        <span className="bn-at-badge" data-sazi-shine="surface" data-sazi-priority="3" style={fx({ '--sazi-fx-delay': '2.1s' })}>
          02
        </span>
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
          <span
            className="bn-at-pill bn-at-pill--low"
            data-sazi-shine="surface"
            data-sazi-priority="3"
            style={fx({ '--sazi-fx-delay': '2.7s' })}
          >
            Doğal
            <br />
            görünüm
          </span>
          <span className="bn-at-chrome bn-at-lash-chrome" data-sazi-drift="" data-sazi-priority="4" aria-hidden="true" data-paused="true">
            <Glint x="48%" y="16%" delay="1.1s" priority={5} size={9} />
          </span>
        </div>
        <Pair
          left={{ icon: 'leaf', label: 'Hafif ve konforlu', delay: '1.2s', glintPriority: 4 }}
          right={{ icon: 'sparkle', label: 'Uzman uygulama', delay: '2.8s', glintPriority: 3 }}
        />
        <Cta onClick={() => onOpenService('ipek-kirpik')}>Kirpiği Keşfet</Cta>
      </section>

      <section className="bn-at-makeup bn-at-reveal" data-sazi-reveal="" aria-labelledby="at-makeup-title">
        <span className="bn-at-badge" data-sazi-shine="surface" data-sazi-priority="3" style={fx({ '--sazi-fx-delay': '3.6s' })}>
          03
        </span>
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
          left={{ icon: 'lips', label: 'Yüzünüze uygun tasarım', delay: '0.5s', glintPriority: 4 }}
          right={{ icon: 'sparkle', label: 'Doğal ve estetik görünüm', delay: '2.1s', glintPriority: 3 }}
        />
        <Cta onClick={() => onOpenService('kalici-makyaj')}>Makyajı Keşfet</Cta>
      </section>

      <section className="bn-at-gallery bn-at-reveal" data-sazi-reveal="" data-at-anchor="calismalarimiz" aria-labelledby="at-gallery-title">
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
                data-sazi-photo-zoom=""
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

      <section className="bn-at-book bn-at-reveal" data-sazi-reveal="" data-at-anchor="iletisim" aria-labelledby="at-book-title">
        <img
          className="bn-at-chrome bn-at-orb"
          src="/images/fx/appointment-chrome.webp"
          alt=""
          width={600}
          height={600}
          loading="lazy"
          decoding="async"
          data-sazi-drift=""
          data-sazi-priority="10"
          data-paused="true"
        />
        <Glint className="bn-at-orb-glint" delay="0.6s" priority={8} size={11} />
        <h2 id="at-book-title" className="bn-at-book-title">
          <span>
            Kendinize <em>özel</em>
          </span>
          <span>bir zaman ayırın.</span>
        </h2>
        <p className="bn-at-sub">Size uygun bakımı birlikte planlayalım.</p>
        <Cta shine delay="1.5s" priority={6} onClick={onOpenBooking}>
          Randevu Al
        </Cta>
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
