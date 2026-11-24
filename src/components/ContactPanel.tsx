import { siteConfig } from '../config/site'
import type { Locale } from '../locales'
import { WhatsAppIcon } from './satin/icons'

type Copy = { call: string; directions: string; visit: string; intro: string; model: string; profile: string; location: string; quick: string; message: string }
export const contactCopy: Record<Locale, Copy> = {
  tr: { call: 'Hemen Ara', directions: 'Yol Tarifi Al', visit: 'Maltepe’de buluşalım.', intro: 'Modelinizi, uygulama detaylarını ve uygun randevu saatini telefonla konuşalım.', model: 'WhatsApp’tan Model Gönder', profile: 'Google Haritalar’da İncele', location: 'Konum', quick: 'Hızlı iletişim', message: 'Merhaba, BeautyNails’te model seçenekleri ve randevu hakkında bilgi almak istiyorum.' },
  en: { call: 'Call Now', directions: 'Get Directions', visit: 'Visit us in Maltepe.', intro: 'Call to discuss your design, treatment details and appointment options.', model: 'Send a Design on WhatsApp', profile: 'View on Google Maps', location: 'Directions', quick: 'Quick contact', message: 'Hello, I would like to ask BeautyNails about nail designs and an appointment.' },
  de: { call: 'Jetzt anrufen', directions: 'Route planen', visit: 'Besuchen Sie uns in Maltepe.', intro: 'Besprechen Sie Design, Behandlung und mögliche Termine telefonisch mit uns.', model: 'Design per WhatsApp senden', profile: 'Auf Google Maps ansehen', location: 'Anfahrt', quick: 'Schnellkontakt', message: 'Hallo, ich möchte BeautyNails nach Nageldesigns und einem Termin fragen.' },
  ru: { call: 'Позвонить', directions: 'Построить маршрут', visit: 'Ждём вас в Малтепе.', intro: 'Позвоните, чтобы обсудить дизайн, процедуру и время записи.', model: 'Отправить дизайн в WhatsApp', profile: 'Открыть Google Карты', location: 'Маршрут', quick: 'Быстрая связь', message: 'Здравствуйте! Хочу узнать о дизайне ногтей и записи в BeautyNails.' },
  ar: { call: 'اتصلي الآن', directions: 'الاتجاهات', visit: 'زورينا في مالتيبه.', intro: 'اتصلي لمناقشة التصميم وتفاصيل الخدمة ومواعيد الحجز.', model: 'أرسلي التصميم عبر واتساب', profile: 'عرض على خرائط Google', location: 'الموقع', quick: 'تواصل سريع', message: 'مرحباً، أود الاستفسار عن تصاميم الأظافر وحجز موعد في BeautyNails.' },
  uz: { call: 'Qo‘ng‘iroq qiling', directions: 'Yo‘l ko‘rsatish', visit: 'Maltepeda uchrashamiz.', intro: 'Dizayn, xizmat tafsilotlari va qabul vaqtini telefon orqali muhokama qilaylik.', model: 'WhatsApp’da model yuboring', profile: 'Google Xaritalarda ko‘rish', location: 'Manzil', quick: 'Tezkor aloqa', message: 'Salom, BeautyNails tirnoq dizaynlari va qabul vaqti haqida ma’lumot olmoqchiman.' },
  tk: { call: 'Jaň ediň', directions: 'Ýol görkezme', visit: 'Maltepede duşuşalyň.', intro: 'Dizaýny, hyzmatyň jikme-jikliklerini we kabul ediş wagtyny telefon arkaly maslahatlaşalyň.', model: 'WhatsApp arkaly nusga iberiň', profile: 'Google Kartalarda görüň', location: 'Salgy', quick: 'Çalt aragatnaşyk', message: 'Salam, BeautyNails dyrnak dizaýnlary we kabul ediş wagty barada maglumat almak isleýärin.' },
}

export function PhoneIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m7 3 3 5-2.4 2.2a14 14 0 0 0 6.2 6.2L16 14l5 3-1 4C10 22 2 14 3 4z" strokeLinejoin="round" /></svg>
}

function PinIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.3" /></svg>
}

export function ContactPanel({ locale }: { locale: Locale }) {
  const copy = contactCopy[locale]
  const whatsapp = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(copy.message)}`
  return (
    <section className="studio-contact" id="iletisim" aria-labelledby="studio-contact-title">
      <div className="content-width studio-contact__inner">
        <div className="studio-contact__address">
          <p className="studio-contact__eyebrow">Feyzullah · Maltepe</p>
          <h2 id="studio-contact-title">{copy.visit}</h2>
          <address>{siteConfig.address}</address>
          <div className="studio-contact__map-links">
            <a href={siteConfig.directionsUrl} target="_blank" rel="noopener noreferrer" data-contact-placement="studio-card" data-contact-action="directions"><PinIcon />{copy.directions}</a>
            <a href={siteConfig.mapsUrl} target="_blank" rel="noopener noreferrer" data-contact-placement="studio-profile" data-contact-action="directions">{copy.profile}</a>
          </div>
        </div>
        <div className="studio-contact__call">
          <p>{copy.intro}</p>
          <a className="studio-contact__phone" href={`tel:+${siteConfig.whatsappNumber}`} data-contact-placement="studio-card"><PhoneIcon /><bdi>{siteConfig.phone}</bdi></a>
          <a className="studio-contact__whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer" data-contact-placement="studio-card"><WhatsAppIcon />{copy.model}</a>
        </div>
      </div>
    </section>
  )
}

export function MobileContactBar({ locale, hidden = false }: { locale: Locale; hidden?: boolean }) {
  const copy = contactCopy[locale]
  return (
    <nav className="mobile-contact" aria-label={copy.quick} hidden={hidden} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <a className="mobile-contact__call" href={`tel:+${siteConfig.whatsappNumber}`} data-contact-placement="mobile-bar"><PhoneIcon /><span>{copy.call}</span></a>
      <a href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(copy.message)}`} target="_blank" rel="noopener noreferrer" data-contact-placement="mobile-bar"><WhatsAppIcon /><span>WhatsApp</span></a>
      <a href={siteConfig.directionsUrl} target="_blank" rel="noopener noreferrer" data-contact-placement="mobile-bar" data-contact-action="directions"><PinIcon /><span>{copy.location}</span></a>
    </nav>
  )
}
