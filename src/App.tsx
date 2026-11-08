import { useCallback, useState } from 'react'
import { ServiceDetail } from './components/ServiceDetail'
import { BookingPanel } from './components/BookingPanel'
import { SatinHome } from './components/satin/SatinHome'
import { ContentPage } from './components/satin/ContentPage'
import { getRoute } from './routes'

type Props = { initialPath?: string }

export default function App({ initialPath }: Props) {
  const route = getRoute(initialPath ?? (typeof window === 'undefined' ? '/' : window.location.pathname))
  const locale = route?.locale ?? 'tr'
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingService, setBookingService] = useState<string | null>(null)
  const [serviceId, setServiceId] = useState<string | null>(null)
  const openBooking = useCallback((service?: string) => {
    setBookingService(service ?? null)
    setBookingOpen(true)
  }, [])

  return (
    <>
      {route?.sourcePath === '/' ? (
        <SatinHome locale={locale} onOpenBooking={openBooking} onOpenService={setServiceId} />
      ) : (
        <ContentPage locale={locale} path={route?.path ?? '/'} page={route?.page ?? null} onBook={openBooking} />
      )}
      <div className="bn-page">
        <ServiceDetail locale={locale} serviceId={serviceId} onClose={() => setServiceId(null)} />
        <BookingPanel locale={locale} open={bookingOpen} initialService={bookingService} onClose={() => setBookingOpen(false)} />
      </div>
    </>
  )
}
