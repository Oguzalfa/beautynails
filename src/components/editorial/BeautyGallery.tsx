import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { editorialImage, editorialSrcSet, galleryPhotos, type GalleryCategory } from '../../content/gallery'

type Props = { variant: 'mobile' | 'desktop' }
type Filter = 'Tümü' | GalleryCategory
const filters: Filter[] = ['Tümü','Tırnak','Kirpik','Makyaj']

export function BeautyGallery({ variant }: Props) {
  const titleId = useId()
  const captionId = useId()
  const [filter, setFilter] = useState<Filter>('Tümü')
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const open = activeKey !== null
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const visible = galleryPhotos.filter(photo => filter === 'Tümü' || photo.category === filter)
  const activeIndex = visible.findIndex(photo => photo.key === activeKey)
  const active = activeIndex >= 0 ? visible[activeIndex] : null
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
      openerRef.current?.focus({preventScroll:true})
    }
  }, [open])

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)')
    const check = () => { if ((variant === 'mobile') !== query.matches) close() }
    query.addEventListener('change', check)
    return () => query.removeEventListener('change', check)
  }, [close, variant])

  return (
    <section className={`sz-theme sz-gallery sz-only-${variant}`} id={variant === 'desktop' ? 'calismalarimiz' : undefined} data-at-anchor={variant === 'mobile' ? 'calismalarimiz' : undefined} tabIndex={-1} aria-labelledby={titleId}>
      <div className="sz-content">
        <header className="sz-section-heading">
          <div>
            <p className="sz-eyebrow">ŞAZİ BEAUTY / GÜZELLİK SEÇKİSİ</p>
            <h2 id={titleId}>İlham, <em>detaylarda.</em></h2>
          </div>
          <p className="sz-section-intro">Pembe tonlar, parlak dokular.<br />Size ait bir stil için küçük fikirler.</p>
        </header>
        <div className="sz-gallery-toolbar">
          <div className="sz-filters" role="group" aria-label="Galeri kategorisi">
            {filters.map(item => <button type="button" key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}
          </div>
          <span className="sz-selection-count" aria-live="polite">{String(visible.length).padStart(2,'0')} görsel</span>
        </div>
        <div className={`sz-gallery-grid${filter === 'Tümü' ? ' is-all' : ''}`}>
          {visible.map((photo,index) => (
            <button className="sz-shot" type="button" key={photo.key} aria-label={`${photo.title} Görseli büyüt`} onClick={event => {openerRef.current=event.currentTarget;setActiveKey(photo.key)}}>
              <img src={editorialImage(photo.key,480)} srcSet={editorialSrcSet(photo.key)} sizes={`(max-width: 767px) calc((100vw - 52px) / 2), ${filter === 'Tümü' && index !== 0 && index !== 5 ? '22vw' : '44vw'}`} width={1200} height={1000} alt={photo.alt} loading="lazy" decoding="async" style={{objectPosition:photo.position}} />
              <span className="sz-shot-category">{photo.category}</span>
              <span className="sz-shot-caption"><span><small>{String(index+1).padStart(2,'0')}</small>{photo.title}</span><span className="sz-round-arrow" aria-hidden="true">↗</span></span>
            </button>
          ))}
        </div>
        <a className="sz-under-link" href="/#makaleler">Biraz daha ilham: bakım notlarını okuyun <span aria-hidden="true">↗</span></a>
      </div>
      <dialog ref={dialogRef} className="sz-lightbox" aria-labelledby={captionId} onCancel={event => {event.preventDefault();close()}} onClick={event => {if (event.target === event.currentTarget) close()}} onKeyDown={event => {
        if(event.key === 'ArrowRight' && active){ event.preventDefault();step(1) }
        if(event.key === 'ArrowLeft' && active){ event.preventDefault();step(-1) }
      }}>
        <div className="sz-lightbox-inner">
          <div className="sz-lightbox-bar"><span>{String(activeIndex+1).padStart(2,'0')} / {String(visible.length).padStart(2,'0')}</span><button type="button" className="sz-close" onClick={close} autoFocus>Kapat <span aria-hidden="true">×</span></button></div>
          {active ? <figure><img src={editorialImage(active.key)} alt={active.alt} width={1200} height={1000} /><figcaption id={captionId}><small>{active.category}</small><strong>{active.title}</strong></figcaption></figure> : <p id={captionId}>Güzellik seçkisi</p>}
          <div className="sz-lightbox-nav"><button type="button" onClick={() => step(-1)}>Önceki</button><button type="button" onClick={() => step(1)}>Sonraki</button></div>
        </div>
      </dialog>
    </section>
  )
}
