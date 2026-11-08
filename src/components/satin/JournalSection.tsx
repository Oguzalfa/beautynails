import { useId } from 'react'
import type { Locale } from '../../locales'
import { journalForLocale, pagesForLocale, pathForLocale } from '../../routes'
import { homeCopy } from './home-copy'
import { guideListHeading } from './local-guides'
import { ArrowIcon } from './icons'
import type { JournalArticleId } from './journal'

export type JournalImage = { src: string; srcSet?: string; sizes?: string; width: number; height: number; alt: string }
type Props = { images: Record<JournalArticleId, JournalImage>; locale: Locale }

export function JournalSection({ images, locale }: Props) {
  const copy = homeCopy[locale]
  const sectionTitleId = useId()
  const guides = pagesForLocale(locale).filter((page) => page.kind === 'article' && page.serviceId)
  return (
    <section className="journal" id="yazilar" tabIndex={-1} aria-labelledby={sectionTitleId}>
      <div className="content-width">
        <div className="journal-heading">
          <div>
            <p className="journal-eyebrow">{copy.journalEyebrow}</p>
            <h2 id={sectionTitleId}>{copy.journalHeading[0]} <em>{copy.journalHeading[1]}</em></h2>
          </div>
          <p className="journal-description">{copy.journalDescription}</p>
        </div>
        <div className="journal-grid">
          {journalForLocale(locale).map((article, index) => {
            const image = images[article.id]
            return (
              <article
                className={`journal-card${index === 0 ? ' journal-card-featured' : ''}`}
                key={article.id}
              >
                <div className="journal-card-media">
                  <img {...image} alt={copy.journalAlts[article.id]} loading="lazy" decoding="async" />
                </div>
                <div className="journal-card-copy">
                  <p className="journal-category">{article.category}</p>
                  <h3>{article.title}</h3>
                  <p className="journal-card-intro">{article.excerpt}</p>
                  <a
                    href={pathForLocale(`/yazilar/${article.id}/`, locale)}
                    className="journal-read"
                    aria-label={`${article.title} — ${copy.journalRead}`}
                  >
                    <span>{copy.journalRead}</span><ArrowIcon />
                  </a>
                </div>
              </article>
            )
          })}
        </div>
        <aside className="content-related" aria-label={guideListHeading[locale]}>
          <h2>{guideListHeading[locale]}</h2>
          <ul>
            {guides.map((guide) => (
              <li key={guide.path}><a href={guide.path}>{guide.heading}<ArrowIcon /></a></li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  )
}
