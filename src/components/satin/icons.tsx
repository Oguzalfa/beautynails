import type { ReactNode } from 'react'

type IconProps = { className?: string }

function Svg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg className={className} viewBox="0 0 28 24" width="28" height="24" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M2 12h22" {...stroke} />
      <path d="M16.5 5.5 23.5 12l-7 6.5" {...stroke} />
    </Svg>
  )
}

export function MenuIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3 8h22M3 16h22" {...stroke} />
    </Svg>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M7 5.5 21 18.5M21 5.5 7 18.5" {...stroke} />
    </Svg>
  )
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <img
      className={className}
      src="/icons/whatsapp-mark.svg"
      width="28"
      height="28"
      alt=""
      aria-hidden="true"
      decoding="async"
    />
  )
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="5" y="3.5" width="18" height="17" rx="4" {...stroke} />
      <circle cx="14" cy="12" r="3.4" {...stroke} />
      <circle cx="19.2" cy="7.4" r="0.8" fill="currentColor" stroke="none" />
    </Svg>
  )
}
