import type services from '../content/services-seo.json'
import type journal from '../content/journal.json'

export type Locale = 'tr' | 'en' | 'de' | 'ar' | 'ru' | 'uz' | 'tk'

export const locales: readonly Locale[]
export const languageNames: Record<Locale, string>
export const languageLabel: Record<Locale, string>
export const localeTags: Record<Locale, string>
export const ogLocales: Record<Locale, string>
export const localizedContent: Record<Locale, {
  services: (typeof services[number] & { localizedSlug?: string })[]
  journal: (typeof journal[number] & { localizedSlug?: string })[]
}>
export function normalizeLocale(tag?: string): Locale
export function localeDir(locale: Locale): 'ltr' | 'rtl'
export function pageHref(locale: Locale, turkishPath?: string): string
