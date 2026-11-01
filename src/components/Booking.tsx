type Props = {
  onOpenBooking: () => void
}

export function Booking({ onOpenBooking }: Props) {
  return (
    <section id="iletisim" className="booking section">
      <div className="booking__panel">
        <p className="eyebrow">RANDEVU</p>
        <h2 className="section-title">Kendinize özel bir zaman ayırın.</h2>
        <p>Size uygun bakımı birlikte planlayalım.</p>
        <button type="button" className="btn btn-pink" onClick={onOpenBooking}>
          Randevu Al
        </button>
      </div>
    </section>
  )
}
