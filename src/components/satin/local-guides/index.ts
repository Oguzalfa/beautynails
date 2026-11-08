import type { Locale } from '../../../locales'
import { getContentPage, type ContentPageData } from '../pages'
import ar from './ar'
import de from './de'
import en from './en'
import ru from './ru'
import tk from './tk'
import tr from './tr'
import uz from './uz'

const guideIds = ['nails', 'lashes'] as const
type GuideId = (typeof guideIds)[number]
type GuideCopy = Pick<ContentPageData, 'title' | 'description' | 'heading' | 'intro' | 'category' | 'sections'> & {
  slug: string
  imageAlt: string
}
const guides: Record<Locale, Record<GuideId, GuideCopy>> = { ar, de, en, ru, tk, tr, uz }
const serviceIds = { nails: 'tirnak-sanati', lashes: 'ipek-kirpik' } as const

export const guideListHeading: Record<Locale, string> = {
  tr: 'Maltepe randevu rehberleri',
  en: 'Maltepe appointment guides',
  de: 'Terminratgeber für Maltepe',
  ru: 'Как записаться из Малтепе',
  ar: 'أدلة حجز المواعيد من مالتيبه',
  uz: 'Maltepedan qabulga yozilish qo‘llanmalari',
  tk: 'Maltepe üçin wagt bellemek gollanmalary',
}

export function makeLocalGuidePages(locale: Locale, journalPath: string) {
  return guideIds.map((id) => {
    const { slug, imageAlt, ...copy } = guides[locale][id]
    const serviceId = serviceIds[id]
    const image = getContentPage(`/hizmetler/${serviceId}/`)?.image
    const page: ContentPageData = {
      ...copy,
      path: `${journalPath}${slug}/`,
      kind: 'article',
      serviceId,
      image: image && { ...image, alt: imageAlt, sizes: '(min-width: 1024px) 480px, 90vw' },
    }
    return { page, sourcePath: `/yazilar/${guides.tr[id].slug}/` }
  })
}
