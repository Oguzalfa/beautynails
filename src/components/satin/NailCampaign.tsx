import { useId } from 'react'
import { siteConfig } from '../../config/site'
import type { Locale } from '../../locales'
import '../../styles/nail-campaign.css'
import { WhatsAppIcon } from './icons'
import { PhoneIcon } from '../ContactPanel'

type CampaignCopy = {
  label: string
  heading: string
  intro: string
  call: string
  sendModel: string
  message: (service: string) => string
  services: { nails: string; extensions: string }
  names: readonly [string, string, string, string]
  alts: readonly [string, string, string, string]
}

const copy: Record<Locale, CampaignCopy> = {
  tr: {
    label: 'Büyük Yılbaşı Kampanyası',
    heading: 'Yılbaşına Özel Nail Art Serisi',
    intro: 'Kırmızı French, fiyonklar ve küçük detaylar. Modelini seç; uygulama ve randevu için bizi ara.',
    call: 'Hemen Ara',
    sendModel: 'Modelini Gönder',
    message: (service) => `Merhaba, BeautyNails yılbaşı nail art serisi için bir model paylaşmak istiyorum. İlgilendiğim hizmet: ${service}. Uygulama ve randevu hakkında bilgi alabilir miyim?`,
    services: { nails: 'Nail art ve tırnak tasarımı', extensions: 'Protez tırnak' },
    names: ['Kırmızı French', 'Fiyonk & leopar', 'Beyaz & kırmızı', 'Pembe & kırmızı'],
    alts: ['Nude badem tırnaklarda beyaz puantiyeli kırmızı French uçlar', 'Leopar desenli tırnaklarda kırmızı fiyonk detayları', 'Beyaz kısa kare tırnaklarda kırmızı uğurböceği detayları', 'Pembe uzun badem tırnaklarda kırmızı uğurböceği detayları'],
  },
  en: {
    label: 'New Year Campaign',
    heading: 'The New Year Nail Art Collection',
    intro: 'Red French tips, bows and little details. Choose a look, then call us about the application and an appointment.',
    call: 'Call Now',
    sendModel: 'Send Your Design',
    message: (service) => `Hello, I would like to share a design for the BeautyNails New Year nail art collection. Service: ${service}. Could I ask about the application and an appointment?`,
    services: { nails: 'Nail art and nail design', extensions: 'Nail extensions' },
    names: ['Red French', 'Bows & leopard', 'White & red', 'Pink & red'],
    alts: ['Nude almond nails with red French tips and white dots', 'Leopard-print nails with red bow details', 'Short white square nails with red ladybird details', 'Long pink almond nails with red ladybird details'],
  },
  de: {
    label: 'Neujahrsaktion',
    heading: 'Die Nail-Art-Kollektion zum Jahreswechsel',
    intro: 'Rote French-Spitzen, Schleifen und kleine Details. Wählen Sie ein Design und rufen Sie uns für Informationen und einen Termin an.',
    call: 'Jetzt anrufen',
    sendModel: 'Design senden',
    message: (service) => `Hallo, ich möchte ein Design für die BeautyNails Nail-Art-Kollektion zum Jahreswechsel senden. Gewünschte Behandlung: ${service}. Kann ich Informationen zur Anwendung und zu einem Termin erhalten?`,
    services: { nails: 'Nail Art und Nageldesign', extensions: 'Nagelverlängerung' },
    names: ['Rote French-Spitzen', 'Schleifen & Leopard', 'Weiß & Rot', 'Rosa & Rot'],
    alts: ['Nudefarbene Mandelnägel mit roten French-Spitzen und weißen Punkten', 'Nägel mit Leopardenmuster und roten Schleifen', 'Kurze weiße eckige Nägel mit roten Marienkäfern', 'Lange rosa Mandelnägel mit roten Marienkäfern'],
  },
  ru: {
    label: 'Новогодняя акция',
    heading: 'Новогодняя коллекция нейл-арта',
    intro: 'Красный френч, банты и небольшие детали. Выберите дизайн и позвоните нам, чтобы обсудить процедуру и запись.',
    call: 'Позвонить',
    sendModel: 'Отправить дизайн',
    message: (service) => `Здравствуйте! Хочу отправить дизайн для новогодней коллекции нейл-арта BeautyNails. Интересующая услуга: ${service}. Можно узнать о процедуре и записи?`,
    services: { nails: 'Нейл-арт и дизайн ногтей', extensions: 'Наращивание ногтей' },
    names: ['Красный френч', 'Банты и леопард', 'Белый и красный', 'Розовый и красный'],
    alts: ['Нюдовые миндалевидные ногти с красным френчем в белый горошек', 'Леопардовый маникюр с красными бантами', 'Короткие белые квадратные ногти с красными божьими коровками', 'Длинные розовые миндалевидные ногти с красными божьими коровками'],
  },
  ar: {
    label: 'حملة رأس السنة',
    heading: 'مجموعة فن الأظافر لرأس السنة',
    intro: 'فرنش أحمر وفيونكات وتفاصيل صغيرة. اختاري التصميم واتصلي بنا للاستفسار عن التطبيق والموعد.',
    call: 'اتصلي الآن',
    sendModel: 'أرسلي تصميمك',
    message: (service) => `مرحبًا، أود إرسال تصميم من أجل مجموعة فن الأظافر لرأس السنة لدى BeautyNails. الخدمة: ${service}. هل يمكنني الاستفسار عن التطبيق والموعد؟`,
    services: { nails: 'فن وتصميم الأظافر', extensions: 'تمديد الأظافر' },
    names: ['فرنش أحمر', 'فيونكات ونقشة فهد', 'أبيض وأحمر', 'وردي وأحمر'],
    alts: ['أظافر لوزية بلون نيود وأطراف فرنش حمراء بنقاط بيضاء', 'أظافر بنقشة الفهد وتفاصيل فيونكات حمراء', 'أظافر بيضاء قصيرة مربعة مع تفاصيل دعسوقة حمراء', 'أظافر وردية طويلة لوزية مع تفاصيل دعسوقة حمراء'],
  },
  uz: {
    label: 'Yangi yil aksiyasi',
    heading: 'Yangi yil uchun nail art to‘plami',
    intro: 'Qizil French, bantlar va mayda detallar. Dizaynni tanlang, xizmat va qabul haqida bilish uchun qo‘ng‘iroq qiling.',
    call: 'Qo‘ng‘iroq qiling',
    sendModel: 'Dizayningizni yuboring',
    message: (service) => `Salom, BeautyNails Yangi yil nail art to‘plami uchun dizayn yubormoqchiman. Xizmat: ${service}. Jarayon va qabul haqida ma’lumot olsam bo‘ladimi?`,
    services: { nails: 'Nail art va tirnoq dizayni', extensions: 'Tirnoq uzaytirish' },
    names: ['Qizil French', 'Bant va leopard', 'Oq va qizil', 'Pushti va qizil'],
    alts: ['Oq nuqtali qizil French uchlari tushirilgan nude bodomsimon tirnoqlar', 'Qizil bantli leopard naqshli tirnoqlar', 'Qizil xonqizi detallari bor kalta oq kvadrat tirnoqlar', 'Qizil xonqizi detallari bor uzun pushti bodomsimon tirnoqlar'],
  },
  tk: {
    label: 'Täze ýyl kampaniýasy',
    heading: 'Täze ýyl üçin nail art toplumy',
    intro: 'Gyzyl French, bantlar we ownuk bezegler. Dizaýny saýlaň, hyzmat we wagt barada maglumat üçin bize jaň ediň.',
    call: 'Jaň ediň',
    sendModel: 'Dizaýnyňyzy iberiň',
    message: (service) => `Salam, BeautyNails Täze ýyl nail art toplumy üçin dizaýn ibermek isleýärin. Hyzmat: ${service}. Hyzmat we wagt barada maglumat alyp bilerinmi?`,
    services: { nails: 'Nail art we dyrnak dizaýny', extensions: 'Dyrnak uzaltmak' },
    names: ['Gyzyl French', 'Bant we gaplaň nagşy', 'Ak we gyzyl', 'Gülgüne we gyzyl'],
    alts: ['Ak nokatly gyzyl French uçlary bolan nude badam şekilli dyrnaklar', 'Gyzyl bantly gaplaň nagyşly dyrnaklar', 'Gyzyl tomzak bezegli gysga ak inedördül dyrnaklar', 'Gyzyl tomzak bezegli uzyn gülgüne badam şekilli dyrnaklar'],
  },
}

const photoIds = ['16', '09', '22', '23'] as const

export type NailCampaignProps = {
  locale: Locale
  serviceId?: string
  compact?: boolean
}

export function NailCampaign({ locale, serviceId, compact = false }: NailCampaignProps) {
  const headingId = useId()
  const text = copy[locale]
  const service = serviceId === 'protez-tirnak' ? text.services.extensions : text.services.nails
  const modelHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text.message(service))}`
  const placement = compact ? 'nail-campaign-compact' : 'nail-campaign'

  return (
    <section
      className={`nail-campaign${compact ? ' nail-campaign--compact' : ''}`}
      aria-labelledby={headingId}
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : undefined}
    >
      <div className="nail-campaign__inner">
        <div className="nail-campaign__copy">
          <p className="nail-campaign__label">{text.label}</p>
          <h2 id={headingId} className="nail-campaign__heading">{text.heading}</h2>
          <p className="nail-campaign__intro">{text.intro}</p>
          <div className="nail-campaign__actions">
            <a
              className="nail-campaign__call"
              href={`tel:+${siteConfig.whatsappNumber}`}
              data-contact-placement={`${placement}-call`}
            >
              <span>{text.call}<bdi>{siteConfig.phone}</bdi></span>
              <PhoneIcon />
            </a>
            <a
              className="nail-campaign__model"
              href={modelHref}
              target="_blank"
              rel="noopener noreferrer"
              data-contact-placement={`${placement}-model`}
            >
              <WhatsAppIcon /><span>{text.sendModel}</span>
            </a>
          </div>
        </div>
        <div className="nail-campaign__gallery">
          {photoIds.map((id, index) => (
            <figure key={id} className="nail-campaign__photo">
              <img
                src={`/images/satin/collection/nail-${id}-960.webp`}
                srcSet={`/images/satin/collection/nail-${id}-480.webp 480w, /images/satin/collection/nail-${id}-960.webp 960w`}
                sizes={compact ? '(min-width: 1024px) 180px, (min-width: 640px) 24vw, 44vw' : '(min-width: 1280px) 280px, (min-width: 768px) 25vw, 44vw'}
                width="960"
                height="1280"
                alt={text.alts[index]}
                loading="lazy"
                decoding="async"
              />
              <figcaption>{text.names[index]}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
