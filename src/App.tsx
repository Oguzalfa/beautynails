import { useCallback, useState } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Services } from './components/Services'
import { Booking } from './components/Booking'
import { Footer } from './components/Footer'
import { ServiceDetail } from './components/ServiceDetail'
import { BookingPanel } from './components/BookingPanel'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [serviceId, setServiceId] = useState<string | null>(null)

  const openBooking = useCallback(() => {
    setBookingOpen(true)
    setMenuOpen(false)
  }, [])

  return (
    <div className="bn-page" id="top">
      <Header
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onCloseMenu={() => setMenuOpen(false)}
        onOpenBooking={openBooking}
      />
      <main>
        <Hero onOpenBooking={openBooking} />
        <Services onOpenService={setServiceId} />
        <Booking onOpenBooking={openBooking} />
      </main>
      <Footer />
      <ServiceDetail serviceId={serviceId} onClose={() => setServiceId(null)} />
      <BookingPanel open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  )
}
