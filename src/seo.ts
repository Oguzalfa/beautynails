import { siteConfig } from './config/site'
import { contentPageCopy } from './components/satin/content-page-copy'
import { localeDetails, locales } from './locales'
import { getRoute, pagesForLocale, pathForLocale } from './routes'

export function getSeo(pathname: string) {
  const route = getRoute(pathname)
  const page = route?.page
  const locale = route?.locale ?? 'tr'
  const localeMeta = localeDetails[locale]
  const copy = contentPageCopy[locale]
  const valid = route !== null
  const canonical = route ? `${siteConfig.url}${route.path}` : undefined
  const title = page?.title ?? (valid ? localeMeta.title : `${copy.notFound} | BeautyNails`)
  const description = page?.description ?? (valid ? localeMeta.description : copy.notFoundDescription)
  const alternates = route ? [
    ...locales.map((language) => ({ language, url: siteConfig.url + pathForLocale(route.path, language) })),
    { language: 'x-default', url: siteConfig.url + route.sourcePath },
  ] : []
  const image = `${siteConfig.url}${page?.image?.src ?? '/images/satin/hero-desktop-960.webp'}`
  const org = { '@type': 'Organization', '@id': `${siteConfig.url}/#organization`, name: siteConfig.brand,
    url: `${siteConfig.url}/`, telephone: `+${siteConfig.whatsappNumber}`,
    ...(siteConfig.instagramUrl ? { sameAs: [siteConfig.instagramUrl] } : {}) }
  const graph: Record<string, unknown>[] = valid ? [org,
    { '@type': 'WebSite', '@id': `${siteConfig.url}/#website`, url: `${siteConfig.url}/`, name: siteConfig.brand,
      inLanguage: locales, publisher: { '@id': org['@id'] } },
    { '@type': page?.kind.endsWith('index') ? 'CollectionPage' : 'WebPage', '@id': `${canonical}#webpage`,
      url: canonical, name: title, description, inLanguage: locale, isPartOf: { '@id': `${siteConfig.url}/#website` } },
  ] : []
  if (page) {
    const crumbs = [{ name: copy.home, item: siteConfig.url + pathForLocale('/', locale) }]
    if (page.kind === 'article') crumbs.push({ name: copy.journal, item: siteConfig.url + pathForLocale('/yazilar/', locale) })
    if (page.kind === 'service') crumbs.push({ name: copy.services, item: siteConfig.url + pathForLocale('/hizmetler/', locale) })
    crumbs.push({ name: page.heading, item: canonical! })
    graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, index) => ({ '@type': 'ListItem', position: index + 1, ...c })) })
    if (page.kind === 'article') graph.push({ '@type': 'Article', '@id': `${canonical}#article`, headline: page.heading,
      description, inLanguage: locale, mainEntityOfPage: { '@id': `${canonical}#webpage` }, image: [image],
      ...(page.serviceId ? { about: { '@type': 'Place', name: 'Maltepe' } } : {}),
      author: { '@id': org['@id'] }, publisher: { '@id': org['@id'] } })
    if (page.kind === 'service') graph.push({ '@type': 'Service', '@id': `${canonical}#service`, name: page.heading,
      serviceType: page.heading, description, url: canonical, provider: { '@id': org['@id'] } })
    if (page.kind.endsWith('index')) graph.push({ '@type': 'ItemList', itemListElement: pagesForLocale(locale)
      .filter((p) => p.kind === (page.kind === 'service-index' ? 'service' : 'article'))
      .map((p, index) => ({ '@type': 'ListItem', position: index + 1, name: p.heading, url: `${siteConfig.url}${p.path}` })) })
  }
  return { valid, canonical, title, description, image, locale, alternates, isHome: route?.sourcePath === '/',
    ogLocale: localeMeta.og, ogAlternates: locales.filter((language) => language !== locale).map((language) => localeDetails[language].og),
    imageAlt: page?.image?.alt ?? localeMeta.imageAlt, type: page?.kind === 'article' ? 'article' : 'website',
    jsonLd: graph.length ? { '@context': 'https://schema.org', '@graph': graph } : null }
}
