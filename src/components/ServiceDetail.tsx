import { useId, useRef, type RefObject } from 'react'
import { services } from '../config/site'
import { useDialog } from '../hooks/useDialog'

type Props = {
  serviceId: string | null
  onClose: () => void
  returnFocusRef?: RefObject<HTMLElement | null>
}

export function ServiceDetail({ serviceId, onClose, returnFocusRef }: Props) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const service = services.find((s) => s.id === serviceId) ?? null

  useDialog(!!service, panelRef, closeRef, onClose, returnFocusRef)

  if (!service) return null

  return (
    <div className="bn-modal" role="presentation" onClick={onClose}>
      <div
        ref={panelRef}
        className="bn-modal__panel"
        tabIndex={-1}
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
