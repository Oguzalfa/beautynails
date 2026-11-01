import { useCallback, useState } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Services } from './components/Services'
import { Experience } from './components/Experience'
import { Works } from './components/Works'
import { Booking } from './components/Booking'
import { Footer } from './components/Footer'
import { MobileBar } from './components/MobileBar'
import { ServiceDetail } from './components/ServiceDetail'
import { BookingPanel } from './components/BookingPanel'
import { detectWebGL } from './lib/webgl'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [serviceId, setServiceId] = useState<string | null>(null)
  const [webglOk, setWebglOk] = useState(() =>
    typeof window === 'undefined' ? true : detectWebGL(),
  )

  const openBooking = useCallback(() => {
    setBookingOpen(true)
    setMenuOpen(false)
  }, [])

  const onWebglLost = useCallback(() => {
    setWebglOk(false)
  }, [])

  return (
    <div className="page">
      <Header
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        onCloseMenu={() => setMenuOpen(false)}
        onOpenBooking={openBooking}
      />
      <main>
        <Hero
          onOpenBooking={openBooking}
          webglOk={webglOk}
          onWebglLost={onWebglLost}
        />
        <Services onOpenService={setServiceId} />
        <Experience />
        <Works />
        <Booking onOpenBooking={openBooking} />
      </main>
      <Footer />
      <MobileBar onOpenBooking={openBooking} />
      <ServiceDetail serviceId={serviceId} onClose={() => setServiceId(null)} />
      <BookingPanel open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  )
}
