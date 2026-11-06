import { useId } from 'react'
import { ArrowIcon } from './icons'
import { journalArticles, type JournalArticleId } from './journal'
export type JournalImage = { src: string; srcSet?: string; sizes?: string; width: number; height: number; alt: string }
type Props = { images: Record<JournalArticleId, JournalImage> }
export function JournalSection({ images }: Props) {
  const sectionTitleId = useId()
  return (
    <section className="journal" id="yazilar" tabIndex={-1} aria-labelledby={sectionTitleId}>
      <div className="content-width">
        <div className="journal-heading">
          <div>
            <p className="journal-eyebrow">Güzellik &amp; bakım</p>
            <h2 id={sectionTitleId}>Bakım <em>notları.</em></h2>
          </div>
          <p className="journal-description">Tarzınızı seçerken size eşlik edecek notlar.</p>
        </div>
        <div className="journal-grid">
          {journalArticles.map((article, index) => {
            const image = images[article.id]
            return (
              <article
                className={`journal-card${index === 0 ? ' journal-card-featured' : ''}`}
                key={article.id}
              >
                <div className="journal-card-media">
                  <img {...image} loading="lazy" decoding="async" />
                </div>
                <div className="journal-card-copy">
                  <p className="journal-category">{article.category}</p>
                  <h3>{article.title}</h3>
                  <p className="journal-card-intro">{article.intro}</p>
                  <a
                    href={`/yazilar/${article.id}/`}
                    className="journal-read"
                    aria-label={`${article.title} — yazıyı oku`}

                  >
                    <span>Yazıyı oku</span><ArrowIcon />
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
