import { useId } from 'react'
import journal from '../../content/journal.json'
import { editorialImage, editorialSrcSet } from '../../content/gallery'

export function BeautyJournal({ variant }: {variant:'mobile'|'desktop'}) {
  const headingId = useId()
  return (
    <section className={`sz-theme sz-journal sz-only-${variant}`} id={variant === 'desktop' ? 'makaleler' : undefined} data-at-anchor={variant === 'mobile' ? 'makaleler' : undefined} tabIndex={-1} aria-labelledby={headingId}>
      <div className="sz-content">
        <header className="sz-section-heading">
          <div><p className="sz-eyebrow">ŞAZİ JOURNAL / MAKALELER</p><h2 id={headingId}>Güzelliğin <em>ince notları.</em></h2></div>
          <p className="sz-section-intro">Biraz ilham, biraz stil.<br />Kendinize ayırdığınız zamana eşlik etsin.</p>
        </header>
        <div className="sz-journal-grid">
          {journal.map((article,index) => (
            <a className="sz-article-card" href={`/bakim-rehberi/${article.slug}/`} key={article.slug}>
              <div className="sz-article-image"><img src={editorialImage(article.image,480)} srcSet={editorialSrcSet(article.image)} sizes={`(max-width: 767px) ${index === 0 ? '92vw' : '105px'}, 30vw`} width={1200} height={1000} alt={article.alt} loading="lazy" decoding="async" /><span className="sz-article-number">{String(index+1).padStart(2,'0')}</span></div>
              <div className="sz-article-card-copy"><p className="sz-article-meta"><span>{article.category}</span><span>{article.readTime} okuma</span></p><h3>{article.title}</h3><p className="sz-article-excerpt">{article.excerpt}</p><span className="sz-article-read">Yazıyı oku <span className="sz-round-arrow" aria-hidden="true">↗</span></span></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
