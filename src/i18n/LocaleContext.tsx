import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { localizedContent, locales, pageHref } from './routes.mjs'
import type { Locale } from './routes.mjs'
import en from './ui-en.json'
import de from './ui-de.json'
import ar from './ui-ar.json'
import ru from './ui-ru.json'
import uz from './ui-uz.json'
import tk from './ui-tk.json'

const dictionaries: Record<Locale, Readonly<Record<string, string>>> = { tr: {}, en, de, ar, ru, uz, tk }

function localeValue(locale: Locale) {
  return {
    locale,
    journal: localizedContent[locale].journal,
    t: (source: string) => Object.hasOwn(dictionaries[locale], source) ? dictionaries[locale][source] : source,
    href: (path: string) => pageHref(locale, path),
  }
}

const values = new Map(locales.map(locale => [locale, localeValue(locale)]))
const LocaleContext = createContext(localeValue('tr'))

export function LocaleProvider({ locale, children }: { locale: Locale, children: ReactNode }) {
  return <LocaleContext.Provider value={values.get(locale)!}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  return useContext(LocaleContext)
}
