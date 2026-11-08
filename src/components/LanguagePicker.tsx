import { languageLabel, languageNames, localeDir, locales, localeTags, pageHref } from '../i18n/routes.mjs'
import { useLocale } from '../i18n/LocaleContext'

export function LanguagePicker() {
  const { locale } = useLocale()
  return (
    <details className="sz-language">
      <summary className="sz-language__trigger" aria-label={languageLabel[locale]}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <ellipse cx="12" cy="12" rx="4" ry="9" />
          <path d="M3 12h18" />
        </svg>
        <bdi>{locale.toUpperCase()}</bdi>
      </summary>
      <ul className="sz-language__options">
        {locales.map(language => (
          <li key={language}>
            <a href={pageHref(language)} lang={language} dir={localeDir(language)}
              hrefLang={localeTags[language]} data-site-language={language}
              aria-current={language === locale ? 'page' : undefined}>
              {languageNames[language]}
            </a>
          </li>
        ))}
      </ul>
    </details>
  )
}
