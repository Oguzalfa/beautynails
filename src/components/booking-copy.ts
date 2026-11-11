import type { services } from '../config/site'
import type { Locale } from '../locales'

export const serviceOptions = [
  'Tırnak Sanatı',
  'Protez Tırnak',
  'İpek Kirpik',
  'Kalıcı Makyaj',
  'Kaş & Yüz',
  'Erkek Manikür & Pedikür',
] as const

type ServiceOption = typeof serviceOptions[number]
type ServiceId = typeof services[number]['id']

type BookingCopy = {
  close: string
  title: string
  providerIntro: string
  whatsappIntro: (phone: string) => string
  opened: string
  blocked: string
  openDraft: string
  services: string
  serviceNames: Record<ServiceOption, string>
  name: string
  phone: string
  time: string
  note: string
  submit: string
  errors: Record<'name' | 'phone' | 'service', string>
  detailsNote: string
}

export const bookingCopy: Record<Locale, BookingCopy> = {
  tr: {
    close: 'Kapat',
    title: 'Randevu talebi',
    providerIntro: 'Sizi mevcut randevu akışına yönlendireceğiz.',
    whatsappIntro: (phone) => `Randevu talebi ${phone} numaralı WhatsApp hattına hazırlanır. Mesajı siz gönderirsiniz.`,
    opened: 'WhatsApp taslağı açıldı. Mesaj gönderilmeden randevu iletilmez.',
    blocked: 'Tarayıcı yeni pencereyi engelledi. Aşağıdaki düğme aynı WhatsApp taslağını açar.',
    openDraft: 'WhatsApp taslağını aç',
    services: 'Hizmet',
    serviceNames: {
      'Tırnak Sanatı': 'Tırnak Sanatı',
      'Protez Tırnak': 'Protez Tırnak',
      'İpek Kirpik': 'İpek Kirpik',
      'Kalıcı Makyaj': 'Kalıcı Makyaj',
      'Kaş & Yüz': 'Kaş & Yüz',
      'Erkek Manikür & Pedikür': 'Erkek Manikür & Pedikür',
    },
    name: 'Ad Soyad',
    phone: 'Telefon',
    time: 'Saat',
    note: 'Not (isteğe bağlı)',
    submit: 'WhatsApp taslağını hazırla',
    errors: {
      name: 'Lütfen adınızı yazın.',
      phone: 'Lütfen telefon numaranızı yazın.',
      service: 'Lütfen en az bir hizmet seçin.',
    },
    detailsNote: 'Süre, ücret ve ürün detayları randevu görüşmesinde netleştirilir.',
  },
  en: {
    close: 'Close',
    title: 'Appointment request',
    providerIntro: 'We’ll take you to the booking page.',
    whatsappIntro: (phone) => `We’ll prepare a WhatsApp draft for ${phone}. You can review it before sending.`,
    opened: 'Your WhatsApp draft is open. Send the message to submit your request.',
    blocked: 'Your browser blocked the new window. Use the button below to open your WhatsApp draft.',
    openDraft: 'Open WhatsApp draft',
    services: 'Services',
    serviceNames: {
      'Tırnak Sanatı': 'Nail Art',
      'Protez Tırnak': 'Nail Extensions',
      'İpek Kirpik': 'Eyelash Extensions',
      'Kalıcı Makyaj': 'Permanent Makeup',
      'Kaş & Yüz': 'Brow & Face Care',
      'Erkek Manikür & Pedikür': 'Men’s Manicure & Pedicure',
    },
    name: 'Full name',
    phone: 'Phone number',
    time: 'Preferred time',
    note: 'Note (optional)',
    submit: 'Prepare WhatsApp draft',
    errors: {
      name: 'Please enter your name.',
      phone: 'Please enter your phone number.',
      service: 'Please select at least one service.',
    },
    detailsNote: 'We’ll confirm the duration, price and products when we discuss your appointment.',
  },
  de: {
    close: 'Schließen',
    title: 'Terminanfrage',
    providerIntro: 'Wir leiten Sie zur Terminbuchung weiter.',
    whatsappIntro: (phone) => `Wir erstellen einen WhatsApp-Entwurf für ${phone}. Sie können ihn vor dem Senden prüfen.`,
    opened: 'Ihr WhatsApp-Entwurf ist geöffnet. Senden Sie die Nachricht, um Ihren Termin anzufragen.',
    blocked: 'Ihr Browser hat das neue Fenster blockiert. Über die Schaltfläche unten können Sie Ihren WhatsApp-Entwurf öffnen.',
    openDraft: 'WhatsApp-Entwurf öffnen',
    services: 'Leistungen',
    serviceNames: {
      'Tırnak Sanatı': 'Nageldesign',
      'Protez Tırnak': 'Nagelverlängerung',
      'İpek Kirpik': 'Wimpernverlängerung',
      'Kalıcı Makyaj': 'Permanent Make-up',
      'Kaş & Yüz': 'Brauen- und Gesichtspflege',
      'Erkek Manikür & Pedikür': 'Maniküre & Pediküre für Herren',
    },
    name: 'Vor- und Nachname',
    phone: 'Telefonnummer',
    time: 'Gewünschte Uhrzeit',
    note: 'Anmerkung (optional)',
    submit: 'WhatsApp-Entwurf erstellen',
    errors: {
      name: 'Bitte geben Sie Ihren Namen ein.',
      phone: 'Bitte geben Sie Ihre Telefonnummer ein.',
      service: 'Bitte wählen Sie mindestens eine Leistung aus.',
    },
    detailsNote: 'Dauer, Preis und verwendete Produkte besprechen wir bei Ihrer Terminanfrage.',
  },
  ru: {
    close: 'Закрыть',
    title: 'Запрос на запись',
    providerIntro: 'Мы перенаправим вас на страницу записи.',
    whatsappIntro: (phone) => `Мы подготовим черновик сообщения в WhatsApp для номера ${phone}. Вы сможете проверить его перед отправкой.`,
    opened: 'Черновик открыт в WhatsApp. Отправьте сообщение, чтобы передать запрос на запись.',
    blocked: 'Браузер заблокировал новое окно. Нажмите кнопку ниже, чтобы открыть черновик в WhatsApp.',
    openDraft: 'Открыть черновик в WhatsApp',
    services: 'Услуги',
    serviceNames: {
      'Tırnak Sanatı': 'Дизайн ногтей',
      'Protez Tırnak': 'Наращивание ногтей',
      'İpek Kirpik': 'Наращивание ресниц',
      'Kalıcı Makyaj': 'Перманентный макияж',
      'Kaş & Yüz': 'Уход за бровями и лицом',
      'Erkek Manikür & Pedikür': 'Мужской маникюр и педикюр',
    },
    name: 'Имя и фамилия',
    phone: 'Номер телефона',
    time: 'Желаемое время',
    note: 'Комментарий (необязательно)',
    submit: 'Подготовить черновик в WhatsApp',
    errors: {
      name: 'Пожалуйста, укажите своё имя.',
      phone: 'Пожалуйста, укажите номер телефона.',
      service: 'Пожалуйста, выберите хотя бы одну услугу.',
    },
    detailsNote: 'Продолжительность, стоимость и используемые средства уточняются при записи.',
  },
  ar: {
    close: 'إغلاق',
    title: 'طلب موعد',
    providerIntro: 'سننقلك إلى صفحة حجز المواعيد.',
    whatsappIntro: (phone) => `سنجهّز مسودة رسالة واتساب للرقم ${phone}. يمكنك مراجعتها قبل الإرسال.`,
    opened: 'فُتحت المسودة في واتساب. أرسل الرسالة لتقديم طلب الموعد.',
    blocked: 'منع المتصفح فتح نافذة جديدة. استخدم الزر أدناه لفتح المسودة في واتساب.',
    openDraft: 'فتح المسودة',
    services: 'الخدمات',
    serviceNames: {
      'Tırnak Sanatı': 'تصميم الأظافر',
      'Protez Tırnak': 'تمديد الأظافر',
      'İpek Kirpik': 'تركيب الرموش',
      'Kalıcı Makyaj': 'المكياج الدائم',
      'Kaş & Yüz': 'العناية بالحواجب والوجه',
      'Erkek Manikür & Pedikür': 'مانيكير وباديكير للرجال',
    },
    name: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    time: 'الوقت المفضّل',
    note: 'ملاحظة (اختياري)',
    submit: 'إعداد مسودة واتساب',
    errors: {
      name: 'يرجى إدخال اسمك.',
      phone: 'يرجى إدخال رقم هاتفك.',
      service: 'يرجى اختيار خدمة واحدة على الأقل.',
    },
    detailsNote: 'نوضّح المدة والتكلفة والمنتجات المستخدمة عند مناقشة موعدك.',
  },
  uz: {
    close: 'Yopish',
    title: 'Qabulga yozilish',
    providerIntro: 'Sizni qabulga yozilish sahifasiga yo‘naltiramiz.',
    whatsappIntro: (phone) => `${phone} raqami uchun WhatsApp xabari qoralamasini tayyorlaymiz. Uni yuborishdan oldin tekshirishingiz mumkin.`,
    opened: 'Qoralama WhatsApp’da ochildi. So‘rovni yuborish uchun xabarni jo‘nating.',
    blocked: 'Brauzer yangi oynani blokladi. WhatsApp qoralamasini ochish uchun quyidagi tugmani bosing.',
    openDraft: 'Qoralamani ochish',
    services: 'Xizmatlar',
    serviceNames: {
      'Tırnak Sanatı': 'Tirnoq dizayni',
      'Protez Tırnak': 'Tirnoq uzaytirish',
      'İpek Kirpik': 'Kipriklarni uzaytirish',
      'Kalıcı Makyaj': 'Doimiy makiyaj',
      'Kaş & Yüz': 'Qosh va yuz parvarishi',
      'Erkek Manikür & Pedikür': 'Erkaklar manikyuri va pedikyuri',
    },
    name: 'Ism va familiya',
    phone: 'Telefon raqami',
    time: 'Sizga qulay vaqt',
    note: 'Izoh (ixtiyoriy)',
    submit: 'Qoralama tayyorlash',
    errors: {
      name: 'Ismingizni kiriting.',
      phone: 'Telefon raqamingizni kiriting.',
      service: 'Kamida bitta xizmatni tanlang.',
    },
    detailsNote: 'Davomiyligi, narxi va ishlatiladigan vositalarni qabulga yozilish paytida aniqlashtiramiz.',
  },
  tk: {
    close: 'Ýapmak',
    title: 'Wagt bellemek',
    providerIntro: 'Sizi wagt belleme sahypasyna ugrukdyrarys.',
    whatsappIntro: (phone) => `WhatsApp-da ${phone} belgisi üçin hat taslamasyny taýýarlarys. Ony ibermezden öň barlap bilersiňiz.`,
    opened: 'Hatyň taslamasy WhatsApp-da açyldy. Ýüz tutmaňyzy ugratmak üçin haty iberiň.',
    blocked: 'Brauzer täze penjiräni açmaga päsgel berdi. WhatsApp-daky taslamany açmak üçin aşakdaky düwmä basyň.',
    openDraft: 'Taslamany açmak',
    services: 'Hyzmatlar',
    serviceNames: {
      'Tırnak Sanatı': 'Dyrnak bezegi',
      'Protez Tırnak': 'Dyrnak uzaltmak',
      'İpek Kirpik': 'Kirpikleri uzaltmak',
      'Kalıcı Makyaj': 'Hemişelik makiýaž',
      'Kaş & Yüz': 'Gaşlara we ýüze ideg',
      'Erkek Manikür & Pedikür': 'Erkekler üçin manikýur we pedikýur',
    },
    name: 'Adyňyz we familiýaňyz',
    phone: 'Telefon belgisi',
    time: 'Isleýän wagtyňyz',
    note: 'Bellik (islege görä)',
    submit: 'Taslamany taýýarlamak',
    errors: {
      name: 'Adyňyzy ýazyň.',
      phone: 'Telefon belgiňizi ýazyň.',
      service: 'Iň bolmanda bir hyzmaty saýlaň.',
    },
    detailsNote: 'Hyzmatyň dowamlylygy, bahasy we ulanylýan serişdeler wagt bellenende anyklanylýar.',
  },
}

type ServiceCopy = { title: string; detail: string }

export const serviceDetailCopy: Record<Exclude<Locale, 'tr'>, Record<ServiceId, ServiceCopy>> = {
  en: {
    'tirnak-sanati': {
      title: bookingCopy.en.serviceNames['Tırnak Sanatı'],
      detail: 'Thoughtful nail care and modern designs tailored to your preferences.',
    },
    'ipek-kirpik': {
      title: bookingCopy.en.serviceNames['İpek Kirpik'],
      detail: 'Natural-looking lash extensions that bring out your eyes.',
    },
    'kalici-makyaj': {
      title: bookingCopy.en.serviceNames['Kalıcı Makyaj'],
      detail: 'Permanent makeup tailored to your features for a natural-looking finish.',
    },
    'kas-yuz': {
      title: bookingCopy.en.serviceNames['Kaş & Yüz'],
      detail: 'Careful brow and face treatments that complement your features.',
    },
  },
  de: {
    'tirnak-sanati': {
      title: bookingCopy.de.serviceNames['Tırnak Sanatı'],
      detail: 'Sorgfältige Nagelpflege und modernes Design nach Ihren Wünschen.',
    },
    'ipek-kirpik': {
      title: bookingCopy.de.serviceNames['İpek Kirpik'],
      detail: 'Natürlich wirkende Wimpernverlängerung, die Ihre Augen betont.',
    },
    'kalici-makyaj': {
      title: bookingCopy.de.serviceNames['Kalıcı Makyaj'],
      detail: 'Permanent Make-up, das auf Ihre Gesichtszüge und ein natürliches Ergebnis abgestimmt ist.',
    },
    'kas-yuz': {
      title: bookingCopy.de.serviceNames['Kaş & Yüz'],
      detail: 'Sorgfältige Brauen- und Gesichtspflege, abgestimmt auf Ihre Gesichtszüge.',
    },
  },
  ru: {
    'tirnak-sanati': {
      title: bookingCopy.ru.serviceNames['Tırnak Sanatı'],
      detail: 'Аккуратный уход за ногтями и современный дизайн с учётом ваших предпочтений.',
    },
    'ipek-kirpik': {
      title: bookingCopy.ru.serviceNames['İpek Kirpik'],
      detail: 'Наращивание ресниц с естественным эффектом, которое подчёркивает взгляд.',
    },
    'kalici-makyaj': {
      title: bookingCopy.ru.serviceNames['Kalıcı Makyaj'],
      detail: 'Перманентный макияж с учётом черт вашего лица для естественного результата.',
    },
    'kas-yuz': {
      title: bookingCopy.ru.serviceNames['Kaş & Yüz'],
      detail: 'Деликатный уход за бровями и лицом с учётом ваших черт.',
    },
  },
  ar: {
    'tirnak-sanati': {
      title: bookingCopy.ar.serviceNames['Tırnak Sanatı'],
      detail: 'عناية دقيقة بالأظافر وتصاميم عصرية تناسب ذوقك.',
    },
    'ipek-kirpik': {
      title: bookingCopy.ar.serviceNames['İpek Kirpik'],
      detail: 'تركيب رموش بمظهر طبيعي يبرز جمال عينيك.',
    },
    'kalici-makyaj': {
      title: bookingCopy.ar.serviceNames['Kalıcı Makyaj'],
      detail: 'مكياج دائم ينسجم مع ملامح وجهك ويمنحك مظهراً طبيعياً.',
    },
    'kas-yuz': {
      title: bookingCopy.ar.serviceNames['Kaş & Yüz'],
      detail: 'عناية بالحواجب والوجه تراعي ملامحك.',
    },
  },
  uz: {
    'tirnak-sanati': {
      title: bookingCopy.uz.serviceNames['Tırnak Sanatı'],
      detail: 'Did va xohishingizga mos tirnoq parvarishi va zamonaviy dizaynlar.',
    },
    'ipek-kirpik': {
      title: bookingCopy.uz.serviceNames['İpek Kirpik'],
      detail: 'Ko‘zlaringizni ajratib ko‘rsatadigan, tabiiy ko‘rinishdagi uzaytirilgan kipriklar.',
    },
    'kalici-makyaj': {
      title: bookingCopy.uz.serviceNames['Kalıcı Makyaj'],
      detail: 'Yuz chizgilaringizga mos, tabiiy ko‘rinish beradigan doimiy makiyaj.',
    },
    'kas-yuz': {
      title: bookingCopy.uz.serviceNames['Kaş & Yüz'],
      detail: 'Yuz chizgilaringizni hisobga olgan holda qosh va yuzga nozik parvarish.',
    },
  },
  tk: {
    'tirnak-sanati': {
      title: bookingCopy.tk.serviceNames['Tırnak Sanatı'],
      detail: 'Islegiňize laýyk dyrnak idegi we döwrebap bezegler.',
    },
    'ipek-kirpik': {
      title: bookingCopy.tk.serviceNames['İpek Kirpik'],
      detail: 'Gözüňiziň gözelligini nygtaýan tebigy görnüşli uzyn kirpikler.',
    },
    'kalici-makyaj': {
      title: bookingCopy.tk.serviceNames['Kalıcı Makyaj'],
      detail: 'Ýüz keşbiňize laýyk, tebigy görnüşli hemişelik makiýaž.',
    },
    'kas-yuz': {
      title: bookingCopy.tk.serviceNames['Kaş & Yüz'],
      detail: 'Ýüz keşbiňizi göz öňünde tutup, gaşlara we ýüze ünsli ideg.',
    },
  },
}
