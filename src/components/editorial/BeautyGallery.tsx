import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { editorialImage, editorialSrcSet, galleryPhotos } from '../../content/gallery'
import { studioPhotos, studioClips, type PhotoStyle } from '../../content/studio-gallery'
import { useLocale } from '../../i18n/LocaleContext'

type Props = { variant: 'mobile' | 'desktop' }
type Filter = 'Tümü' | PhotoStyle | 'Videolar' | 'İlham'
const filters: Filter[] = ['Tümü', 'French', 'Sade', 'Desenli', 'Videolar', 'İlham']
const previewCount = 8
const inspiration = galleryPhotos.map(photo => ({
  ...photo,
  thumbnail: editorialImage(photo.key, 480),
  image: editorialImage(photo.key),
  srcSet: editorialSrcSet(photo.key),
  width: 1200,
  height: 1000,
}))

export function BeautyGallery({ variant }: Props) {
  const { t, href } = useLocale()
  const titleId = useId()
  const captionId = useId()
  const gridId = useId()
  const [filter, setFilter] = useState<Filter>('Tümü')
  const [expanded, setExpanded] = useState(false)
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const open = activeKey !== null
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const collection = filter === 'Videolar' ? studioClips
    : filter === 'İlham' ? inspiration : studioPhotos.filter(photo => filter === 'Tümü' || photo.style === filter)
  const visible = filter === 'Tümü' && !expanded ? collection.slice(0, previewCount) : collection
  const activeIndex = visible.findIndex(item => item.key === activeKey)
  const active = visible[activeIndex]
  const close = useCallback(() => setActiveKey(null), [])
  const step = (offset: number) => setActiveKey(visible[(activeIndex + offset + visible.length) % visible.length].key)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    return () => {
      dialog.close()
      document.body.style.overflow = previous
      openerRef.current?.focus({ preventScroll: true })
    }
  }, [open])

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)')
    const check = () => { if ((variant === 'mobile') !== query.matches) close() }
    query.addEventListener('change', check)
    return () => query.removeEventListener('change', check)
  }, [close, variant])

  const toggleCollection = () => {
    if (expanded) gridRef.current?.scrollIntoView({ block: 'start' })
    setExpanded(!expanded)
  }

  return (
    <section className={`sz-theme sz-gallery sz-only-${variant}`} id={variant === 'desktop' ? 'calismalarimiz' : undefined} data-at-anchor={variant === 'mobile' ? 'calismalarimiz' : undefined} tabIndex={-1} aria-labelledby={titleId}>
      <div className="sz-content">
        <header className="sz-section-heading">
          <div>
            <p className="sz-eyebrow">{t('Tırnak')}</p>
            <h2 id={titleId}><em>{t('Çalışmalarımız.')}</em></h2>
          </div>
        </header>
        <div className="sz-gallery-toolbar">
          <div className="sz-filters" role="group" aria-label={t('Galeri kategorisi')}>
            {filters.map(item => <button type="button" key={item} aria-pressed={filter === item} aria-controls={gridId} onClick={() => setFilter(item)}>{t(item)}</button>)}
          </div>
          <span className="sz-selection-count" aria-live="polite">{t(filter === 'Videolar' ? '{count} video' : '{count} görsel').replace('{count}', String(collection.length))}</span>
        </div>
        <div className="sz-studio-grid" id={gridId} ref={gridRef}>
          {visible.map(item => {
            const isVideo = 'video' in item
            const title = t(item.title)
            return (
              <button className="sz-shot sz-studio-shot" type="button" key={item.key} aria-label={isVideo ? title + ' · ' + t('Videoyu oynat') : t('{title}: Görseli büyüt').replace('{title}', () => title)}
                onClick={event => { openerRef.current = event.currentTarget; setActiveKey(item.key) }}>
                <img src={item.thumbnail} srcSet={isVideo ? undefined : 'srcSet' in item ? item.srcSet : `${item.thumbnail} 360w, ${item.image} 900w`}
                  sizes={isVideo ? undefined : '(max-width: 767px) calc((100vw - 50px) / 2), (max-width: 1600px) 22vw, 350px'}
                  width={item.width} height={item.height} alt={'alt' in item ? t(item.alt) : title} loading="lazy" decoding="async"
                  style={'position' in item ? { objectPosition: item.position } : undefined} />
                <span className="sz-shot-caption"><span>{title}</span><span className="sz-round-arrow" aria-hidden="true">{isVideo ? '▶' : '↗'}</span></span>
              </button>
            )
          })}
        </div>
        <div className="sz-gallery-links">
          {filter === 'Tümü' && <button className="sz-pill-link sz-gallery-toggle" type="button" aria-controls={gridId} aria-expanded={expanded} onClick={toggleCollection}>{t(expanded ? 'Seçkiyi göster' : 'Tüm fotoğrafları göster')}</button>}
          <a className="sz-under-link" href={href('/#makaleler')}>{t('Biraz daha ilham: bakım notlarını okuyun')} <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <dialog ref={dialogRef} className="sz-lightbox" aria-labelledby={captionId} onCancel={event => { event.preventDefault(); close() }} onClick={event => { if (event.target === event.currentTarget) close() }} onKeyDown={event => {
        if (!active || event.target instanceof HTMLVideoElement) return
        if (event.key === 'ArrowRight') { event.preventDefault(); step(1) }
        if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1) }
      }}>
        <div className="sz-lightbox-inner">
          <div className="sz-lightbox-bar"><span>{String(activeIndex + 1).padStart(2, '0')} / {String(visible.length).padStart(2, '0')}</span><button type="button" className="sz-close" onClick={close} autoFocus>{t('Kapat')} <span aria-hidden="true">×</span></button></div>
          {active ? <figure key={active.key}>
            {'video' in active
              ? <video controls playsInline autoPlay muted preload="metadata" src={active.video} poster={active.image} width={active.width} height={active.height} aria-labelledby={captionId} />
              : <img src={active.image} alt={t('alt' in active ? active.alt : active.title)} width={active.width} height={active.height} />}
            <figcaption id={captionId}><strong>{t(active.title)}</strong></figcaption>
          </figure> : <p id={captionId}>{t('Güzellik seçkisi')}</p>}
          <div className="sz-lightbox-nav"><button type="button" onClick={() => step(-1)}>{t('Önceki')}</button><button type="button" onClick={() => step(1)}>{t('Sonraki')}</button></div>
        </div>
      </dialog>
    </section>
  )
}
