import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { services } from '../config/site'
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useMedia'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  onOpenService: (id: string) => void
}

export function Services({ onOpenService }: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const isMobile = useIsMobile()

  useEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return

    const cards = root.querySelectorAll('.service-card')
    const alreadyInView = root.getBoundingClientRect().top < window.innerHeight * 0.92
    if (alreadyInView) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        {
          y: isMobile ? 16 : 28,
          rotateX: isMobile ? 3 : 5,
          opacity: 0.001,
          transformPerspective: 800,
        },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          duration: isMobile ? 0.45 : 0.55,
          stagger: isMobile ? 0.05 : 0.07,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: root,
            start: 'top 88%',
            once: true,
          },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [isMobile, reduced])

  return (
    <section ref={rootRef} id="hizmetler" className="services section">
      <div className="services__head">
        <div>
          <p className="eyebrow">UZMANLIK ALANLARIMIZ</p>
          <h2 className="section-title">
            Her detayda <span className="accent">bir imza.</span>
          </h2>
        </div>
        <a className="text-link" href="#hizmetler">
          Tüm Hizmetler <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="services__grid">
        {services.map((service) => (
          <article key={service.id} id={service.id} className="service-card">
            <button
              type="button"
              className="service-card__hit"
              onClick={() => onOpenService(service.id)}
              aria-label={`${service.title} detayını aç`}
            >
              <div className="service-card__media">
                <img
                  src={service.image}
                  alt={service.title}
                  width={640}
                  height={256}
                  loading="lazy"
                  data-crop={
                    service.id === 'tirnak-sanati'
                      ? 'manikur'
                      : service.id === 'ipek-kirpik'
                        ? 'kirpik'
                        : service.id === 'kalici-makyaj'
                          ? 'dudak'
                          : 'kas'
                  }
                />
              </div>
              <div className="service-card__body">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
              <span className="icon-btn" aria-hidden="true">
                →
              </span>
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
