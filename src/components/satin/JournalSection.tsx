import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { ArrowIcon, CloseIcon } from './icons'
import { journalArticles, type JournalArticle, type JournalArticleId } from './journal'

export type JournalImage = {
  src: string
  srcSet?: string
  sizes?: string
  width: number
  height: number
  alt: string
}

type Props = {
  images: Record<JournalArticleId, JournalImage>
}

export function JournalSection({ images }: Props) {
  const sectionTitleId = useId()
  const articleTitleId = useId()
  const articleIntroId = useId()
  const [selected, setSelected] = useState<JournalArticle | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const wasOpenRef = useRef(false)
  const close = useCallback(() => setSelected(null), [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (selected) {
      wasOpenRef.current = true
      if (!dialog.open) dialog.showModal()
      dialog.scrollTop = 0
      dialog.querySelector<HTMLButtonElement>('[data-journal-close]')?.focus({ preventScroll: true })
      return
    }
    if (!wasOpenRef.current) return
    if (dialog.open) dialog.close()
    openerRef.current?.focus({ preventScroll: true })
    openerRef.current = null
    wasOpenRef.current = false
  }, [selected])

  useEffect(() => {
    if (!selected) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selected])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !selected) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const controls = [...dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex="0"]')]
        .filter((element) => element.getClientRects().length > 0)
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (!first || !last) {
        event.preventDefault()
        return
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    dialog.addEventListener('keydown', onKeyDown)
    return () => dialog.removeEventListener('keydown', onKeyDown)
  }, [selected])

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
                  <button
                    className="journal-read"
                    type="button"
                    aria-haspopup="dialog"
                    aria-label={`${article.title} — yazıyı oku`}
                    onClick={(event) => {
                      openerRef.current = event.currentTarget
                      setSelected(article)
                    }}
                  >
                    <span>Yazıyı oku</span><ArrowIcon />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
      <dialog
        ref={dialogRef}
        className="journal-dialog"
        aria-labelledby={articleTitleId}
        aria-describedby={articleIntroId}
        onCancel={(event) => {
          event.preventDefault()
          close()
        }}
      >
        <div className="journal-dialog-bar">
          <span className="journal-category">{selected?.category}</span>
          <button className="icon-button journal-close" type="button" data-journal-close onClick={close}>
            <CloseIcon />
            <span className="sr-only">Yazıyı kapat</span>
          </button>
        </div>
        {selected ? (
          <article className="journal-article">
            <header className="journal-article-heading">
              <h2 id={articleTitleId}>{selected.title}</h2>
              <p id={articleIntroId}>{selected.intro}</p>
            </header>
            <div className="journal-article-media">
              <img {...images[selected.id]} sizes="(min-width: 900px) 764px, 90vw" decoding="async" />
            </div>
            <div className="journal-article-body">
              {selected.sections.map((section) => (
                <section key={section.heading}>
                  <h3>{section.heading}</h3>
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </section>
              ))}
              <button className="journal-return" type="button" onClick={close}>
                Yazılara dön <ArrowIcon />
              </button>
            </div>
          </article>
        ) : null}
      </dialog>
    </section>
  )
}
