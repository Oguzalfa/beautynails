type Props = { onOpenBooking: () => void }

export function MobileBar({ onOpenBooking }: Props) {
  return (
    <div className="bn-mobile-bar" role="region" aria-label="Hızlı işlemler">
      <a className="bn-button bn-button--secondary" href="#iletisim">Danışın</a>
      <button type="button" className="bn-button bn-button--pink" onClick={onOpenBooking}>
        Randevu Al
      </button>
    </div>
  )
}
