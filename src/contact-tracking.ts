import { siteConfig } from './config/site'

type TrackingWindow = Window & { dataLayer?: unknown[]; __beautyNailsContactTracking?: boolean }

export function initContactTracking() {
  const targetWindow = window as TrackingWindow
  if (targetWindow.__beautyNailsContactTracking) return
  targetWindow.__beautyNailsContactTracking = true
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button > 0 || !(event.target instanceof Element)) return
    const link = event.target.closest<HTMLAnchorElement>('a[href]')
    if (!link) return
    const url = new URL(link.href, window.location.href)
    const action = url.hostname === 'wa.me' && url.pathname === `/${siteConfig.whatsappNumber}`
      ? 'whatsapp_open'
      : link.dataset.contactAction === 'directions' ? 'directions_open' : null
    if (!action) return
    targetWindow.dataLayer = targetWindow.dataLayer || []
    targetWindow.dataLayer.push({
      event: 'contact_action',
      contact_action: action,
      contact_placement: link.dataset.contactPlacement || 'page-link',
      page_path: window.location.pathname,
    })
  }, { passive: true, capture: true })
}
