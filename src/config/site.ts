export const siteConfig = {
  brand: 'Şazi Beauty',
  wordmark: 'şazi beauty',
  tagline: 'NAIL & BEAUTY STUDIO',
  locale: 'tr-TR',
  whatsappNumber: '905011281808',
  phone: '0501 128 18 08',
  address: null as string | null,
  instagramUrl: 'https://www.instagram.com/sazibeauty/',
  bookingProviderUrl: null as string | null,
  workingHours: null as string | null,
  realPortfolioApproved: false,
  servicePricesVerified: false,
} as const

export const navLinks = [
  { href: '#deneyim', label: 'Deneyim' },
  { href: '#hizmetler', label: 'Hizmetler' },
  { href: '#calismalarimiz', label: 'Çalışmalarımız' },
  { href: '#iletisim', label: 'İletişim' },
] as const

export const services = [
  {
    id: 'tirnak-sanati',
    title: 'Tırnak Sanatı',
    description: 'Zarif, modern, size özel.',
    detail:
      'Kişisel tercihinize göre şekillenen, özenli ve modern tırnak bakımı.',
    image: '/images/fx/nails-macro.webp',
    workCaption: 'Zarif dokunuşlar',
    atlas: { x: 0, y: 0 },
  },
  {
    id: 'ipek-kirpik',
    title: 'İpek Kirpik',
    description: 'Daha etkileyici bakışlar.',
    detail:
      'Bakışlarınıza derinlik katan, doğal ve dengeli kirpik uygulamaları.',
    image: '/images/fx/lashes-macro.webp',
    workCaption: 'Daha etkileyici bakışlar',
    atlas: { x: 512, y: 0 },
  },
  {
    id: 'kalici-makyaj',
    title: 'Kalıcı Makyaj',
    description: 'Doğal güzellik, her zaman.',
    detail:
      'Yüz hatlarınıza uyumlu, doğal görünümü destekleyen kalıcı makyaj yaklaşımı.',
    image: '/images/fx/lips-macro.webp',
    workCaption: 'Kalıcı zarafet',
    atlas: { x: 0, y: 512 },
  },
  {
    id: 'kas-yuz',
    title: 'Kaş & Yüz',
    description: 'İncelikle tasarlanan bakım.',
    detail:
      'Kaş ve yüz hatlarını dengede tutan, incelikli bakım dokunuşları.',
    image: '/images/bn/service-brows.webp',
    workCaption: 'Dengeli hatlar',
    atlas: { x: 512, y: 512 },
  },
] as const

export const experienceHighlights = [
  {
    title: 'Kişisel ilgi',
    text: 'İhtiyaçlarınıza özel, size odaklı yaklaşım.',
    icon: 'user',
  },
  {
    title: 'İncelikli tasarım',
    text: 'Doğal güzelliğinizi ön plana çıkaran detaylar.',
    icon: 'diamond',
  },
  {
    title: 'Özenli bakım',
    text: 'Kalıcı, sağlıklı ve göz alıcı sonuçlar.',
    icon: 'heart',
  },
] as const
