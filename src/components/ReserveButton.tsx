import { useEffect, useRef } from 'react'
import { ArrowUpRight, Diamond } from './icons'

type Props = {
  children: string
  size?: 'sm' | 'lg'
  className?: string
  onClick: () => void
}

export function ReserveButton({ children, size = 'lg', className, onClick }: Props) {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) return
    const sync = () => node.toggleAttribute('data-paused', document.hidden)
    const observer = new IntersectionObserver(([entry]) => {
      node.toggleAttribute('data-live', entry.isIntersecting && !document.hidden)
    }, { rootMargin: '40px' })
    observer.observe(node)
    document.addEventListener('visibilitychange', sync)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return (
    <button
      ref={ref}
      type="button"
      className={`bn-button bn-button--solid bn-cta bn-cta--${size}${className ? ` ${className}` : ''}`}
      onClick={onClick}
    >
      <Diamond className="bn-cta__gem" motion={false} />
      <span className="bn-cta__label">{children}</span>
      <span className="bn-cta__orb" aria-hidden="true">
        <ArrowUpRight />
      </span>
      <span className="bn-cta__sheen" aria-hidden="true" />
    </button>
  )
}
