import { useEffect, type RefObject } from 'react'

const focusable = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]'

/** Keep the custom booking/service sheets usable with touch, a keyboard and zoom. */
export function useDialog(
  open: boolean,
  panelRef: RefObject<HTMLDivElement | null>,
  initialRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  returnFocusRef?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const panel = panelRef.current
    const overlay = panel?.closest<HTMLElement>('.bn-modal')
    if (!open || !panel || !overlay) return

    const previousFocus = returnFocusRef?.current ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null)
    const previousBodyOverflow = document.body.style.overflow
    const previousRootOverflow = document.documentElement.style.overflow
    const siblings = [...(overlay.parentElement?.children ?? [])]
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== overlay)
      .map(element => ({ element, inert: element.inert }))

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    siblings.forEach(({ element }) => { element.inert = true })

    const controls = () => [...panel.querySelectorAll<HTMLElement>(focusable)]
      .filter(element => element.tabIndex >= 0 && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden')
    const focusFirst = () => (controls()[0] ?? panel).focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'Tab') {
        const items = controls()
        const first = items[0]
        const last = items[items.length - 1]
        if (!first || !panel.contains(document.activeElement)) {
          event.preventDefault()
          focusFirst()
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus({ preventScroll: true })
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus({ preventScroll: true })
        }
      }
    }
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !panel.contains(event.target)) focusFirst()
    }

    // iOS keyboards resize the visual viewport without necessarily changing 100dvh.
    const viewport = window.visualViewport
    const fitViewport = () => {
      overlay.style.setProperty('--bn-dialog-height', `${viewport?.height ?? innerHeight}px`)
      overlay.style.setProperty('--bn-dialog-top', `${viewport?.offsetTop ?? 0}px`)
    }
    fitViewport()
    viewport?.addEventListener('resize', fitViewport)
    viewport?.addEventListener('scroll', fitViewport)
    window.addEventListener('resize', fitViewport)
    document.addEventListener('keydown', onKey)
    document.addEventListener('focusin', onFocus)
    const initial = initialRef.current ?? controls()[0] ?? panel
    initial.focus({ preventScroll: true })

    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('focusin', onFocus)
      viewport?.removeEventListener('resize', fitViewport)
      viewport?.removeEventListener('scroll', fitViewport)
      window.removeEventListener('resize', fitViewport)
      overlay.style.removeProperty('--bn-dialog-height')
      overlay.style.removeProperty('--bn-dialog-top')
      siblings.forEach(({ element, inert }) => { element.inert = inert })
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousRootOverflow
      const target = previousFocus?.isConnected && previousFocus.getClientRects().length > 0
        ? previousFocus
        : document.querySelector<HTMLElement>('.bn-logo')
      target?.focus({ preventScroll: true })
    }
  }, [open, panelRef, initialRef, onClose, returnFocusRef])
}
