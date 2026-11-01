type Props = {
  x: number
  y: number
  title: string
  className?: string
}

const ATLAS = 1024
const DESIGN_CELL = 627
const CELL = ATLAS / 2

/** Crops one cell from the 2×2 service atlas via SVG viewBox. */
export function ServiceAtlas({ x, y, title, className }: Props) {
  const vx = (x / DESIGN_CELL) * CELL
  const vy = (y / DESIGN_CELL) * CELL
  return (
    <svg
      className={className}
      viewBox={`${vx} ${vy} ${CELL} ${CELL}`}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid slice"
      style={{ overflow: 'hidden' }}
    >
      <image
        href="/images/service-photo-atlas-2x2.jpg"
        width={ATLAS}
        height={ATLAS}
        preserveAspectRatio="xMidYMid slice"
      />
    </svg>
  )
}
