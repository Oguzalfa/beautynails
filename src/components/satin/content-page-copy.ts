import type { Locale } from '../../locales'

type ContentPageCopy = {
  skip: string
  brandHome: string
  pageSections: string
  breadcrumb: string
  home: string
  services: string
  journal: string
  articles: string
  book: string
  contactPrompt: string
  readService: string
  readArticle: string
  otherServices: string
  otherArticles: string
  notFound: string
  notFoundDescription: string
  returnHome: string
}

export const contentPageCopy: Record<Locale, ContentPageCopy> = {
  tr: {
    skip: 'İçeriğe geç',
    brandHome: 'BeautyNails ana sayfa',
    pageSections: 'Sayfa bölümleri',
    breadcrumb: 'İçerik yolu',
    home: 'Ana sayfa',
    services: 'Hizmetler',
    journal: 'Bakım notları',
    articles: 'Yazılar',
    book: 'Randevu Al',
    contactPrompt: 'Tercihlerinizi birlikte netleştirelim.',
    readService: 'Hizmeti incele',
    readArticle: 'Yazıyı oku',
    otherServices: 'Diğer hizmetler',
    otherArticles: 'Diğer bakım notları',
    notFound: 'Sayfa bulunamadı',
    notFoundDescription: 'Bu adres artık kullanılmıyor veya yanlış yazılmış olabilir. BeautyNails ana sayfasından hizmetlere ve yazılara ulaşabilirsiniz.',
    returnHome: 'Ana sayfaya dön',
  },
  en: {
    skip: 'Skip to content',
    brandHome: 'BeautyNails home page',
    pageSections: 'Page sections',
    breadcrumb: 'Breadcrumb',
    home: 'Home',
    services: 'Services',
    journal: 'Beauty journal',
    articles: 'Journal',
    book: 'Book an appointment',
    contactPrompt: 'Let’s talk through the look you have in mind.',
    readService: 'Explore the service',
    readArticle: 'Read the article',
    otherServices: 'Other services',
    otherArticles: 'More from the journal',
    notFound: 'Page not found',
    notFoundDescription: 'This address may have changed or been entered incorrectly. You can find our services and journal on the BeautyNails home page.',
    returnHome: 'Back to home',
  },
  de: {
    skip: 'Zum Inhalt springen',
    brandHome: 'BeautyNails Startseite',
    pageSections: 'Seitenbereiche',
    breadcrumb: 'Brotkrümelnavigation',
    home: 'Startseite',
    services: 'Leistungen',
    journal: 'Pflegetipps',
    articles: 'Beiträge',
    book: 'Termin buchen',
    contactPrompt: 'Lassen Sie uns Ihre Wünsche gemeinsam besprechen.',
    readService: 'Leistung ansehen',
    readArticle: 'Beitrag lesen',
    otherServices: 'Weitere Leistungen',
    otherArticles: 'Weitere Pflegetipps',
    notFound: 'Seite nicht gefunden',
    notFoundDescription: 'Diese Adresse hat sich möglicherweise geändert oder wurde falsch eingegeben. Unsere Leistungen und Beiträge finden Sie auf der BeautyNails-Startseite.',
    returnHome: 'Zurück zur Startseite',
  },
  ru: {
    skip: 'Перейти к содержанию',
    brandHome: 'BeautyNails — главная страница',
    pageSections: 'Разделы страницы',
    breadcrumb: 'Навигационная цепочка',
    home: 'Главная',
    services: 'Услуги',
    journal: 'Советы по уходу',
    articles: 'Статьи',
    book: 'Записаться',
    contactPrompt: 'Давайте обсудим, какой результат вам нравится.',
    readService: 'Подробнее об услуге',
    readArticle: 'Читать статью',
    otherServices: 'Другие услуги',
    otherArticles: 'Другие советы по уходу',
    notFound: 'Страница не найдена',
    notFoundDescription: 'Возможно, адрес изменился или был введён с ошибкой. Услуги и статьи можно найти на главной странице BeautyNails.',
    returnHome: 'Вернуться на главную',
  },
  ar: {
    skip: 'انتقل إلى المحتوى',
    brandHome: 'الصفحة الرئيسية لـ BeautyNails',
    pageSections: 'أقسام الصفحة',
    breadcrumb: 'مسار التنقل',
    home: 'الرئيسية',
    services: 'الخدمات',
    journal: 'نصائح العناية',
    articles: 'المقالات',
    book: 'احجز موعدًا',
    contactPrompt: 'لنتحدث عن الإطلالة التي تفضلها.',
    readService: 'تفاصيل الخدمة',
    readArticle: 'اقرأ المقال',
    otherServices: 'خدمات أخرى',
    otherArticles: 'المزيد من نصائح العناية',
    notFound: 'الصفحة غير موجودة',
    notFoundDescription: 'ربما تغير هذا العنوان أو أُدخل بشكل غير صحيح. يمكنك العثور على الخدمات والمقالات في الصفحة الرئيسية لـ BeautyNails.',
    returnHome: 'العودة إلى الرئيسية',
  },
  uz: {
    skip: 'Asosiy mazmunga o‘tish',
    brandHome: 'BeautyNails bosh sahifasi',
    pageSections: 'Sahifa bo‘limlari',
    breadcrumb: 'Sahifa yo‘li',
    home: 'Bosh sahifa',
    services: 'Xizmatlar',
    journal: 'Parvarish bo‘yicha maslahatlar',
    articles: 'Maqolalar',
    book: 'Qabulga yozilish',
    contactPrompt: 'Sizga yoqadigan uslubni birga muhokama qilaylik.',
    readService: 'Xizmat haqida',
    readArticle: 'Maqolani o‘qish',
    otherServices: 'Boshqa xizmatlar',
    otherArticles: 'Parvarish bo‘yicha boshqa maslahatlar',
    notFound: 'Sahifa topilmadi',
    notFoundDescription: 'Bu manzil o‘zgargan yoki xato kiritilgan bo‘lishi mumkin. Xizmatlar va maqolalarni BeautyNails bosh sahifasidan topasiz.',
    returnHome: 'Bosh sahifaga qaytish',
  },
  tk: {
    skip: 'Esasy mazmuna geçiň',
    brandHome: 'BeautyNails baş sahypasy',
    pageSections: 'Sahypanyň bölümleri',
    breadcrumb: 'Sahypa ýoly',
    home: 'Baş sahypa',
    services: 'Hyzmatlar',
    journal: 'Ideg boýunça maslahatlar',
    articles: 'Makalalar',
    book: 'Wagt bellemek',
    contactPrompt: 'Göwnüňize ýaraýan görnüşi bilelikde ara alyp maslahatlaşalyň.',
    readService: 'Hyzmat barada',
    readArticle: 'Makalany okaň',
    otherServices: 'Beýleki hyzmatlar',
    otherArticles: 'Ideg boýunça beýleki maslahatlar',
    notFound: 'Sahypa tapylmady',
    notFoundDescription: 'Bu salgy üýtgän ýa-da nädogry girizilen bolup biler. Hyzmatlary we makalalary BeautyNails-iň baş sahypasynda tapyp bilersiňiz.',
    returnHome: 'Baş sahypa dolanmak',
  },
}
