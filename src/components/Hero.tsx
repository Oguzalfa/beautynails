import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HeroSceneCanvas } from './HeroSceneCanvas'
import { CategoryStrip } from './CategoryStrip'
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useMedia'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  onOpenBooking: () => void
  webglOk: boolean
  onWebglLost?: () => void
}

export function Hero({ onOpenBooking, webglOk, onWebglLost }: Props) {
  const pinRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const portraitWrapRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const isMobile = useIsMobile()
  const reduced = usePrefersReducedMotion()
  const [progress, setProgress] = useState(0)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(true)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const pin = pinRef.current
    const stage = stageRef.current
    const copy = copyRef.current
    const portrait = portraitWrapRef.current
    const panel = panelRef.current
    const label = labelRef.current
    if (!pin || !stage || !copy || !portrait || !panel || !label) return

    gsap.set([copy, portrait, panel, label, stage], { clearProps: 'all' })
    gsap.set(copy, { autoAlpha: 1, y: 0 })
    gsap.set(label, { autoAlpha: 0, y: 12 })

    if (reduced) {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === pin) t.kill(true)
      })
      gsap.set([copy, portrait, panel, label, stage], { clearProps: 'all' })
      gsap.set(copy, { autoAlpha: 1, y: 0 })
      gsap.set(label, { autoAlpha: 0 })
      queueMicrotask(() => {
        setProgress(0)
        setActive(true)
      })
      return
    }

    const headerH =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
      ) || 76
    const barH = isMobile
      ? parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--mobile-bar-h'),
        ) || 72
      : 0
    const usable = window.innerHeight - headerH - barH
    // No pin spacer: keep category + service cards on the first desktop screen.
    // Scroll still drives depth/zoom; zoom only increases with progress.
    const scrollDistance = usable * (isMobile ? 0.85 : 0.7)

    gsap.set(panel, { y: 14, rotate: -5.5, opacity: 0.94 })
    gsap.set(portrait, { scale: 1 })

    const intro = gsap.timeline()
    intro.to(
      panel,
      { y: 0, rotate: -3.5, opacity: 1, duration: 0.65, ease: 'power3.out' },
      0.2,
    )

    const mm = gsap.matchMedia()
    mm.add('(min-width: 0px)', () => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: `+=${Math.round(scrollDistance)}`,
          pin: false,
          scrub: isMobile ? 0.4 : 0.65,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress),
          onToggle: (self) => setActive(self.isActive || self.progress < 1),
          onLeave: () => setActive(false),
          onEnterBack: () => setActive(true),
        },
      })

      tl.to(
        copy,
        {
          y: isMobile ? -16 : -20,
          autoAlpha: 0,
          duration: 0.24,
        },
        0.1,
      )
        .to(
          portrait,
          {
            scale: isMobile ? 1.1 : 1.16,
            y: isMobile ? -12 : -18,
            duration: 0.55,
          },
          0.1,
        )
        .to(
          panel,
          {
            y: isMobile ? -26 : -36,
            x: isMobile ? 8 : 12,
            rotateY: 4,
            rotateZ: -1.5,
            duration: 0.55,
          },
          0.1,
        )
        .fromTo(
          label,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.18 },
          0.36,
        )
        .to(label, { autoAlpha: 0, y: -8, duration: 0.14 }, 0.6)
        .to(stage, { y: isMobile ? -12 : -20, duration: 0.14 }, 0.82)

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    })

    const onVis = () => {
      if (document.visibilityState !== 'visible') setActive(false)
      else setActive(true)
    }
    document.addEventListener('visibilitychange', onVis)
    ScrollTrigger.refresh()

    return () => {
      document.removeEventListener('visibilitychange', onVis)
      intro.kill()
      mm.revert()
      gsap.set([copy, portrait, panel, label, stage], { clearProps: 'all' })
    }
  }, [isMobile, reduced])

  useEffect(() => {
    if (reduced || isMobile) return
    const stage = stageRef.current
    if (!stage) return

    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
      setPointer({ x: nx, y: -ny })
    }
    const onLeave = () => setPointer({ x: 0, y: 0 })

    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerleave', onLeave)
    return () => {
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
    }
  }, [isMobile, reduced])

  const portraitShiftX = reduced || isMobile ? 0 : pointer.x * 7
  const portraitShiftY = reduced || isMobile ? 0 : pointer.y * 5
  const panelShiftX = reduced || isMobile ? 0 : pointer.x * 12
  const panelShiftY = reduced || isMobile ? 0 : pointer.y * 8

  return (
    <section ref={pinRef} className="hero-pin" id="top" aria-label="Giriş">
      <div ref={stageRef} className="hero-stage">
        <div className="hero-gradient" aria-hidden="true" />

        <HeroSceneCanvas
          progress={progress}
          pointer={pointer}
          active={active && !reduced}
          reduced={reduced}
          isMobile={isMobile}
          enabled={webglOk && !reduced}
          onContextLost={onWebglLost}
        />

        {!webglOk || reduced ? <div className="hero-fallback-arch" aria-hidden="true" /> : null}

        <div
          className="hero-copy-parallax"
          style={{
            transform: `translate3d(${reduced ? 0 : pointer.x * -4}px, ${reduced ? 0 : pointer.y * -3}px, 0)`,
          }}
        >
          <div ref={copyRef} className="hero-copy">
            <p className="eyebrow" lang="en">
              BEAUTY NAILS · PREMIUM BEAUTY
            </p>
            <h1>
              <span className="hero-line">Güzelliğin,</span>
              <span className="hero-line">
                en <em>özel</em> hâli.
              </span>
            </h1>
            <p className="hero-lead">
              Kişisel ilgi. Kusursuz detaylar. Size özel bakım.
            </p>
            <div className="hero-actions">
              <button type="button" className="btn btn-primary" onClick={onOpenBooking}>
                Randevunuzu Planlayın
              </button>
              <a className="btn btn-secondary" href="#deneyim">
                Deneyimi Keşfedin
              </a>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div
            className="hero-portrait-parallax"
            style={{
              transform: `translate3d(${portraitShiftX}px, ${portraitShiftY}px, 0)`,
            }}
          >
            <div ref={portraitWrapRef} className="hero-portrait">
              {!imgError ? (
                <img
                  src="/images/hero-portrait-cutout.webp"
                  alt="Beauty Nails imza bakım portresi"
                  width={614}
                  height={819}
                  decoding="async"
                  fetchPriority="high"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div
                  className="hero-portrait-placeholder"
                  role="img"
                  aria-label="Portre yüklenemedi — kaynak cutout eksik veya bozuk"
                />
              )}
            </div>
          </div>

          <div
            className="manicure-panel-parallax"
            style={{
              transform: `translate3d(${panelShiftX}px, ${panelShiftY}px, 0)`,
            }}
          >
            <div ref={panelRef} className="manicure-panel">
              <a href="#tirnak-sanati" className="manicure-panel__link">
                <img
                  src="/images/service-manikur.webp"
                  alt="Fransız manikür detayı"
                  width={320}
                  height={320}
                  loading="eager"
                />
                <span className="manicure-panel__meta">
                  <span>İmza dokunuşlar</span>
                  <span className="manicure-panel__arrow" aria-hidden="true">
                    →
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>

        <p ref={labelRef} className="hero-mid-label">
          Güzellik, detaylarda.
        </p>
      </div>
      <CategoryStrip />
    </section>
  )
}
