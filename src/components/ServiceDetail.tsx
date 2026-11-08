import { useId, useRef, type RefObject } from 'react'
import { services } from '../config/site'
import { useDialog } from '../hooks/useDialog'
import { useLocale } from '../i18n/LocaleContext'

type Props = {
  serviceId: string | null
  onClose: () => void
  returnFocusRef?: RefObject<HTMLElement | null>
}

export function ServiceDetail({ serviceId, onClose, returnFocusRef }: Props) {
  const { t, href } = useLocale()
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
          {t('Kapat')}
        </button>
        <div className="bn-modal__media">
          <img src={service.image} alt="" width={512} height={341} />
        </div>
        <h2 id={titleId}>{t(service.title)}</h2>
        <p>{t(service.detail)}</p>
        <a className="sz-service-detail-link" href={href(`/hizmetler/${service.id}/`)}>{t('Hizmet rehberini okuyun')} <span aria-hidden="true">↗</span></a>
        <p>
          {t('Süre, ücret ve ürün detayları randevu görüşmesinde netleştirilir.')}
        </p>
      </div>
    </div>
  )
}
