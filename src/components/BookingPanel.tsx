import { useEffect, useId, useRef, useState, type FormEvent, type RefObject } from 'react'
import { siteConfig } from '../config/site'
import { useDialog } from '../hooks/useDialog'

type Props = {
  open: boolean
  onClose: () => void
  returnFocusRef?: RefObject<HTMLElement | null>
}

const serviceOptions = ['Tırnak Sanatı', 'İpek Kirpik', 'Kalıcı Makyaj', 'Kaş & Yüz'] as const

type Errors = Partial<Record<'name' | 'phone' | 'service', string>>

export function BookingPanel({ open, onClose, returnFocusRef }: Props) {
  const titleId = useId()
  const firstRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'ready'>('idle')
  const [draftUrl, setDraftUrl] = useState<string | null>(null)

  useDialog(open, panelRef, firstRef, onClose, returnFocusRef)

  useEffect(() => {
    if (status === 'ready') successRef.current?.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true })
  }, [status])

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
    if (!name) next.name = 'Lütfen adınızı yazın.'
    if (!phone) next.phone = 'Lütfen telefon numaranızı yazın.'
    if (!services.length) next.service = 'Lütfen en az bir hizmet seçin.'
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
    const url = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`
    setDraftUrl(url)
    setStatus('ready')
    window.open(url, '_blank', 'noopener')
  }

  return (
    <div className="bn-modal" role="presentation" onClick={onClose}>
      <div
        ref={panelRef}
        className="bn-modal__panel bn-modal__panel--form"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="bn-modal__close" onClick={onClose}>
          Kapat
        </button>
        <h2 id={titleId}>Randevu talebi</h2>
        <p>
          {siteConfig.bookingProviderUrl
            ? 'Sizi mevcut randevu akışına yönlendireceğiz.'
            : `Randevu talebi ${siteConfig.phone} numaralı WhatsApp hattına hazırlanır. Mesajı siz gönderirsiniz.`}
        </p>

        {status !== 'idle' ? (
          <div ref={successRef} className="bn-form-success" role="status">
            <p>
              WhatsApp taslağınız hazır. Açılmadıysa aşağıdaki düğmeyi kullanın. Mesajı göndererek randevu talebinizi iletebilirsiniz.
            </p>
            {draftUrl ? (
              <a className="bn-button bn-button--solid" href={draftUrl} target="_blank" rel="noreferrer">
                WhatsApp taslağını aç
              </a>
            ) : null}
            <button type="button" className="bn-button bn-button--outline" onClick={onClose}>
              Kapat
            </button>
          </div>
        ) : (
          <form className="bn-form" onSubmit={onSubmit} noValidate>
            <fieldset className="bn-form__choices">
              <legend>Hizmet</legend>
              {serviceOptions.map((option, index) => (
                <label key={option}>
                  <input
                    ref={index === 0 ? firstRef : undefined}
                    name="service"
                    type="checkbox"
                    value={option}
                    aria-invalid={!!errors.service}
                    aria-describedby={errors.service ? `${titleId}-service-error` : undefined}
                  />
                  {option}
                </label>
              ))}
              {errors.service ? <span id={`${titleId}-service-error`} className="bn-field-error">{errors.service}</span> : null}
            </fieldset>
            <label>
              Ad Soyad
              <input name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? `${titleId}-name-error` : undefined} />
              {errors.name ? <span id={`${titleId}-name-error`} className="bn-field-error">{errors.name}</span> : null}
            </label>
            <label>
              Telefon
              <input name="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${titleId}-phone-error` : undefined} />
              {errors.phone ? <span id={`${titleId}-phone-error`} className="bn-field-error">{errors.phone}</span> : null}
            </label>
            <label>
              Saat
              <input name="time" type="time" />
            </label>
            <label>
              Not (isteğe bağlı)
              <textarea name="note" rows={3} />
            </label>
            <button type="submit" className="bn-button bn-button--solid">
              WhatsApp taslağını hazırla
              <span aria-hidden="true">→</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
