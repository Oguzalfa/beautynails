import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { siteConfig } from '../config/site'

type Props = {
  open: boolean
  initialService?: string | null
  onClose: () => void
}

const serviceOptions = ['Tırnak Sanatı', 'İpek Kirpik', 'Kalıcı Makyaj', 'Kaş & Yüz', 'Erkek Manikür & Pedikür'] as const

type Errors = Partial<Record<'name' | 'phone' | 'service', string>>

export function BookingPanel({ open, initialService, onClose }: Props) {
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
    const opened = window.open(url, '_blank', 'noopener')
    setDraftUrl(url)
    setStatus(opened ? 'opened' : 'blocked')
  }

  return (
    <div className="bn-modal" role="presentation" onClick={onClose}>
      <div
        className="bn-modal__panel bn-modal__panel--form"
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
          <div className="bn-form-success" role="status">
            <p>
              {status === 'opened'
                ? 'WhatsApp taslağı açıldı. Mesaj gönderilmeden randevu iletilmez.'
                : 'Tarayıcı yeni pencereyi engelledi. Aşağıdaki düğme aynı WhatsApp taslağını açar.'}
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
                    defaultChecked={option === initialService}
                    aria-invalid={!!errors.service}
                  />
                  {option}
                </label>
              ))}
              {errors.service ? <span className="bn-field-error">{errors.service}</span> : null}
            </fieldset>
            <label>
              Ad Soyad
              <input name="name" autoComplete="name" aria-invalid={!!errors.name} />
              {errors.name ? <span className="bn-field-error">{errors.name}</span> : null}
            </label>
            <label>
              Telefon
              <input name="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} />
              {errors.phone ? <span className="bn-field-error">{errors.phone}</span> : null}
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
