import { access, readFile, readdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { siteConfig } from '../src/config/site.ts'
import { localizedContent, locales, pageHref } from '../src/i18n/routes.mjs'
import { absolute, alternateLinks, arrow, breadcrumb, escape, metadata, organizationId, readingCopy, readingShell, writePage } from './reading-copy.mjs'

const servicePath = slug => '/hizmetler/' + slug + '/'
const journalPath = '/bakim-rehberi/'
const articlePath = slug => journalPath + slug + '/'
const contactPath = '/iletisim/'
const original = localizedContent.tr
const journalPaths = [journalPath, ...original.journal.map(article => articlePath(article.slug))]
const turkishPaths = ['/', ...original.services.map(service => servicePath(service.slug)), contactPath, ...journalPaths]
const localizedPaths = new Set()
for (const locale of locales) {
  if (!readingCopy[locale]) throw new Error('Missing static reading labels for ' + locale)
  for (const group of ['services', 'journal']) {
    const translatedSlugs = localizedContent[locale][group].map(item => item.slug)
    const originalSlugs = original[group].map(item => item.slug)
    if (translatedSlugs.length !== originalSlugs.length || originalSlugs.some(slug => !translatedSlugs.includes(slug))) {
      throw new Error('Incomplete translated ' + group + ' for ' + locale)
    }
  }
  for (const turkishPath of turkishPaths) {
    const path = pageHref(locale, turkishPath)
    if (locale === 'tr' ? path !== turkishPath : !path.startsWith('/' + locale + '/')) {
      throw new Error('Wrong localized path: ' + locale + ' ' + turkishPath + ' → ' + path)
    }
    if (localizedPaths.has(path)) throw new Error('Duplicate localized page: ' + path)
    localizedPaths.add(path)
  }
}

const ssrDir = resolve('node_modules/.cache/sazi-ssr')
const ssrEntry = (await readdir(ssrDir)).find(name => /^entry-server\.(m?js)$/.test(name))
if (!ssrEntry) throw new Error('Missing homepage prerender bundle')
const { render } = await import(pathToFileURL(resolve(ssrDir, ssrEntry)).href)
const homeTemplate = await readFile('dist/index.html', 'utf8')
if (!homeTemplate.includes('<div id="root"></div>')) throw new Error('Unexpected homepage mount point')
const editorialCss = await readFile('src/styles/editorial.css', 'utf8')
const stylesheetPath = '/assets/editorial-' + createHash('sha256').update(editorialCss).digest('hex').slice(0, 10) + '.css'
await access(resolve('dist', '.' + stylesheetPath))

function serviceEntity(locale, service) {
  const url = absolute(pageHref(locale, servicePath(service.slug)))
  return {
    '@type': 'Service', '@id': url + '#service', name: service.title, serviceType: service.title,
    description: service.description, url, image: absolute(service.image), provider: { '@id': organizationId },
    mainEntityOfPage: { '@id': url + '#webpage' },
  }
}

for (const locale of locales) {
  const copy = readingCopy[locale]
  const { services, journal } = localizedContent[locale]
  const serviceGraph = services.map(service => serviceEntity(locale, service))
  const homeMarkup = await render(locale)
  if (typeof homeMarkup !== 'string' || !homeMarkup.trim()) throw new Error('Missing homepage markup for ' + locale)
  const home = homeTemplate.replace('<div id="root"></div>', () => `<div id="root">${homeMarkup}</div>`)
  await writePage(locale, '/', metadata(home, {
    locale, turkishPath: '/', title: copy.homeTitle, description: copy.homeDescription, graph: serviceGraph,
  }))

  const homeHref = escape(pageHref(locale))
  const bookingHref = escape(pageHref(locale, '/#iletisim'))
  const servicesHref = escape(pageHref(locale, '/#hizmetler'))
  const serviceLinks = exclude => `<nav class="sz-related-grid" aria-label="${escape(copy.relatedServices)}">${services.filter(service => service.slug !== exclude).map(service => `<a class="sz-related-link" href="${escape(pageHref(locale, servicePath(service.slug)))}"><span><small>${escape(copy.serviceGuide)}</small><strong>${escape(service.title)}</strong></span></a>`).join('')}</nav>`

  for (const service of services) {
    const turkishPath = servicePath(service.slug)
    const related = journal.filter(article => article.slug === service.relatedArticle || article.relatedServices?.includes(service.slug))
    const relatedLinks = related.length ? `<div class="sz-reading-related">${related.map(article => `<a class="sz-under-link" href="${escape(pageHref(locale, articlePath(article.slug)))}">${escape(article.title)} ${arrow(locale)}</a>`).join('')}</div>` : ''
    const body = `<main class="sz-content"><div class="sz-reading-hero"><div><ol class="sz-breadcrumbs" aria-label="${escape(copy.breadcrumb)}"><li><a href="${homeHref}">${escape(siteConfig.brand)}</a></li><li aria-hidden="true">/</li><li><a href="${servicesHref}">${escape(copy.services)}</a></li></ol><p class="sz-eyebrow">${escape(copy.serviceGuide)}</p><h1>${escape(service.title)}</h1><p class="sz-reading-deck">${escape(service.description)}</p></div><figure class="sz-reading-cover"><img src="${escape(service.image)}" alt="${escape(copy.serviceImage(service.title))}" width="1200" height="900" fetchpriority="high"></figure></div><article class="sz-reading-body"><p class="sz-reading-intro">${escape(service.intro)}</p>${service.sections.map(section => `<section><h2>${escape(section.title)}</h2>${section.paragraphs.map(paragraph => `<p>${escape(paragraph)}</p>`).join('')}</section>`).join('')}<section><h2>${escape(copy.faq)}</h2>${service.questions.map(question => `<details><summary>${escape(question.question)}</summary><p>${escape(question.answer)}</p></details>`).join('')}</section>${relatedLinks}<aside class="sz-reading-cta"><p>${copy.serviceCta.map(escape).join('<br>')}</p><a class="sz-pill-link" href="${bookingHref}">${escape(copy.book)} ${arrow(locale)}</a></aside></article><section class="sz-related"><h2>${escape(copy.relatedServices)}</h2>${serviceLinks(service.slug)}</section></main>`
    await writePage(locale, turkishPath, metadata(readingShell({ locale, turkishPath, stylesheet: stylesheetPath, body }), {
      locale, turkishPath, title: service.title + ' | ' + siteConfig.brand, description: service.description, image: service.image,
      imageAlt: copy.serviceImage(service.title),
      graph: [serviceEntity(locale, service), breadcrumb(locale, turkishPath, [[service.title, turkishPath]])],
    }))
  }

  const body = `<main class="sz-content"><div class="sz-index-hero"><p class="sz-eyebrow">${escape(copy.contactEyebrow)}</p><h1>${escape(copy.contactHeading[0])} <em>${escape(copy.contactHeading[1])}</em></h1><p class="sz-reading-deck">${escape(copy.contactIntro)}</p></div><div class="sz-reading-body"><h2>${escape(copy.contactSection)}</h2><p><bdi lang="tr">${escape(siteConfig.locality)}</bdi></p><p>${escape(copy.phone)}: <a href="tel:+${siteConfig.whatsappNumber}"><bdi dir="ltr">${escape(siteConfig.phone)}</bdi></a></p><p><a class="sz-pill-link" href="https://wa.me/${siteConfig.whatsappNumber}" target="_blank" rel="noopener noreferrer">${escape(copy.whatsapp)} ${arrow(locale)}</a></p><p><a href="${escape(siteConfig.instagramUrl)}" target="_blank" rel="noopener noreferrer" lang="en" dir="ltr">Instagram: @sazibeauty</a></p><p>${escape(copy.contactNotes)}</p><a class="sz-pill-link" href="${bookingHref}">${escape(copy.form)} ${arrow(locale)}</a></div><section class="sz-related">${serviceLinks()}</section></main>`
  await writePage(locale, contactPath, metadata(readingShell({ locale, turkishPath: contactPath, stylesheet: stylesheetPath, body }), {
    locale, turkishPath: contactPath, title: copy.contactTitle + ' | ' + siteConfig.brand,
    description: copy.contactDescription, pageType: 'ContactPage',
    graph: [breadcrumb(locale, contactPath, [[copy.contact, contactPath]])],
  }))
}

// Confirm every sitemap target was written by one of the two static builders.
for (const path of localizedPaths) await access(resolve('dist', '.' + path, 'index.html'))
const sitemapEntries = locales.flatMap(locale => {
  const articleDates = new Map(localizedContent[locale].journal.map(article => [articlePath(article.slug), article.date]))
  return turkishPaths.map(turkishPath => {
    const path = pageHref(locale, turkishPath)
    const date = articleDates.get(turkishPath)
    const lastmod = date ? `<lastmod>${escape(date)}</lastmod>` : ''
    const alternate = alternateLinks(turkishPath).map(({ lang, url }) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${escape(url)}"/>`).join('')
    return `<url><loc>${escape(absolute(path))}</loc>${lastmod}${alternate}</url>`
  })
})
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapEntries.join('\n')}\n</urlset>\n`, 'utf8')

const missing = readingCopy.tr
const missingBody = `<main class="sz-content sz-index-hero"><h1>${escape(missing.missing)}</h1><a class="sz-pill-link" href="/">${escape(missing.home)} ${arrow('tr')}</a></main>`
const missingPage = readingShell({ locale: 'tr', turkishPath: '/', stylesheet: stylesheetPath, body: missingBody })
  .replace('</head>', '<title>' + escape(missing.missing + ' | ' + siteConfig.brand) + '</title><meta name="robots" content="noindex,follow"></head>')
await writeFile('dist/404.html', missingPage, 'utf8')
console.log(`SEO build: ${locales.length} prerendered homepages, ${localizedPaths.size} canonical pages and reciprocal language alternates.`)
