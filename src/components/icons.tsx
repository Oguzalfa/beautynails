import { useEffect, useId, useRef, type ReactNode, type RefObject } from 'react'

type Kind = 'diamond' | 'lotus' | 'heart' | 'sparkle' | 'leaf' | 'lashes' | 'lips' | 'clock'

type GlassProps = {
  className?: string
  motion?: boolean
}

function useLiveIcon(ref: RefObject<SVGSVGElement | null>, motion: boolean) {
  useEffect(() => {
    if (!motion) return
    const node = ref.current
    if (!node) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) return
    const sync = () => node.toggleAttribute('data-paused', document.hidden)
    const observer = new IntersectionObserver(([entry]) => {
      node.toggleAttribute('data-live', entry.isIntersecting && !document.hidden)
    }, { rootMargin: '60px' })
    observer.observe(node)
    document.addEventListener('visibilitychange', sync)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [motion, ref])
}

function GlassIcon({
  kind,
  className,
  motion = true,
  children,
}: GlassProps & { kind: Kind; children: (id: string) => ReactNode }) {
  const ref = useRef<SVGSVGElement>(null)
  const id = useId().replace(/:/g, '')
  useLiveIcon(ref, motion)

  return (
    <svg
      ref={ref}
      className={`bn-glass bn-glass--${kind}${className ? ` ${className}` : ''}`}
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="20%" y1="0%" x2="84%" y2="100%">
          <stop offset="0%" stopColor="#FF9BC4" />
          <stop offset="36%" stopColor="#FF0874" />
          <stop offset="100%" stopColor="#BE0054" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="48%" stopColor="#fff" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="32%" cy="28%" r="68%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.72" />
          <stop offset="42%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {children(id)}
    </svg>
  )
}

function Glint({ id, clip }: { id: string; clip: string }) {
  return (
    <g clipPath={`url(#${id}-${clip})`}>
      <rect className="bn-glass__glint" x="-28" y="2" width="22" height="60" fill={`url(#${id}-shine)`} stroke="none" />
    </g>
  )
}

export function Diamond({ className, motion = true }: GlassProps) {
  const shape = 'M32 6.5 53 25.2 32 57.5 11 25.2Z'
  return (
    <GlassIcon kind="diamond" className={className} motion={motion}>
      {(id) => (
        <>
          <clipPath id={`${id}-gem`}>
            <path d={shape} />
          </clipPath>
          <g className="bn-glass__motion">
            <path d={shape} fill={`url(#${id}-body)`} stroke="#090909" strokeWidth="3.2" strokeLinejoin="round" />
            <path d={shape} fill={`url(#${id}-glow)`} stroke="none" />
            <path d="M11 25.2h42M32 6.5 22.2 25.2 32 57.5 41.8 25.2Z" fill="none" stroke="#fff" strokeOpacity="0.42" strokeWidth="1.3" />
            <Glint id={id} clip="gem" />
          </g>
        </>
      )}
    </GlassIcon>
  )
}

export function Lotus({ className, motion = true }: GlassProps) {
  const shape = 'M32 8c4.2 9 6.2 18 0 40-6.2-22-4.2-31 0-40Zm0 22c-7 1-16-1-16 8 0 8 8 12 16 8 8 4 16 0 16-8 0-9-9-7-16-8Z'
  return (
    <GlassIcon kind="lotus" className={className} motion={motion}>
      {(id) => (
        <>
          <clipPath id={`${id}-gem`}>
            <path d="M32 8c6 10 8 20 0 42-8-22-6-32 0-42Zm-1 24C22 30 12 30 13 40c1 9 12 12 18 6 6 6 17 3 18-6 1-10-9-10-18-10Z" />
          </clipPath>
          <g className="bn-glass__motion">
            <path d="M20 36c-8-2-10 6-6 12 5 4 14 2 16-4-6-2-8-6-10-8Z" fill={`url(#${id}-body)`} stroke="#090909" strokeWidth="2.6" strokeLinejoin="round" />
            <path d="M44 36c8-2 10 6 6 12-5 4-14 2-16-4 6-2 8-6 10-8Z" fill={`url(#${id}-body)`} stroke="#090909" strokeWidth="2.6" strokeLinejoin="round" />
            <path d="M32 7c7 11 8 22 0 43-8-21-7-32 0-43Z" fill={`url(#${id}-body)`} stroke="#090909" strokeWidth="2.8" strokeLinejoin="round" />
            <path d={shape} fill={`url(#${id}-glow)`} stroke="none" />
            <path d="M32 12c2 8 2 16 0 28" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round" />
            <Glint id={id} clip="gem" />
          </g>
        </>
      )}
    </GlassIcon>
  )
}

export function Heart({ className, motion = true }: GlassProps) {
  const shape = 'M32 54C16 42 8 32 12 22c3.2-8 11-8 16-2 1.6 2 3 4 4 4s2.4-2 4-4c5-6 12.8-6 16 2 4 10-4 20-20 32Z'
  return (
    <GlassIcon kind="heart" className={className} motion={motion}>
      {(id) => (
        <>
          <clipPath id={`${id}-gem`}>
            <path d={shape} />
          </clipPath>
          <g className="bn-glass__motion">
            <path d={shape} fill={`url(#${id}-body)`} stroke="#090909" strokeWidth="3.1" strokeLinejoin="round" />
            <path d={shape} fill={`url(#${id}-glow)`} stroke="none" />
            <path d="M18 24c3-5 8-6 11-2" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.6" strokeLinecap="round" />
            <Glint id={id} clip="gem" />
          </g>
        </>
      )}
    </GlassIcon>
  )
}

export function Sparkles({ className, motion = true }: GlassProps) {
  const shape = 'M32 5 38.2 25.8 59 32 38.2 38.2 32 59 25.8 38.2 5 32 25.8 25.8Z'
  return (
    <GlassIcon kind="sparkle" className={className} motion={motion}>
      {(id) => (
        <>
          <clipPath id={`${id}-gem`}>
            <path d={shape} />
          </clipPath>
          <g className="bn-glass__motion">
            <path d={shape} fill={`url(#${id}-body)`} stroke="#090909" strokeWidth="3" strokeLinejoin="round" />
            <path d={shape} fill={`url(#${id}-glow)`} stroke="none" />
            <path d="M32 14 35 29 32 32 29 29Z" fill="#fff" fillOpacity="0.55" stroke="none" />
            <Glint id={id} clip="gem" />
          </g>
        </>
      )}
    </GlassIcon>
  )
}

export function Leaf({ className, motion = true }: GlassProps) {
  const shape = 'M18 50C8 34 14 14 46 10c2 16-2 32-16 40-4 2-9 2-12 0Z'
  return (
    <GlassIcon kind="leaf" className={className} motion={motion}>
      {(id) => (
        <>
          <clipPath id={`${id}-gem`}>
            <path d={shape} />
          </clipPath>
          <g className="bn-glass__motion">
            <path d={shape} fill={`url(#${id}-body)`} stroke="#090909" strokeWidth="3" strokeLinejoin="round" />
            <path d="M16 50c10-12 18-22 30-34" fill="none" stroke="#090909" strokeWidth="2.4" strokeLinecap="round" />
            <path d={shape} fill={`url(#${id}-glow)`} stroke="none" />
            <Glint id={id} clip="gem" />
          </g>
        </>
      )}
    </GlassIcon>
  )
}

export function Lashes({ className, motion = true }: GlassProps) {
  return (
    <GlassIcon kind="lashes" className={className} motion={motion}>
      {(id) => (
        <>
          <clipPath id={`${id}-gem`}>
            <path d="M8 24c8 16 40 16 48 0-6 10-14 14-24 14S14 34 8 24Z" />
          </clipPath>
          <g className="bn-glass__motion">
            <path d="M9 29c8 16 38 16 46 0-1 3-2 5-4 6C42 46 22 46 13 35c-2-1-3-3-4-6Z" fill={`url(#${id}-body)`} stroke="#090909" strokeWidth="3" strokeLinejoin="round" />
            <path d="M16 34 13 47M26 39 25 52M38 39 39 52M48 34 51 47" fill="none" stroke="#090909" strokeWidth="3.6" strokeLinecap="round" />
            <path d="M16 34 13 47M26 39 25 52M38 39 39 52M48 34 51 47" fill="none" stroke={`url(#${id}-body)`} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M18 31c6 6 22 6 28 0" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" />
            <Glint id={id} clip="gem" />
          </g>
        </>
      )}
    </GlassIcon>
  )
}

export function Lips({ className, motion = true }: GlassProps) {
  const shape = 'M8 30c6-8 12-8 18-2 2-6 8-8 12-2 6-6 12-6 18 2-6 4-10 4-16 6-2 6-8 8-14 6-6-2-12-2-18-6 6-2 10-2 16-6Z'
  return (
    <GlassIcon kind="lips" className={className} motion={motion}>
      {(id) => (
        <>
          <clipPath id={`${id}-gem`}>
            <path d="M10 31c5-6 11-7 16-2 2-5 8-7 12-2 5-5 11-5 16 2-2 2-6 3-10 6-3 2-7 4-12 4s-9-2-12-4c-4-3-8-4-10-4Z" />
          </clipPath>
          <g className="bn-glass__motion">
            <path d="M10 31c6-7 12-8 16-3 3-6 9-7 13-2 6-6 12-5 16 2-5 3-9 4-13 7-4 3-8 4-13 4-5-3-9-4-13-6 5-2 8-2 10-2Z" fill={`url(#${id}-body)`} stroke="#090909" strokeWidth="3" strokeLinejoin="round" />
            <path d="M14 32c8 2 28 2 36 0" fill="none" stroke="#090909" strokeWidth="1.6" strokeLinecap="round" />
            <path d={shape} fill={`url(#${id}-glow)`} stroke="none" />
            <Glint id={id} clip="gem" />
          </g>
        </>
      )}
    </GlassIcon>
  )
}

export function Clock({ className, motion = true }: GlassProps) {
  return (
    <GlassIcon kind="clock" className={className} motion={motion}>
      {(id) => (
        <>
          <clipPath id={`${id}-gem`}>
            <circle cx="32" cy="32" r="22" />
          </clipPath>
          <g className="bn-glass__motion">
            <circle cx="32" cy="32" r="22" fill={`url(#${id}-body)`} stroke="#090909" strokeWidth="3.4" />
            <circle cx="32" cy="32" r="22" fill={`url(#${id}-glow)`} stroke="none" />
            <g className="bn-glass__hand">
              <path d="M32 32 V16" stroke="#090909" strokeWidth="2.6" strokeLinecap="round" />
            </g>
            <path d="M32 32 43 38" stroke="#090909" strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="32" cy="32" r="2.2" fill="#090909" stroke="none" />
            <Glint id={id} clip="gem" />
          </g>
        </>
      )}
    </GlassIcon>
  )
}

export function ArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
