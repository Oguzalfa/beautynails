export const siteConfig = {
  brand: 'Beauty Nails',
  tagline: 'NAIL & BEAUTY STUDIO',
  locale: 'tr-TR',
  whatsappNumber: null as string | null,
  phone: null as string | null,
  address: null as string | null,
  instagramUrl: null as string | null,
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
    image: '/images/service-manikur.webp',
    atlas: { x: 0, y: 0 },
  },
  {
    id: 'ipek-kirpik',
    title: 'İpek Kirpik',
    description: 'Daha etkileyici bakışlar.',
    detail:
      'Bakışlarınıza derinlik katan, doğal ve dengeli kirpik uygulamaları.',
    image: '/images/service-kirpik.webp',
    atlas: { x: 627, y: 0 },
  },
  {
    id: 'kalici-makyaj',
    title: 'Kalıcı Makyaj',
    description: 'Doğal güzellik, her zaman.',
    detail:
      'Yüz hatlarınıza uyumlu, doğal görünümü destekleyen kalıcı makyaj yaklaşımı.',
    image: '/images/service-dudak.webp',
    atlas: { x: 0, y: 627 },
  },
  {
    id: 'kas-yuz',
    title: 'Kaş & Yüz',
    description: 'İncelikle tasarlanan bakım.',
    detail:
      'Kaş ve yüz hatlarını dengede tutan, incelikli bakım dokunuşları.',
    image: '/images/service-kas.webp',
    atlas: { x: 627, y: 627 },
  },
] as const

export const experienceHighlights = [
  {
    title: 'Kişisel ilgi',
    text: 'Her randevu, ihtiyaçlarınıza göre planlanır.',
  },
  {
    title: 'İncelikli tasarım',
    text: 'Detaylar, sizin stilinize göre şekillenir.',
  },
  {
    title: 'Özenli bakım',
    text: 'Konfor ve kalite, sürecin her adımında korunur.',
  },
] as const
