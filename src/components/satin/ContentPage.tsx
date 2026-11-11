import { siteConfig } from '../../config/site'
import type { Locale } from '../../locales'
import { getLocalizedPage, pagesForLocale, pathForLocale } from '../../routes'
import { LanguageSelector } from '../LanguageSelector'
import { contentPageCopy } from './content-page-copy'
import { ArrowIcon, WhatsAppIcon } from './icons'
import type { ContentPageData } from './pages'

type Props = {
  locale: Locale
  path: string
  page: ContentPageData | null
  onBook: (service?: string) => void
}

export function ContentPage({ locale, path, page, onBook }: Props) {
  const copy = contentPageCopy[locale]
  const contentPages = pagesForLocale(locale)
  const articles = contentPages.filter((item) => item.kind === 'article')
  const services = contentPages.filter((item) => item.kind === 'service')
  const isIndex = page?.kind === 'journal-index' || page?.kind === 'service-index'
  const listedPages = page?.kind === 'service-index' ? services : articles
  const homePath = locale === 'tr' ? '/?lang=tr' : pathForLocale('/', locale)
  const servicesPath = pathForLocale('/hizmetler/', locale)
  const journalPath = pathForLocale('/yazilar/', locale)
  const serviceId = page?.serviceId
  const bookingService = serviceId
    ? getLocalizedPage(`/hizmetler/${serviceId}/`, 'tr')?.heading
    : undefined
  const book = () => onBook(bookingService)
  const companion = serviceId && (page?.kind === 'service'
    ? articles.find((item) => item.serviceId === (serviceId === 'protez-tirnak' ? 'tirnak-sanati' : serviceId))
    : services.find((item) => item.serviceId === serviceId))
  const extensions = serviceId === 'tirnak-sanati'
    ? getLocalizedPage('/hizmetler/protez-tirnak/', locale)
    : null
  const hasPriceInquiry = page?.kind === 'service' && (serviceId === 'tirnak-sanati' || serviceId === 'protez-tirnak')
  const priceMessage = `Merhaba, BeautyNails’te ${bookingService} için güncel fiyat ve uygun randevu saatini öğrenebilir miyim?${locale === 'tr' ? '' : `\nDil: ${locale.toUpperCase()}`}`

  return (
    <div className="satin-page content-page" lang={locale}>
      <a className="content-page-skip" href="#sayfa-icerik">{copy.skip}</a>
      <header className="content-page-header content-width">
        <a className="brand" href={homePath} aria-label={copy.brandHome}>{siteConfig.wordmark}</a>
        <div className="content-header-actions">
          <nav aria-label={copy.pageSections}>
            <a href={servicesPath}>{copy.services}</a>
            <a href={journalPath}>{copy.articles}</a>
            <button className="nav-book" type="button" onClick={book}>{copy.book}</button>
          </nav>
          <LanguageSelector locale={locale} path={path} />
        </div>
      </header>

      <main id="sayfa-icerik" className="content-width content-page-main" tabIndex={-1}>
        <nav className="content-breadcrumb" aria-label={copy.breadcrumb}>
          <ol>
            <li><a href={homePath}>{copy.home}</a></li>
            {page?.kind === 'article' ? <li><a href={journalPath}>{copy.journal}</a></li> : null}
            {page?.kind === 'service' ? <li><a href={servicesPath}>{copy.services}</a></li> : null}
            <li aria-current="page">{page?.heading ?? copy.notFound}</li>
          </ol>
        </nav>

        {page ? (
          <>
            <article className={`content-story content-story-${page.kind}`}>
              <header className="content-story-heading">
                <p className="content-kicker">{page.category}</p>
                <h1>{page.heading}</h1>
                {page.kind === 'article' ? <p className="content-byline">{siteConfig.brand} · {copy.journal}</p> : null}
                <p className="content-story-intro">{page.intro}</p>
                {hasPriceInquiry ? (
                  <a className="content-read-link" href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(priceMessage)}`} target="_blank" rel="noopener noreferrer">
                    {copy.askPrice}<ArrowIcon />
                  </a>
                ) : null}
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
                    <p>{copy.contactPrompt}</p>
                    {companion ? (
                      <div>
                        <a className="content-read-link" href={companion.path}>
                          {companion.heading}<ArrowIcon />
                        </a>
                      </div>
                    ) : null}
                    {extensions ? (
                      <div>
                        <a className="content-read-link" href={extensions.path}>
                          {extensions.heading}<ArrowIcon />
                        </a>
                      </div>
                    ) : null}
                    <button className="content-book" type="button" onClick={book}>
                      <span>{copy.book}</span><ArrowIcon />
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
                    <a className="content-read-link" href={item.path}>{page.kind === 'service-index' ? copy.readService : copy.readArticle} <ArrowIcon /></a>
                  </article>
                ))}
              </div>
            ) : (
              <aside className="content-related" aria-labelledby="ilgili-icerikler">
                <h2 id="ilgili-icerikler">{page.kind === 'service' ? copy.otherServices : copy.otherArticles}</h2>
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
            <h1>{copy.notFound}.</h1>
            <p>{copy.notFoundDescription}</p>
            <a className="content-read-link" href={homePath}>{copy.returnHome} <ArrowIcon /></a>
          </section>
        )}
      </main>

      <footer className="content-page-footer">
        <div className="content-width">
          <a className="brand" href={homePath} aria-label={copy.brandHome}>{siteConfig.wordmark}</a>
          <div className="content-page-contact">
            <a href={`tel:+${siteConfig.whatsappNumber}`} dir="ltr">{siteConfig.phone}</a>
            <a href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noopener noreferrer"><WhatsAppIcon /><span>WhatsApp</span></a>
          </div>
          <p>© {siteConfig.brand}</p>
        </div>
      </footer>
    </div>
  )
}
