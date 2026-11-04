import { useCallback, useRef, useState } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Services } from './components/Services'
import { Booking } from './components/Booking'
import { Footer } from './components/Footer'
import { ServiceDetail } from './components/ServiceDetail'
import { BookingPanel } from './components/BookingPanel'
import { AtelierMobile } from './components/atelier/AtelierMobile'
import { BeautyGallery } from './components/editorial/BeautyGallery'
import { BeautyJournal } from './components/editorial/BeautyJournal'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [serviceId, setServiceId] = useState<string | null>(null)
  const returnFocusRef = useRef<HTMLElement>(null)

  const openBooking = useCallback(() => {
    setBookingOpen(true)
    setMenuOpen(false)
  }, [])

  return (
    <div className="bn-page" id="top" onClickCapture={(event) => {
      const trigger = event.target instanceof Element ? event.target.closest<HTMLElement>('button,a') : null
      if (trigger && !trigger.closest('.bn-modal')) returnFocusRef.current = trigger
    }}>
      <Header
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onCloseMenu={() => setMenuOpen(false)}
        onOpenBooking={openBooking}
      />
      <main>
        <Hero onOpenBooking={openBooking} />
        <Services onOpenService={setServiceId} />
        <BeautyGallery variant="desktop" />
        <BeautyJournal variant="desktop" />
        <Booking onOpenBooking={openBooking} />
        <AtelierMobile onOpenBooking={openBooking} onOpenService={setServiceId} />
      </main>
      <Footer />
      <ServiceDetail serviceId={serviceId} returnFocusRef={returnFocusRef} onClose={() => setServiceId(null)} />
      <BookingPanel open={bookingOpen} returnFocusRef={returnFocusRef} onClose={() => setBookingOpen(false)} />
    </div>
  )
}
