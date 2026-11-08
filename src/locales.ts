export const locales = ['tr', 'en', 'de', 'ru', 'ar', 'uz', 'tk'] as const
export type Locale = (typeof locales)[number]

export const localeDetails = {
  tr: {
    name: 'Türkçe', selector: 'Dil seçin', og: 'tr_TR',
    title: 'BeautyNails | Tırnak Sanatı, İpek Kirpik ve Erkek Bakımı',
    description: 'BeautyNails’te tırnak sanatı, ipek kirpik, kalıcı makyaj ve erkek manikür-pedikür seçeneklerini keşfedin. Tasarım örnekleri, bakım notları ve randevu iletişimi.',
    imageAlt: 'BeautyNails tırnak ve güzellik stüdyosu',
  },
  en: {
    name: 'English', selector: 'Choose language', og: 'en_GB',
    title: 'BeautyNails | Nail Art, Lash Extensions & Men’s Grooming',
    description: 'Explore BeautyNails nail art, eyelash extensions, permanent makeup and men’s manicure and pedicure. Browse designs, read care notes and ask about an appointment.',
    imageAlt: 'BeautyNails nail and beauty studio',
  },
  de: {
    name: 'Deutsch', selector: 'Sprache wählen', og: 'de_DE',
    title: 'BeautyNails | Nageldesign, Wimpern und Herrenpflege',
    description: 'Entdecken Sie Nageldesign, Wimpernverlängerung, Permanent Make-up sowie Maniküre und Pediküre für Herren bei BeautyNails. Mit Designbeispielen, Pflegetipps und Terminanfrage.',
    imageAlt: 'BeautyNails Nagel- und Beautystudio',
  },
  ru: {
    name: 'Русский', selector: 'Выбрать язык', og: 'ru_RU',
    title: 'BeautyNails | Дизайн ногтей, ресницы и мужской уход',
    description: 'Дизайн ногтей, наращивание ресниц, перманентный макияж, мужской маникюр и педикюр в BeautyNails. Примеры работ, советы по выбору и запись на процедуры.',
    imageAlt: 'Студия маникюра и красоты BeautyNails',
  },
  ar: {
    name: 'العربية', selector: 'اختر اللغة', og: 'ar_SA',
    title: 'BeautyNails | تصميم الأظافر وتركيب الرموش والعناية للرجال',
    description: 'تعرّفي على تصميم الأظافر وتركيب الرموش والمكياج الدائم والعناية بأظافر اليدين والقدمين للرجال في BeautyNails. شاهدي نماذج الأعمال وأرسلي طلب موعد.',
    imageAlt: 'استوديو BeautyNails للأظافر والتجميل',
  },
  uz: {
    name: 'O‘zbekcha', selector: 'Tilni tanlang', og: 'uz_UZ',
    title: 'BeautyNails | Tirnoq dizayni, kipriklar va erkaklar parvarishi',
    description: 'BeautyNails’da tirnoq dizayni, kiprik uzaytirish, doimiy makiyaj hamda erkaklar manikyuri va pedikyuri bilan tanishing. Ish namunalarini ko‘ring va qabul uchun yoziling.',
    imageAlt: 'BeautyNails tirnoq va go‘zallik studiyasi',
  },
  tk: {
    name: 'Türkmençe', selector: 'Dil saýlaň', og: 'tk_TM',
    title: 'BeautyNails | Dyrnak dizaýny, kirpik we erkekler üçin ideg',
    description: 'BeautyNails-de dyrnak dizaýny, kirpik uzaltmak, hemişelik makiýaž hem-de erkekler üçin manikýur we pedikýur bilen tanyşyň. Iş nusgalaryna serediň we wagt soraň.',
    imageAlt: 'BeautyNails dyrnak we gözellik studiýasy',
  },
} satisfies Record<Locale, { name: string; selector: string; og: string; title: string; description: string; imageAlt: string }>

export const languageCookie = 'bn-language'
