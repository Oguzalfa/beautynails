import { useCallback, useEffect, useRef, useState } from 'react'
import { initSaziMotion } from './motion/sazi-motion.js'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Services } from './components/Services'
import { Booking } from './components/Booking'
import { Footer } from './components/Footer'
import { ServiceDetail } from './components/ServiceDetail'
import { BookingPanel } from './components/BookingPanel'
import { AtelierMobile } from './components/atelier/AtelierMobile'

export default function App() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [serviceId, setServiceId] = useState<string | null>(null)

  const openBooking = useCallback(() => {
    setBookingOpen(true)
    setMenuOpen(false)
  }, [])

  useEffect(() => {
    const root = pageRef.current
    if (!root) return
    const motion = initSaziMotion(root)
    return () => motion.destroy()
  }, [])

  return (
    <div className="bn-page" id="top" data-sazi-motion="" ref={pageRef}>
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
        <AtelierMobile onOpenBooking={openBooking} onOpenService={setServiceId} />
      </main>
      <Footer />
      <ServiceDetail serviceId={serviceId} onClose={() => setServiceId(null)} />
      <BookingPanel open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  )
}
