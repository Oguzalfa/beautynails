import { siteConfig } from '../../config/site'
import { ArrowIcon, WhatsAppIcon } from './icons'
import { contentPages, type ContentPageData } from './pages'

type Props = {
  page: ContentPageData | null
  onBook: (service?: string) => void
}

export function ContentPage({ page, onBook }: Props) {
  const articles = contentPages.filter((item) => item.kind === 'article')
  const services = contentPages.filter((item) => item.kind === 'service')
  const isIndex = page?.kind === 'journal-index' || page?.kind === 'service-index'
  const listedPages = page?.kind === 'service-index' ? services : articles

  return (
    <div className="satin-page content-page">
      <a className="content-page-skip" href="#sayfa-icerik">İçeriğe geç</a>
      <header className="content-page-header content-width">
        <a className="brand" href="/" aria-label="BeautyNails ana sayfa">{siteConfig.wordmark}</a>
        <nav aria-label="Sayfa bölümleri">
          <a href="/hizmetler/">Hizmetler</a>
          <a href="/yazilar/">Yazılar</a>
          <button className="nav-book" type="button" onClick={() => onBook(page?.kind === 'service' ? page.heading : undefined)}>Randevu Al</button>
        </nav>
      </header>

      <main id="sayfa-icerik" className="content-width content-page-main" tabIndex={-1}>
        <nav className="content-breadcrumb" aria-label="İçerik yolu">
          <ol>
            <li><a href="/">Ana sayfa</a></li>
            {page?.kind === 'article' ? <li><a href="/yazilar/">Bakım notları</a></li> : null}
            {page?.kind === 'service' ? <li><a href="/hizmetler/">Hizmetler</a></li> : null}
            <li aria-current="page">{page?.heading ?? 'Sayfa bulunamadı'}</li>
          </ol>
        </nav>

        {page ? (
          <>
            <article className={`content-story content-story-${page.kind}`}>
              <header className="content-story-heading">
                <p className="content-kicker">{page.category}</p>
                <h1>{page.heading}</h1>
                {page.kind === 'article' ? <p className="content-byline">BeautyNails · Bakım notları</p> : null}
                <p className="content-story-intro">{page.intro}</p>
              </header>
              {page.image ? (
                <div className="content-story-image">
                  <img {...page.image} fetchPriority="high" decoding="async" />
                </div>
              ) : null}
              {page.sections.length ? (
                <div className="content-story-body">
                  {page.sections.map((section) => (
                    <section key={section.heading}>
                      <h2>{section.heading}</h2>
                      {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </section>
                  ))}
                  <div className="content-story-contact">
                    <p>Tercihlerinizi birlikte netleştirelim.</p>
                    <button className="content-book" type="button" onClick={() => onBook(page.kind === 'service' ? page.heading : undefined)}>
                      <span>Randevu Al</span><ArrowIcon />
                    </button>
                  </div>
                </div>
              ) : null}
            </article>

            {isIndex ? (
              <div className={`content-article-list${page.kind === 'service-index' ? ' content-service-list' : ''}`}>
                {listedPages.map((item) => (
                  <article key={item.path}>
                    <a href={item.path} className="content-article-cover" tabIndex={-1} aria-hidden="true">
                      {item.image ? <img {...item.image} loading="lazy" decoding="async" /> : null}
                    </a>
                    <p className="content-kicker">{item.category}</p>
                    <h2><a href={item.path}>{item.heading}</a></h2>
                    <p>{item.intro}</p>
                    <a className="content-read-link" href={item.path}>{page.kind === 'service-index' ? 'Hizmeti incele' : 'Yazıyı oku'} <ArrowIcon /></a>
                  </article>
                ))}
              </div>
            ) : (
              <aside className="content-related" aria-labelledby="ilgili-icerikler">
                <h2 id="ilgili-icerikler">{page.kind === 'service' ? 'Diğer hizmetler' : 'Diğer bakım notları'}</h2>
                <ul>
                  {(page.kind === 'service' ? services : articles).filter((item) => item.path !== page.path).map((item) => (
                    <li key={item.path}><a href={item.path}>{item.heading}<ArrowIcon /></a></li>
                  ))}
                </ul>
              </aside>
            )}
          </>
        ) : (
          <section className="content-not-found">
            <p className="content-kicker">404</p>
            <h1>Sayfa bulunamadı.</h1>
            <p>Bu adres artık kullanılmıyor veya yanlış yazılmış olabilir. BeautyNails ana sayfasından hizmetlere ve yazılara ulaşabilirsiniz.</p>
            <a className="content-read-link" href="/">Ana sayfaya dön <ArrowIcon /></a>
          </section>
        )}
      </main>

      <footer className="content-page-footer">
        <div className="content-width">
          <a className="brand" href="/">{siteConfig.wordmark}</a>
          <div className="content-page-contact">
            <a href={`tel:+${siteConfig.whatsappNumber}`}>{siteConfig.phone}</a>
            <a href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noopener noreferrer"><WhatsAppIcon /><span>WhatsApp</span></a>
          </div>
          <p>© {siteConfig.brand}</p>
        </div>
      </footer>
    </div>
  )
}
