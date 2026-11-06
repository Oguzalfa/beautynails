import { useCallback, useEffect, useId, useRef, useState, type RefObject } from 'react'
import { siteConfig } from '../../config/site'
import { ArrowIcon, CloseIcon, InstagramIcon, MenuIcon, WhatsAppIcon } from './icons'
import { JournalSection } from './JournalSection'
import { journalImages, libraryGallery } from './collection'

type Props = {
  onOpenBooking: (service?: string) => void
  onOpenService: (serviceId: string) => void
}

const services = [
  {
    id: 'tirnak-sanati',
    className: 'service-nails',
    number: '01',
    name: 'Tırnak Sanatı',
    alt: 'Parlak fuşya badem tırnak tasarımı',
    width: 1122,
    height: 1402,
    src: '/images/satin/service-nails-960.webp',
    srcSet:
      '/images/satin/service-nails-480.webp 480w, /images/satin/service-nails-960.webp 960w, /images/satin/service-nails.webp 1122w',
  },
  {
    id: 'ipek-kirpik',
    className: 'service-lashes',
    number: '02',
    name: 'İpek Kirpik',
    alt: 'İpek kirpik ve göz yakın planı',
    width: 960,
    height: 1200,
    src: '/images/satin/service-lashes-960.webp',
    srcSet: '/images/satin/service-lashes-480.webp 480w, /images/satin/service-lashes-960.webp 960w',
  },
  {
    id: 'kalici-makyaj',
    className: 'service-makeup',
    number: '03',
    name: 'Kalıcı Makyaj',
    alt: 'Doğal gül pembesi dudak yakın planı',
    width: 1122,
    height: 1402,
    src: '/images/satin/service-lips.webp',
    srcSet: '/images/satin/service-lips-480.webp 480w, /images/satin/service-lips.webp 1122w',
  },
] as const

const gallery = [
  {
    id: 'nails-example',
    alt: 'Parlak fuşya badem tırnak tasarımı',
    width: 1122,
    height: 1402,
    src: '/images/satin/service-nails.webp',
    srcSet:
      '/images/satin/service-nails-480.webp 480w, /images/satin/service-nails-960.webp 960w, /images/satin/service-nails.webp 1122w',
    sizes: '(min-width: 1024px) 620px, (min-width: 600px) 46vw, 46vw',
  },
  {
    id: 'french-example',
    alt: 'Nude zemin üzerinde pembe French tırnaklar',
    width: 960,
    height: 659,
    src: '/images/satin/gallery-french-960.webp',
    srcSet: '/images/satin/gallery-french-480.webp 480w, /images/satin/gallery-french-960.webp 960w',
    sizes: '(min-width: 1024px) 620px, (min-width: 600px) 46vw, 46vw',
  },
  ...libraryGallery,
] as const

type GalleryShot = (typeof gallery)[number]

function focusSection(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  target.scrollIntoView({ behavior: 'auto', block: 'start' })
  target.focus({ preventScroll: true })
}

function useFocusTrap(open: boolean, dialogRef: RefObject<HTMLDialogElement | null>, onClose: () => void) {
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const items = [...dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]')].filter(
        (item) => item.getClientRects().length > 0,
      )
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) {
        event.preventDefault()
        return
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    dialog.addEventListener('keydown', onKey)
    return () => dialog.removeEventListener('keydown', onKey)
  }, [dialogRef, onClose, open])
}

export function SatinHome({ onOpenBooking, onOpenService }: Props) {
  const menuTitleId = useId()
  const lightTitleId = useId()
  const [menuOpen, setMenuOpen] = useState(false)
  const [shot, setShot] = useState<GalleryShot | null>(null)
  const menuRef = useRef<HTMLDialogElement>(null)
  const lightRef = useRef<HTMLDialogElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const restoreMenuFocus = useRef(true)
  const menuWasOpen = useRef(false)
  const pendingSection = useRef<string | null>(null)
  const lightWasOpen = useRef(false)
  const lightOpener = useRef<HTMLElement | null>(null)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const closeLight = useCallback(() => setShot(null), [])

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const close = () => {
      if (query.matches) setMenuOpen(false)
    }
    query.addEventListener('change', close)
    return () => query.removeEventListener('change', close)
  }, [])

  useEffect(() => {
    const dialog = menuRef.current
    if (!dialog) return
    if (menuOpen) {
      menuWasOpen.current = true
      restoreMenuFocus.current = true
      if (!dialog.open) dialog.showModal()
      dialog.querySelector<HTMLElement>('[data-close]')?.focus()
      return
    }
    if (!menuWasOpen.current) return
    if (dialog.open) dialog.close()
    const sectionId = pendingSection.current
    pendingSection.current = null
    if (sectionId) focusSection(sectionId)
    else if (restoreMenuFocus.current) menuButtonRef.current?.focus()
    menuWasOpen.current = false
  }, [menuOpen])

  useEffect(() => {
    const dialog = lightRef.current
    if (!dialog) return
    if (shot) {
      lightWasOpen.current = true
      if (!dialog.open) dialog.showModal()
      dialog.querySelector<HTMLElement>('[data-close]')?.focus()
      return
    }
    if (!lightWasOpen.current) return
    if (dialog.open) dialog.close()
    lightOpener.current?.focus()
    lightOpener.current = null
    lightWasOpen.current = false
  }, [shot])

  useEffect(() => {
    const locked = menuOpen || shot !== null
    if (!locked) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [menuOpen, shot])

  useFocusTrap(menuOpen, menuRef, closeMenu)
  useFocusTrap(shot !== null, lightRef, closeLight)

  const openMenu = () => {
    setShot(null)
    setMenuOpen(true)
  }

  const requestBooking = (service?: string) => {
    restoreMenuFocus.current = false
    setMenuOpen(false)
    setShot(null)
    onOpenBooking(service)
  }

  const book = () => requestBooking()

  const go = (id: string) => {
    restoreMenuFocus.current = false
    if (menuOpen) {
      pendingSection.current = id
      setMenuOpen(false)
      setShot(null)
      return
    }
    setShot(null)
    focusSection(id)
  }

  const whatsappHref = siteConfig.whatsappNumber ? `https://wa.me/${siteConfig.whatsappNumber}` : null

  return (
    <div className="satin-page">
      <a className="skip-link" href="#icerik" onClick={(event) => { event.preventDefault(); focusSection('icerik') }}>
        İçeriğe geç
      </a>
      <div className="women-world">
        <header className="site-header">
          <div className="content-width header-bar">
            <a className="brand" href="#top" onClick={(event) => { event.preventDefault(); focusSection('top') }}>
              {siteConfig.wordmark}
            </a>
            <nav className="desktop-nav" aria-label="Sayfa bölümleri">
              <a href="#hizmetler" onClick={(event) => { event.preventDefault(); go('hizmetler') }}>Hizmetler</a>
              <a href="#ornekler" onClick={(event) => { event.preventDefault(); go('ornekler') }}>Galeri</a>
              <a href="#yazilar" onClick={(event) => { event.preventDefault(); go('yazilar') }}>Yazılar</a>
              <button className="nav-book" type="button" onClick={book}>Randevu Al</button>
            </nav>
            <button
              ref={menuButtonRef}
              className="icon-button menu-toggle"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="menu-dialog"
              onClick={() => (menuOpen ? setMenuOpen(false) : openMenu())}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
              <span className="sr-only">{menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}</span>
            </button>
          </div>
        </header>

        <section className="hero" id="top" tabIndex={-1}>
          <div className="hero-art">
            <picture>
              <source
                media="(min-width: 1024px)"
                srcSet="/images/satin/hero-desktop-480.webp 480w, /images/satin/hero-desktop-960.webp 960w"
                sizes="100vw"
              />
              <img
                src="/images/satin/hero-mobile-480.webp"
                srcSet="/images/satin/hero-mobile-480.webp 480w"
                sizes="100vw"
                width={480}
                height={640}
                alt="Fuşya saten üzerinde pembe manikürlü el ve kirpik yakın planı"
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </div>
          <div className="hero-shade" />
          <div className="content-width hero-inner" id="icerik" tabIndex={-1}>
            <div className="hero-copy">
              <h1>
                <span>Bakışınız.</span>
                <em>Unutulmaz.</em>
              </h1>
              <button className="circle-book" type="button" onClick={book}>
                <span>Randevu Al</span>
                <ArrowIcon />
              </button>
            </div>
          </div>
        </section>

        <section className="services" id="hizmetler" tabIndex={-1} aria-labelledby="hizmetler-baslik">
          <div className="outline-clip" aria-hidden="true">
            <p className="outline-word">BEAUTY</p>
          </div>
          <div className="content-width">
            <h2 id="hizmetler-baslik" className="sr-only">Hizmetler</h2>
            <div className="service-composition">
              {services.map((service) => (
                <a
                  key={service.id}
                  className={`service-card ${service.className}`}
                  href={`/hizmetler/${service.id}/`}
                  onClick={(event) => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                    event.preventDefault()
                    onOpenService(service.id)
                  }}
                >
                  <img
                    className="service-photo"
                    src={service.src}
                    srcSet={service.srcSet}
                    sizes="(min-width: 1024px) 360px, (max-width: 374px) 70vw, 34vw"
                    width={service.width}
                    height={service.height}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="service-caption">
                    <span className="service-number">{service.number}</span>
                    <span className="service-name">{service.name}</span>
                    <span className="service-rule" />
                  </span>
                  <ArrowIcon className="service-arrow" />
                </a>
              ))}
            </div>

            <div className="gallery" id="ornekler" tabIndex={-1}>
              <div className="section-label">
                <h2>Tırnak tasarımları</h2>
                <span />
              </div>
              <div className="gallery-grid">
                {gallery.map((item) => (
                  <button
                    key={item.id}
                    className="gallery-item"
                    type="button"
                    onClick={(event) => {
                      lightOpener.current = event.currentTarget
                      setMenuOpen(false)
                      setShot(item)
                    }}
                  >
                    <img
                      src={item.src}
                      srcSet={item.srcSet}
                      sizes={item.sizes}
                      width={item.width}
                      height={item.height}
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="gallery-corner" aria-hidden="true">+</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
        <JournalSection images={journalImages} />
      </div>

      <section className="mens-care" id="erkek-bakim" tabIndex={-1} aria-labelledby="erkek-baslik">
        <div className="mens-inner">
          <div className="mens-media">
            <img
              src="/images/satin/men-care-reference-960.webp"
              srcSet="/images/satin/men-care-reference-480.webp 480w, /images/satin/men-care-reference-960.webp 960w, /images/satin/men-care-reference.webp 1774w"
              sizes="(min-width: 1440px) 712px, (min-width: 768px) 50vw, 100vw"
              width={1774}
              height={887}
              alt="Doğal ve bakımlı ojesiz erkek eli"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="mens-copy">
            <h2 id="erkek-baslik">
              <a href="/hizmetler/erkek-manikur-pedikur/">
              <span>Erkek Manikür</span>
              <span>&amp; Pedikür</span>
              </a>
            </h2>
            <button
              className="mens-book"
              type="button"
              onClick={() => requestBooking('Erkek Manikür & Pedikür')}
              aria-label="Erkek Manikür ve Pedikür için randevu al"
            >
              <span>Randevu Al</span>
              <ArrowIcon />
            </button>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="content-width">
          <div className="footer-top">
            <a className="brand" href="#top" onClick={(event) => { event.preventDefault(); focusSection('top') }}>
              {siteConfig.wordmark}
            </a>
            <nav aria-label="Alt bölümler">
              <a href="#hizmetler" onClick={(event) => { event.preventDefault(); go('hizmetler') }}>Hizmetler</a>
              <a href="#ornekler" onClick={(event) => { event.preventDefault(); go('ornekler') }}>Galeri</a>
              <a href="#yazilar" onClick={(event) => { event.preventDefault(); go('yazilar') }}>Yazılar</a>
              <button className="nav-book" type="button" onClick={book}>Randevu Al</button>
            </nav>
          </div>
          <div className="footer-actions">
            <button className="pill-book" type="button" onClick={book}>
              <span>Randevu Al</span>
              <ArrowIcon />
            </button>
            {whatsappHref ? (
              <a className="whatsapp-link" href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ile iletişim">
                <WhatsAppIcon />
                <span>WhatsApp</span>
              </a>
            ) : null}
          </div>
          <div className="footer-meta">
            <small>© 2026 {siteConfig.brand}</small>
            <a className="footer-phone" href={`tel:+${siteConfig.whatsappNumber}`}>
              {siteConfig.phone}
            </a>
            {siteConfig.instagramUrl ? (
              <a className="icon-button" href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer">
                <InstagramIcon />
                <span className="sr-only">Instagram</span>
              </a>
            ) : null}
          </div>
        </div>
      </footer>

      <dialog
        ref={menuRef}
        id="menu-dialog"
        className="menu-dialog"
        aria-labelledby={menuTitleId}
        onCancel={(event) => {
          event.preventDefault()
          closeMenu()
        }}
      >
        <div className="dialog-top">
          <p id={menuTitleId} className="brand">{siteConfig.wordmark}</p>
          <button className="icon-button" type="button" data-close onClick={() => setMenuOpen(false)}>
            <CloseIcon />
            <span className="sr-only">Menüyü kapat</span>
          </button>
        </div>
        <nav className="menu-links" aria-label="Mobil menü">
          <a href="#hizmetler" onClick={(event) => { event.preventDefault(); go('hizmetler') }}><span>01</span>Hizmetler</a>
          <a href="#ornekler" onClick={(event) => { event.preventDefault(); go('ornekler') }}><span>02</span>Galeri</a>
          <a href="#erkek-bakim" onClick={(event) => { event.preventDefault(); go('erkek-bakim') }}><span>03</span>Erkek bakım</a>
          <a href="#yazilar" onClick={(event) => { event.preventDefault(); go('yazilar') }}><span>04</span>Yazılar</a>
        </nav>
        <button className="pill-book" type="button" onClick={book}>
          <span>Randevu Al</span>
          <ArrowIcon />
        </button>
      </dialog>

      <dialog
        ref={lightRef}
        id="lightbox"
        className="lightbox"
        aria-labelledby={lightTitleId}
        onCancel={(event) => {
          event.preventDefault()
          closeLight()
        }}
      >
        <button className="icon-button lightbox-close" type="button" data-close onClick={() => setShot(null)}>
          <CloseIcon />
          <span className="sr-only">Görseli kapat</span>
        </button>
        {shot ? (
          <figure>
            <img id={lightTitleId} src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} />
            <figcaption>{shot.alt}</figcaption>
          </figure>
        ) : null}
      </dialog>
    </div>
  )
}
