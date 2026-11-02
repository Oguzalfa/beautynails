import { useEffect, useId, useRef, useState } from 'react'
import { navLinks } from '../config/site'
import { PremiumAppointment, PremiumNav } from './premium/BeautyNailsPremium'
import { Wordmark } from './Wordmark'
import { CloseIcon, MenuIcon } from './icons'

type Props = {
  menuOpen: boolean
  onToggleMenu: () => void
  onCloseMenu: () => void
  onOpenBooking: () => void
}

export function Header({ menuOpen, onToggleMenu, onCloseMenu, onOpenBooking }: Props) {
  const menuId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState<string | null>(null)
  const [away, setAway] = useState(false)

  useEffect(() => {
    const marks: { id: string; href: string }[] = [
      { id: 'deneyim', href: '#deneyim' },
      { id: 'hizmetler', href: '#hizmetler' },
      { id: 'calismalarimiz', href: '#calismalarimiz' },
      { id: 'iletisim', href: '#iletisim' },
    ]
    const pick = () => {
      const nodes = marks.flatMap((mark) => {
        const el = document.querySelector(`[data-at-anchor="${mark.id}"]`)
        return el ? [{ el, href: mark.href }] : []
      })
      const bar = document.querySelector('.bn-header')?.getBoundingClientRect().height ?? 72
      const line = bar + 24
      let href = '#deneyim'
      for (const node of nodes) {
        if (node.el.getBoundingClientRect().top <= line) href = node.href
      }
      const contact = nodes.find((node) => node.href === '#iletisim')
      if (contact && contact.el.getBoundingClientRect().top < window.innerHeight * 0.62) {
        href = '#iletisim'
      }
      setCurrent(href)
      setAway(window.scrollY > 24)
    }
    pick()
    window.addEventListener('scroll', pick, { passive: true })
    window.addEventListener('resize', pick)
    window.addEventListener('hashchange', pick)
    return () => {
      window.removeEventListener('scroll', pick)
      window.removeEventListener('resize', pick)
      window.removeEventListener('hashchange', pick)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseMenu()
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    menuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()
    const media = window.matchMedia('(min-width: 1024px)')
    const onWide = () => {
      if (media.matches) onCloseMenu()
    }
    media.addEventListener('change', onWide)
    return () => {
      document.removeEventListener('keydown', onKey)
      media.removeEventListener('change', onWide)
    }
  }, [menuOpen, onCloseMenu])

  return (
    <header
      className={`bn-header${away ? ' is-away' : ''}`}
      onClick={(event) => {
        const link = event.target instanceof Element ? event.target.closest('.bnx-nav__link') : null
        const href = link?.getAttribute('href')
        if (href?.startsWith('#')) {
          setCurrent(href)
          const target = document.querySelector(`[data-at-anchor="${href.slice(1)}"]`)
          if (target instanceof HTMLElement) {
            event.preventDefault()
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
          }
        }
      }}
    >
      <a className="bn-logo" href="#top" onClick={onCloseMenu}>
        <Wordmark />
      </a>
      <PremiumNav items={navLinks} currentHref={current ?? undefined} label="Ana menü" />
      <PremiumAppointment
        href="#iletisim"
        compact
        className="bn-header__cta"
        onClick={(event) => {
          event.preventDefault()
          onOpenBooking()
        }}
      >
        Randevu Al
      </PremiumAppointment>
      <button
        ref={toggleRef}
        type="button"
        className="bn-menu-toggle"
        aria-expanded={menuOpen}
        aria-controls={menuId}
        onClick={onToggleMenu}
      >
        <span className="bn-sr">{menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}</span>
        {menuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>
      <div
        ref={menuRef}
        id={menuId}
        className={`bn-menu ${menuOpen ? 'is-open' : ''}`}
        hidden={!menuOpen}
        onClick={(event) => {
          if (event.target instanceof Element && event.target.closest('a')) onCloseMenu()
        }}
      >
        <PremiumNav items={navLinks} currentHref={current ?? undefined} label="Mobil menü" />
        <PremiumAppointment
          href="#iletisim"
          onClick={(event) => {
            event.preventDefault()
            onCloseMenu()
            onOpenBooking()
          }}
        >
          Özel Randevu
        </PremiumAppointment>
      </div>
    </header>
  )
}
