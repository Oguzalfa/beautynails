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
    <div className="modal" role="presentation" onClick={onClose}>
      <div
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} type="button" className="modal__close" onClick={onClose}>
          Kapat
        </button>
        <div className="modal__media">
          <img src={service.image} alt={service.title} width={640} height={520} />
        </div>
        <h2 id={titleId}>{service.title}</h2>
        <p>{service.detail}</p>
        <p className="modal__hint">
          Süre, ücret ve ürün detayları randevu görüşmesinde netleştirilir.
        </p>
      </div>
    </div>
  )
}
