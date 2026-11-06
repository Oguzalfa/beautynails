import { useCallback, useState } from 'react'
import { ServiceDetail } from './components/ServiceDetail'
import { BookingPanel } from './components/BookingPanel'
import { SatinHome } from './components/satin/SatinHome'
import { ContentPage } from './components/satin/ContentPage'
import { getContentPage, normalizeContentPath } from './components/satin/pages'

type Props = { initialPath?: string }

export default function App({ initialPath }: Props) {
  const path = normalizeContentPath(initialPath ?? (typeof window === 'undefined' ? '/' : window.location.pathname))
  const page = getContentPage(path)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingService, setBookingService] = useState<string | null>(null)
  const [serviceId, setServiceId] = useState<string | null>(null)
  const openBooking = useCallback((service?: string) => {
    setBookingService(service ?? null)
    setBookingOpen(true)
  }, [])

  return (
    <>
      {path === '/' ? (
        <SatinHome onOpenBooking={openBooking} onOpenService={setServiceId} />
      ) : (
        <ContentPage page={page} onBook={openBooking} />
      )}
      <div className="bn-page">
        <ServiceDetail serviceId={serviceId} onClose={() => setServiceId(null)} />
        <BookingPanel open={bookingOpen} initialService={bookingService} onClose={() => setBookingOpen(false)} />
      </div>
    </>
  )
}
