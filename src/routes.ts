import { contentPages, normalizeContentPath, type ContentPageData } from './components/satin/pages'
import { journalArticles, type JournalArticleId } from './components/satin/journal'
import en, { journalSummaries as journalEn } from './components/satin/localized-pages/en'
import de, { journalSummaries as journalDe } from './components/satin/localized-pages/de'
import ru, { journalSummaries as journalRu } from './components/satin/localized-pages/ru'
import ar, { journalSummaries as journalAr } from './components/satin/localized-pages/ar'
import uz, { journalSummaries as journalUz } from './components/satin/localized-pages/uz'
import tk, { journalSummaries as journalTk } from './components/satin/localized-pages/tk'
import { locales, type Locale } from './locales'

export type { Locale } from './locales'

type Translation = Pick<ContentPageData, 'path' | 'title' | 'description' | 'heading' | 'intro' | 'category' | 'sections'> & { imageAlt?: string }
type JournalSummary = { category: string; title: string; excerpt: string }
const translations: Record<Exclude<Locale, 'tr'>, Record<string, Translation>> = { en, de, ru, ar, uz, tk }
const journalTranslations: Record<Exclude<Locale, 'tr'>, Record<JournalArticleId, JournalSummary>> = {
  en: journalEn, de: journalDe, ru: journalRu, ar: journalAr, uz: journalUz, tk: journalTk,
}

type Route = { locale: Locale; path: string; sourcePath: string; page: ContentPageData | null }
const routes = new Map<string, Route>()
const localePages = {} as Record<Locale, readonly ContentPageData[]>

for (const locale of locales) {
  const home = locale === 'tr' ? '/' : `/${locale}/`
  routes.set(home, { locale, path: home, sourcePath: '/', page: null })
  localePages[locale] = contentPages.map((original) => {
    const translation = locale === 'tr' ? undefined : translations[locale][original.path]
    if (locale !== 'tr' && !translation) throw new Error(`Missing ${locale} translation for ${original.path}`)
    const page: ContentPageData = translation ? {
      ...original, ...translation,
      image: original.image ? { ...original.image, alt: translation.imageAlt ?? original.image.alt } : undefined,
    } : original
    if (routes.has(page.path)) throw new Error(`Duplicate page path ${page.path}`)
    routes.set(page.path, { locale, path: page.path, sourcePath: original.path, page })
    return page
  })
}

export const pagePaths = [...routes.keys()]

export function getRoute(path: string) {
  return routes.get(normalizeContentPath(path)) ?? null
}

export function pathForLocale(path: string, locale: Locale): string {
  const source = getRoute(path)?.sourcePath ?? '/'
  if (locale === 'tr') return source
  return source === '/' ? `/${locale}/` : translations[locale][source].path
}

export function getLocalizedPage(path: string, locale: Locale) {
  return getRoute(pathForLocale(path, locale))?.page ?? null
}

export function pagesForLocale(locale: Locale) {
  return localePages[locale]
}

export function journalForLocale(locale: Locale) {
  return journalArticles.map(({ id, category, title, intro }) => ({
    id, ...(locale === 'tr' ? { category, title, excerpt: intro } : journalTranslations[locale][id]),
  }))
}
