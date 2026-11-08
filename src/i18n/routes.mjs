import services from '../content/services-seo.json' with { type: 'json' }
import journal from '../content/journal.json' with { type: 'json' }
import en from '../content/localized/en.json' with { type: 'json' }
import de from '../content/localized/de.json' with { type: 'json' }
import ar from '../content/localized/ar.json' with { type: 'json' }
import ru from '../content/localized/ru.json' with { type: 'json' }
import uz from '../content/localized/uz.json' with { type: 'json' }
import tk from '../content/localized/tk.json' with { type: 'json' }

export const locales = ['tr', 'en', 'de', 'ar', 'ru', 'uz', 'tk']
export const languageNames = {
  tr: 'Türkçe', en: 'English', de: 'Deutsch', ar: 'العربية',
  ru: 'Русский', uz: 'Oʻzbekcha', tk: 'Türkmençe',
}
export const languageLabel = {
  tr: 'Dil seçin', en: 'Choose language', de: 'Sprache auswählen', ar: 'اختر اللغة',
  ru: 'Выберите язык', uz: 'Tilni tanlang', tk: 'Dil saýlaň',
}
export const localeTags = { tr: 'tr-TR', en: 'en', de: 'de', ar: 'ar', ru: 'ru', uz: 'uz', tk: 'tk' }
export const ogLocales = { tr: 'tr_TR', en: 'en_US', de: 'de_DE', ar: 'ar_SA', ru: 'ru_RU', uz: 'uz_UZ', tk: 'tk_TM' }
export const localizedContent = { tr: { services, journal }, en, de, ar, ru, uz, tk }

const sections = {
  tr: { services: 'hizmetler', contact: 'iletisim', journal: 'bakim-rehberi' },
  en: { services: 'services', contact: 'contact', journal: 'journal' },
  de: { services: 'leistungen', contact: 'kontakt', journal: 'journal' },
  ar: { services: 'services', contact: 'contact', journal: 'journal' },
  ru: { services: 'uslugi', contact: 'kontakty', journal: 'zhurnal' },
  uz: { services: 'xizmatlar', contact: 'aloqa', journal: 'jurnal' },
  tk: { services: 'hyzmatlar', contact: 'habarlasmak', journal: 'zurnal' },
}

export function normalizeLocale(tag) {
  const language = tag?.toLowerCase().split(/[-_]/, 1)[0]
  return locales.includes(language) ? language : 'tr'
}

export function localeDir(locale) {
  return locale === 'ar' ? 'rtl' : 'ltr'
}

const paths = Object.fromEntries(locales.map(locale => {
  const root = locale === 'tr' ? '/' : `/${locale}/`
  const section = sections[locale]
  const content = localizedContent[locale]
  return [locale, new Map([
    ['/', root],
    ['/iletisim/', `${root}${section.contact}/`],
    ['/bakim-rehberi/', `${root}${section.journal}/`],
    ...content.services.map(item => [`/hizmetler/${item.slug}/`, `${root}${section.services}/${item.localizedSlug ?? item.slug}/`]),
    ...content.journal.map(item => [`/bakim-rehberi/${item.slug}/`, `${root}${section.journal}/${item.localizedSlug ?? item.slug}/`]),
  ])]
}))

export function pageHref(locale, turkishPath = '/') {
  const suffixIndex = turkishPath.search(/[?#]/)
  const pathname = suffixIndex < 0 ? turkishPath : turkishPath.slice(0, suffixIndex)
  const suffix = suffixIndex < 0 ? '' : turkishPath.slice(suffixIndex)
  return (paths[locale]?.get(pathname) ?? pathname) + suffix
}
