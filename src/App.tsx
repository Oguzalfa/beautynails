import { useCallback, useState } from 'react'
import { ServiceDetail } from './components/ServiceDetail'
import { BookingPanel } from './components/BookingPanel'
import { SatinHome } from './components/satin/SatinHome'

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingService, setBookingService] = useState<string | null>(null)
  const [serviceId, setServiceId] = useState<string | null>(null)
  const openBooking = useCallback((service?: string) => {
    setBookingService(service ?? null)
    setBookingOpen(true)
  }, [])

  return (
    <>
      <SatinHome onOpenBooking={openBooking} onOpenService={setServiceId} />
      <div className="bn-page">
        <ServiceDetail serviceId={serviceId} onClose={() => setServiceId(null)} />
        <BookingPanel open={bookingOpen} initialService={bookingService} onClose={() => setBookingOpen(false)} />
      </div>
    </>
  )
}
