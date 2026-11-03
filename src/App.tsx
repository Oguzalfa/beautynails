import { useCallback, useState } from 'react'
import { ServiceDetail } from './components/ServiceDetail'
import { BookingPanel } from './components/BookingPanel'
import { SatinHome } from './components/satin/SatinHome'

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [serviceId, setServiceId] = useState<string | null>(null)
  const openBooking = useCallback(() => setBookingOpen(true), [])

  return (
    <>
      <SatinHome onOpenBooking={openBooking} onOpenService={setServiceId} />
      <div className="bn-page">
        <ServiceDetail serviceId={serviceId} onClose={() => setServiceId(null)} />
        <BookingPanel open={bookingOpen} onClose={() => setBookingOpen(false)} />
      </div>
    </>
  )
}
