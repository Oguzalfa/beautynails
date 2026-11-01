type Props = {
  onOpenBooking: () => void
}

export function MobileBar({ onOpenBooking }: Props) {
  return (
    <div className="mobile-bar" role="region" aria-label="Hızlı işlemler">
      <a className="btn btn-secondary" href="#iletisim">
        Danışın
      </a>
      <button type="button" className="btn btn-pink" onClick={onOpenBooking}>
        Randevu Al
      </button>
    </div>
  )
}
