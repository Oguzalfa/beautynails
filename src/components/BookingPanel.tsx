import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { siteConfig } from '../config/site'
import type { Locale } from '../locales'
import { bookingCopy, serviceOptions } from './booking-copy'

type Props = {
  open: boolean
  initialService?: string | null
  locale?: Locale
  onClose: () => void
}

type Errors = Partial<Record<'name' | 'phone' | 'service', true>>

export function BookingPanel({ open, initialService, locale = 'tr', onClose }: Props) {
  const copy = bookingCopy[locale]
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const firstRef = useRef<HTMLInputElement>(null)
  const directRef = useRef<HTMLAnchorElement>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [draftUrl, setDraftUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.style.overflow = 'hidden'
    const firstControl = directRef.current ?? firstRef.current
    firstControl?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const controls = [...panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
      )].filter((element) => {
        const closedDetails = element.closest('details:not([open])')
        if (closedDetails && element !== closedDetails.querySelector('summary')) return false
        return element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden'
      })
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (!first) {
        e.preventDefault()
        panel.focus()
      } else if (e.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
      if (opener?.isConnected) opener.focus({ preventScroll: true })
    }
  }, [open, onClose])

  useEffect(() => {
    if (open) return
    setDraftUrl(null)
    setErrors({})
  }, [open])

  if (!open) return null

  const initialOption = serviceOptions.find((option) => option === initialService)
  const directMessage = copy.directMessage(initialOption ? copy.serviceNames[initialOption] : undefined)
  const directUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(directMessage)}`

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') || '').trim()
    const phone = String(fd.get('phone') || '').trim()
    const services = fd.getAll('service').map((value) => String(value).trim()).filter(Boolean)
    const time = String(fd.get('time') || '').trim()
    const note = String(fd.get('note') || '').trim()
    const next: Errors = {}
    if (!name) next.name = true
    if (!phone) next.phone = true
    if (!services.length) next.service = true
    setErrors(next)
    if (Object.keys(next).length) {
      const firstKey = Object.keys(next)[0]
      const el = e.currentTarget.querySelector(`[name="${firstKey}"]`) as HTMLElement | null
      el?.focus()
      return
    }

    if (siteConfig.bookingProviderUrl) {
      window.location.href = siteConfig.bookingProviderUrl
      return
    }

    const lines = [
      `Merhaba, ${siteConfig.brand} randevu talebi:`,
      `Hizmet: ${services.join(', ')}`,
      `Ad soyad: ${name}`,
      `Telefon: ${phone}`,
    ]
    if (time) lines.push(`Saat: ${time}`)
    if (note) lines.push(`Not: ${note}`)
    if (locale !== 'tr') lines.push(`Dil: ${locale.toUpperCase()}`)
    const url = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`
    setDraftUrl(url)
    // A null return value is also expected with noopener, even when a tab opens.
    // Keep a neutral draft-ready state and a usable link regardless of the handoff.
    try {
      window.open(url, '_blank', 'noopener')
    } catch {
      // The prepared draft remains available through the explicit link below.
    }
    try {
      const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer
      dataLayer?.push({
        event: 'booking_draft_prepared',
        service_count: services.length,
        language: locale,
      })
    } catch {
      // Measurement must not prevent a customer from opening their draft.
    }
  }

  return (
    <div className="bn-modal" role="presentation" onClick={onClose}>
      <div
        ref={panelRef}
        className="bn-modal__panel bn-modal__panel--form"
        role="dialog"
        tabIndex={-1}
        lang={locale}
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="bn-modal__close" onClick={onClose}>
          {copy.close}
        </button>
        <h2 id={titleId}>{copy.title}</h2>
        <p>
          {siteConfig.bookingProviderUrl
            ? copy.providerIntro
            : copy.whatsappIntro(locale === 'ar' ? `\u2066${siteConfig.phone}\u2069` : siteConfig.phone)}
        </p>

        {draftUrl ? (
          <div className="bn-form-success" role="status">
            <p>{copy.draftReady}</p>
            <a className="bn-button bn-button--solid" href={draftUrl} target="_blank" rel="noopener noreferrer" data-contact-placement="booking-draft">
              {copy.openDraft}
            </a>
            <button type="button" className="bn-button bn-button--outline" onClick={onClose}>
              {copy.close}
            </button>
          </div>
        ) : (
          <>
            {!siteConfig.bookingProviderUrl ? (
              <a
                ref={directRef}
                className="bn-button bn-button--solid bn-booking-direct"
                href={directUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-contact-placement="booking-direct"
              >
                {copy.directWhatsApp}
              </a>
            ) : null}
            <details className="bn-booking-optional" open={siteConfig.bookingProviderUrl ? true : undefined}>
              <summary className="bn-booking-optional__summary">{copy.optionalDetails}</summary>
              <form className="bn-form" onSubmit={onSubmit} noValidate>
                <fieldset className="bn-form__choices">
                  <legend>{copy.services}</legend>
                  {serviceOptions.map((option, index) => (
                    <label key={option}>
                      <input
                        ref={index === 0 ? firstRef : undefined}
                        name="service"
                        type="checkbox"
                        value={option}
                        defaultChecked={option === initialService}
                        aria-invalid={!!errors.service}
                      />
                      {copy.serviceNames[option]}
                    </label>
                  ))}
                  {errors.service ? <span className="bn-field-error">{copy.errors.service}</span> : null}
                </fieldset>
                <label>
                  {copy.name}
                  <input name="name" autoComplete="name" aria-invalid={!!errors.name} />
                  {errors.name ? <span className="bn-field-error">{copy.errors.name}</span> : null}
                </label>
                <label>
                  {copy.phone}
                  <input name="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} />
                  {errors.phone ? <span className="bn-field-error">{copy.errors.phone}</span> : null}
                </label>
                <label>
                  {copy.time}
                  <input name="time" type="time" />
                </label>
                <label>
                  {copy.note}
                  <textarea name="note" rows={3} />
                </label>
                <button type="submit" className="bn-button bn-button--solid">
                  {copy.submit}
                  <span aria-hidden="true">→</span>
                </button>
              </form>
            </details>
          </>
        )}
      </div>
    </div>
  )
}
