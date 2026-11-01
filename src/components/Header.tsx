import { useEffect, useId, useRef } from 'react'
import { navLinks, siteConfig } from '../config/site'

type Props = {
  menuOpen: boolean
  onToggleMenu: () => void
  onCloseMenu: () => void
  onOpenBooking: () => void
}

export function Header({
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onOpenBooking,
}: Props) {
  const menuId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseMenu()
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    firstLinkRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [menuOpen, onCloseMenu])

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="logo" href="#top" onClick={onCloseMenu}>
          <span className="logo__name">{siteConfig.brand.toLowerCase()}</span>
          <span className="logo__tag">{siteConfig.tagline}</span>
        </a>

        <nav className="nav-desktop" aria-label="Ana menü">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <button type="button" className="btn btn-pink header-cta" onClick={onOpenBooking}>
          Özel Randevu
          <span className="cta-arrow" aria-hidden="true">
            ↗
          </span>
        </button>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={onToggleMenu}
        >
          <span className="sr-only">{menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}</span>
          <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      <div
        id={menuId}
        className={`nav-mobile ${menuOpen ? 'is-open' : ''}`}
        hidden={!menuOpen}
      >
        <nav aria-label="Mobil menü">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              ref={i === 0 ? firstLinkRef : undefined}
              href={link.href}
              onClick={onCloseMenu}
            >
              {link.label}
            </a>
          ))}
          <button type="button" className="btn btn-pink" onClick={() => { onCloseMenu(); onOpenBooking() }}>
            Özel Randevu
          </button>
        </nav>
      </div>
    </header>
  )
}
