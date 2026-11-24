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
  draftReady: string
  directWhatsApp: string
  directMessage: (service?: string) => string
  optionalDetails: string
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
    draftReady: 'Mesaj taslağınız hazır. Açılmadıysa aşağıdaki düğmeyle WhatsApp’a geçin ve mesajı gönderin. Randevunuz işletmenin yanıtı ve onayıyla kesinleşir.',
    directWhatsApp: 'WhatsApp’tan fiyat ve saat sor',
    directMessage: (service) => `Merhaba, ${service ? `${service} için` : 'hizmetleriniz hakkında'} güncel fiyat ve uygun randevu saatlerini öğrenebilir miyim?`,
    optionalDetails: 'İsterseniz ayrıntılı talep hazırlayın',
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
    draftReady: 'Your message draft is ready. If it did not open, use the button below and send it in WhatsApp. Your appointment is confirmed only after the salon replies and agrees on a time.',
    directWhatsApp: 'Ask about prices and times on WhatsApp',
    directMessage: (service) => `Hello, could you share ${service ? `the current price and appointment options for ${service}` : 'your current prices and appointment options'}?`,
    optionalDetails: 'Optional: prepare a detailed request',
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
    draftReady: 'Ihr Nachrichtenentwurf ist bereit. Falls er nicht geöffnet wurde, nutzen Sie die Schaltfläche unten und senden Sie ihn in WhatsApp. Ihr Termin ist erst nach Rückmeldung und Bestätigung des Salons verbindlich.',
    directWhatsApp: 'Preise und Termine per WhatsApp anfragen',
    directMessage: (service) => `Hallo, könnten Sie mir ${service ? `den aktuellen Preis und freie Termine für ${service}` : 'Ihre aktuellen Preise und freie Termine'} mitteilen?`,
    optionalDetails: 'Optional: eine ausführliche Anfrage vorbereiten',
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
    draftReady: 'Черновик сообщения готов. Если он не открылся, нажмите кнопку ниже и отправьте его в WhatsApp. Запись подтверждается только после ответа и согласования времени с салоном.',
    directWhatsApp: 'Узнать цены и время в WhatsApp',
    directMessage: (service) => `Здравствуйте! Подскажите, пожалуйста, ${service ? `актуальную стоимость и свободное время для услуги «${service}»` : 'актуальные цены и свободное время для записи'}.`,
    optionalDetails: 'По желанию: подготовить подробный запрос',
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
    draftReady: 'مسودة رسالتك جاهزة. إذا لم تُفتح، استخدم الزر أدناه وأرسلها في واتساب. لا يتأكد الموعد إلا بعد رد الصالون والاتفاق على الوقت.',
    directWhatsApp: 'اسأل عن الأسعار والمواعيد عبر واتساب',
    directMessage: (service) => `مرحباً، هل يمكنني معرفة ${service ? `السعر الحالي والمواعيد المتاحة لخدمة ${service}` : 'الأسعار الحالية والمواعيد المتاحة'}؟`,
    optionalDetails: 'اختياري: إعداد طلب مفصّل',
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
    draftReady: 'Xabar qoralamasi tayyor. Agar ochilmagan bo‘lsa, quyidagi tugmani bosing va uni WhatsApp’da yuboring. Qabul vaqti salon javob berib, vaqtni tasdiqlaganidan keyingina belgilanadi.',
    directWhatsApp: 'Narx va vaqtni WhatsApp’da so‘rang',
    directMessage: (service) => `Assalomu alaykum, ${service ? `${service} uchun` : 'xizmatlaringiz bo‘yicha'} joriy narx va bo‘sh qabul vaqtlarini bilsam bo‘ladimi?`,
    optionalDetails: 'Ixtiyoriy: batafsil so‘rov tayyorlash',
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
    draftReady: 'Hatyň taslamasy taýýar. Açylmadyk bolsa, aşakdaky düwmä basyp, ony WhatsApp-da iberiň. Wagt diňe salon jogap berip, ony tassyklandan soň bellenilýär.',
    directWhatsApp: 'Baha we wagt barada WhatsApp-da soraň',
    directMessage: (service) => `Salam, ${service ? `${service} üçin` : 'hyzmatlaryňyz boýunça'} häzirki baha we boş wagtlar barada maglumat berip bilersiňizmi?`,
    optionalDetails: 'Islege görä: jikme-jik ýüz tutma taýýarlamak',
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
