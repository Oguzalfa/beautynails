import { languageCookie, localeDetails, locales, type Locale } from '../locales'
import { pathForLocale } from '../routes'

type Props = { locale: Locale; path: string }

export function LanguageSelector({ locale, path }: Props) {
  return (
    <details className="language-selector">
      <summary aria-label={`${localeDetails[locale].selector} · ${localeDetails[locale].name}`}>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" />
        </svg>
        <span>{locale.toUpperCase()}</span>
      </summary>
      <ul>
        {locales.map((choice) => {
          const target = pathForLocale(path, choice)
          return (
            <li key={choice}>
              <a
                href={target === '/' ? '/?lang=tr' : target}
                hrefLang={choice}
                lang={choice}
                dir={choice === 'ar' ? 'rtl' : 'ltr'}
                aria-current={choice === locale ? 'page' : undefined}
                onClick={() => {
                  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
                  document.cookie = `${languageCookie}=${choice}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
                }}
              >
                {localeDetails[choice].name}
              </a>
            </li>
          )
        })}
      </ul>
    </details>
  )
}
