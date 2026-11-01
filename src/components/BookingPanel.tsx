import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { siteConfig } from '../config/site'

type Props = {
  open: boolean
  onClose: () => void
}

type Errors = Partial<Record<'name' | 'phone' | 'service', string>>

export function BookingPanel({ open, onClose }: Props) {
  const titleId = useId()
  const firstRef = useRef<HTMLInputElement>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'draft'>('idle')

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') || '').trim()
    const phone = String(fd.get('phone') || '').trim()
    const service = String(fd.get('service') || '').trim()
    const next: Errors = {}
    if (!name) next.name = 'Lütfen adınızı yazın.'
    if (!phone) next.phone = 'Lütfen telefon numaranızı yazın.'
    if (!service) next.service = 'Lütfen bir hizmet seçin.'
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

    setStatus('draft')
  }

  const openWhatsApp = () => {
    if (!siteConfig.whatsappNumber) return
    const text = encodeURIComponent('Merhaba, Beauty Nails randevu için yazıyorum.')
    window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${text}`, '_blank', 'noopener')
  }

  return (
    <div className="modal" role="presentation" onClick={onClose}>
      <div
        className="modal__panel modal__panel--form"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal__close" onClick={onClose}>
          Kapat
        </button>
        <h2 id={titleId}>Randevu talebi</h2>
        <p>
          {siteConfig.bookingProviderUrl
            ? 'Sizi mevcut randevu akışına yönlendireceğiz.'
            : 'Bu yerel bir taslak taleptir. Online rezervasyon henüz bağlı değil.'}
        </p>

        {status === 'draft' ? (
          <div className="form-success" role="status">
            <p>
              Taslak hazır. Talebiniz otomatik gönderilmedi. İletişim bilgileri eklendiğinde
              randevu akışı tamamlanacak.
            </p>
            {siteConfig.whatsappNumber ? (
              <button type="button" className="btn btn-pink" onClick={openWhatsApp}>
                WhatsApp taslağını aç
              </button>
            ) : null}
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Kapat
            </button>
          </div>
        ) : (
          <form className="booking-form" onSubmit={onSubmit} noValidate>
            <label>
              Ad Soyad
              <input ref={firstRef} name="name" autoComplete="name" aria-invalid={!!errors.name} />
              {errors.name ? <span className="field-error">{errors.name}</span> : null}
            </label>
            <label>
              Telefon
              <input name="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} />
              {errors.phone ? <span className="field-error">{errors.phone}</span> : null}
            </label>
            <label>
              Hizmet
              <select name="service" defaultValue="" aria-invalid={!!errors.service}>
                <option value="" disabled>
                  Seçin
                </option>
                <option>Tırnak Sanatı</option>
                <option>İpek Kirpik</option>
                <option>Kalıcı Makyaj</option>
                <option>Kaş & Yüz</option>
              </select>
              {errors.service ? <span className="field-error">{errors.service}</span> : null}
            </label>
            <label>
              Tercih edilen gün (opsiyonel)
              <input name="day" type="date" />
            </label>
            <label>
              Not (opsiyonel)
              <textarea name="note" rows={3} />
            </label>
            <button type="submit" className="btn btn-pink">
              Taslağı Kaydet
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
