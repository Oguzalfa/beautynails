import { useEffect, useId, useRef } from 'react'
import { services } from '../config/site'
import type { Locale } from '../locales'
import { getLocalizedPage } from '../routes'
import { bookingCopy, serviceDetailCopy } from './booking-copy'
import { contentPageCopy } from './satin/content-page-copy'

type Props = {
  serviceId: string | null
  locale?: Locale
  onClose: () => void
}

export function ServiceDetail({ serviceId, locale = 'tr', onClose }: Props) {
  const copy = bookingCopy[locale]
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const service = services.find((s) => s.id === serviceId) ?? null

  useEffect(() => {
    if (!service) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [service, onClose])

  if (!service) return null
  const detail = locale === 'tr' ? service : serviceDetailCopy[locale][service.id]
  const servicePage = getLocalizedPage(`/hizmetler/${service.id}/`, locale)
  const extensionPage = service.id === 'tirnak-sanati'
    ? getLocalizedPage('/hizmetler/protez-tirnak/', locale)
    : null

  return (
    <div className="bn-modal" role="presentation" onClick={onClose}>
      <div
        className="bn-modal__panel"
        role="dialog"
        lang={locale}
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} type="button" className="bn-modal__close" onClick={onClose}>
          {copy.close}
        </button>
        <div className="bn-modal__media">
          <img src={service.image} alt="" width={512} height={341} />
        </div>
        <h2 id={titleId}>{detail.title}</h2>
        <p>{detail.detail}</p>
        <p>{copy.detailsNote}</p>
        {servicePage?.kind === 'service' ? (
          <div className="bn-modal__links">
            <a className="bn-button bn-button--outline" href={servicePage.path}>
              {contentPageCopy[locale].readService}
            </a>
            {extensionPage?.kind === 'service' ? (
              <a className="bn-button bn-button--outline" href={extensionPage.path}>
                {extensionPage.heading}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
