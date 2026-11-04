import { useEffect, useId, useRef } from 'react'
import { services } from '../config/site'

type Props = {
  serviceId: string | null
  onClose: () => void
}

export function ServiceDetail({ serviceId, onClose }: Props) {
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

  return (
    <div className="bn-modal" role="presentation" onClick={onClose}>
      <div
        className="bn-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} type="button" className="bn-modal__close" onClick={onClose}>
          Kapat
        </button>
        <div className="bn-modal__media">
          <img src={service.image} alt="" width={512} height={341} />
        </div>
        <h2 id={titleId}>{service.title}</h2>
        <p>{service.detail}</p>
        <a className="sz-service-detail-link" href={`/hizmetler/${service.id}/`}>Hizmet rehberini okuyun ↗</a>
        <p>
          Süre, ücret ve ürün detayları randevu görüşmesinde netleştirilir.
        </p>
      </div>
    </div>
  )
}
