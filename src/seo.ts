import { siteConfig } from './config/site'
import { contentPages, getContentPage, normalizeContentPath } from './components/satin/pages'

export function getSeo(pathname: string) {
  const path = normalizeContentPath(pathname)
  const page = getContentPage(path)
  const valid = path === '/' || page !== null
  const canonical = valid ? `${siteConfig.url}${path}` : undefined
  const title = page?.title ?? (valid ? 'BeautyNails | Tırnak Sanatı, İpek Kirpik ve Erkek Bakımı' : 'Sayfa bulunamadı | BeautyNails')
  const description = page?.description ?? (valid
    ? 'BeautyNails’te tırnak sanatı, ipek kirpik, kalıcı makyaj ve erkek manikür-pedikür seçeneklerini keşfedin. Tasarım örnekleri, bakım notları ve randevu iletişimi.'
    : 'Aradığınız sayfa bulunamadı. BeautyNails ana sayfasından hizmetlere ve bakım yazılarına ulaşabilirsiniz.')
  const image = `${siteConfig.url}${page?.image?.src ?? '/images/satin/hero-desktop-960.webp'}`
  const org = { '@type': 'Organization', '@id': `${siteConfig.url}/#organization`, name: siteConfig.brand,
    url: `${siteConfig.url}/`, telephone: `+${siteConfig.whatsappNumber}`,
    ...(siteConfig.instagramUrl ? { sameAs: [siteConfig.instagramUrl] } : {}) }
  const graph: Record<string, unknown>[] = valid ? [org,
    { '@type': 'WebSite', '@id': `${siteConfig.url}/#website`, url: `${siteConfig.url}/`, name: siteConfig.brand,
      inLanguage: 'tr-TR', publisher: { '@id': org['@id'] } },
    { '@type': page?.kind.endsWith('index') ? 'CollectionPage' : 'WebPage', '@id': `${canonical}#webpage`,
      url: canonical, name: title, description, inLanguage: 'tr-TR', isPartOf: { '@id': `${siteConfig.url}/#website` } },
  ] : []
  if (page) {
    const crumbs = [{ name: 'Ana sayfa', item: `${siteConfig.url}/` }]
    if (page.kind === 'article') crumbs.push({ name: 'Bakım notları', item: `${siteConfig.url}/yazilar/` })
    if (page.kind === 'service') crumbs.push({ name: 'Hizmetler', item: `${siteConfig.url}/hizmetler/` })
    crumbs.push({ name: page.heading, item: canonical! })
    graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, index) => ({ '@type': 'ListItem', position: index + 1, ...c })) })
    if (page.kind === 'article') graph.push({ '@type': 'Article', '@id': `${canonical}#article`, headline: page.heading,
      description, inLanguage: 'tr-TR', mainEntityOfPage: { '@id': `${canonical}#webpage` }, image: [image],
      author: { '@id': org['@id'] }, publisher: { '@id': org['@id'] } })
    if (page.kind === 'service') graph.push({ '@type': 'Service', '@id': `${canonical}#service`, name: page.heading,
      serviceType: page.heading, description, url: canonical, provider: { '@id': org['@id'] } })
    if (page.kind.endsWith('index')) graph.push({ '@type': 'ItemList', itemListElement: contentPages
      .filter((p) => p.kind === (page.kind === 'service-index' ? 'service' : 'article'))
      .map((p, index) => ({ '@type': 'ListItem', position: index + 1, name: p.heading, url: `${siteConfig.url}${p.path}` })) })
  }
  return { valid, path, canonical, title, description, image, type: page?.kind === 'article' ? 'article' : 'website',
    jsonLd: graph.length ? { '@context': 'https://schema.org', '@graph': graph } : null }
}
