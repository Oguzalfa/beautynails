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
  const firstRef = useRef<HTMLInputElement>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'opened' | 'blocked'>('idle')
  const [draftUrl, setDraftUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.style.overflow = 'hidden'
    firstRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
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
    setStatus('idle')
    setDraftUrl(null)
    setErrors({})
  }, [open])

  if (!open) return null

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
    const opened = window.open(url, '_blank', 'noopener')
    setDraftUrl(url)
    setStatus(opened ? 'opened' : 'blocked')
  }

  return (
    <div className="bn-modal" role="presentation" onClick={onClose}>
      <div
        className="bn-modal__panel bn-modal__panel--form"
        role="dialog"
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

        {status !== 'idle' ? (
          <div className="bn-form-success" role="status">
            <p>
              {status === 'opened' ? copy.opened : copy.blocked}
            </p>
            {draftUrl ? (
              <a className="bn-button bn-button--solid" href={draftUrl} target="_blank" rel="noreferrer">
                {copy.openDraft}
              </a>
            ) : null}
            <button type="button" className="bn-button bn-button--outline" onClick={onClose}>
              {copy.close}
            </button>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}
