import { ArrowUpRight } from './icons'
import { FeatureSet, type FeatureSetKind } from './premium/BeautyNailsPremium'

type Props = { onOpenService: (id: string) => void }

type Band = {
  id: string
  number: string
  title: [string, string]
  description: string
  image: string
  alt: string
  position: string
  flip?: boolean
  fuchsia?: boolean
  features: FeatureSetKind
}

const bands: Band[] = [
  {
    id: 'tirnak-sanati',
    number: '01',
    title: ['Tırnak', 'Sanatı'],
    description: 'Zarif, modern ve size özel tırnak tasarımları.',
    image: '/images/fx/nails-macro.webp',
    alt: 'Pembe Fransız manikürü yakın planı',
    position: '50% 55%',
    features: 'nails',
  },
  {
    id: 'ipek-kirpik',
    number: '02',
    title: ['İpek', 'Kirpik'],
    description: 'Daha etkileyici ve doğal bir bakış.',
    image: '/images/fx/lashes-macro.webp',
    alt: 'Belirgin kirpikli ela göz yakın planı',
    position: '42% 48%',
    flip: true,
    fuchsia: true,
    features: 'lashes',
  },
  {
    id: 'kalici-makyaj',
    number: '03',
    title: ['Kalıcı', 'Makyaj'],
    description: 'Doğal güzellik, her zaman.',
    image: '/images/fx/lips-macro.webp',
    alt: 'Parlak pembe dudak yakın planı',
    position: '58% 50%',
    features: 'makeup',
  },
]

export function Services({ onOpenService }: Props) {
  return (
    <section id="hizmetler" aria-labelledby="services-title">
      <h2 id="services-title" className="bn-sr">Hizmetler</h2>
      {bands.map((band) => (
        <article
          key={band.id}
          id={band.id}
          className={`bn-service${band.flip ? ' bn-service--flip' : ''}${band.fuchsia ? ' bn-service--fuchsia' : ''}${band.id === 'tirnak-sanati' ? ' bn-service--nails' : ''}${band.id === 'kalici-makyaj' ? ' bn-service--makeup' : ''}`}
        >
          <img
            className="bn-service__photo"
            src={band.image}
            alt={band.alt}
            width={1706}
            height={922}
            style={{ objectPosition: band.position }}
            loading="lazy"
            decoding="async"
          />
          <div className="bn-service__panel">
            <div className="bn-service__lead">
            <p className="bn-service__number" aria-hidden="true">{band.number}</p>
            <div className="bn-service__content">
              <span className="bn-service__tick" aria-hidden="true" />
              <h3 className="bn-service__title">
                <span>{band.title[0]}</span>
                <span>{band.title[1]}</span>
              </h3>
              <p className="bn-service__description">{band.description}</p>
              <button type="button" className="bn-button bn-button--outline" onClick={() => onOpenService(band.id)}>
                Detayları Keşfedin
                <ArrowUpRight />
              </button>
            </div>
            </div>
            <div className="bn-service__features">
              <FeatureSet kind={band.features} />
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
