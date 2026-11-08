import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import { siteConfig } from '../src/config/site.ts'
import images from '../src/content/editorial-images.json' with { type: 'json' }
import { localizedContent, locales, localeTags, pageHref } from '../src/i18n/routes.mjs'
import { absolute, arrow, breadcrumb, escape, metadata, organizationId, readingCopy, readingShell, writePage } from './reading-copy.mjs'

const styles = await readFile('src/styles/editorial.css', 'utf8')
const filename = 'editorial-' + createHash('sha256').update(styles).digest('hex').slice(0, 10) + '.css'
const stylesheet = '/assets/' + filename
await mkdir('dist/assets', { recursive: true })
await writeFile(resolve('dist/assets', filename), styles, 'utf8')

const journalPath = '/bakim-rehberi/'
const articlePath = slug => journalPath + slug + '/'
const source = key => {
  const entry = images.find(item => item.key === key)
  if (!entry) throw new Error('Invalid editorial image: ' + key)
  return entry
}
const imageVariant = (key, width = 1200) => {
  // The 1200px filename can describe a smaller original; use its measured size.
  const variant = source(key).variants.find(item => item.file === `${key}-${width}.webp`)
  if (!variant) throw new Error('Missing editorial image variant: ' + key + '/' + width)
  return variant
}
const image = (key, width = 1200) => '/images/editorial/' + imageVariant(key, width).file
const srcset = key => source(key).variants.map(item => `/images/editorial/${item.file} ${item.width}w`).join(', ')
const imageDimensions = key => {
  const variant = imageVariant(key)
  return `width="${variant.width}" height="${variant.height}"`
}

function card(locale, article, index) {
  const copy = readingCopy[locale]
  const path = pageHref(locale, articlePath(article.slug))
  return `<a class="sz-article-card" href="${escape(path)}"><div class="sz-article-image"><img src="${image(article.image, 480)}" srcset="${srcset(article.image)}" sizes="(max-width:767px) 90vw,30vw" ${imageDimensions(article.image)} alt="${escape(article.alt)}" loading="lazy" decoding="async"><span class="sz-article-number">${String(index + 1).padStart(2, '0')}</span></div><div class="sz-article-card-copy"><p class="sz-article-meta"><span>${escape(article.category)}</span><span>${escape(copy.readTime(article.readTime))}</span></p><h3>${escape(article.title)}</h3><p class="sz-article-excerpt">${escape(article.excerpt)}</p><span class="sz-article-read">${escape(copy.readArticle)} <span class="sz-round-arrow" aria-hidden="true">${locale === 'ar' ? '↖' : '↗'}</span></span></div></a>`
}

let built = 0
for (const locale of locales) {
  const copy = readingCopy[locale]
  const { journal: articles, services } = localizedContent[locale]
  const home = escape(pageHref(locale))
  const listing = escape(pageHref(locale, journalPath))
  const booking = escape(pageHref(locale, '/#iletisim'))

  for (const article of articles) {
    if (!/^[a-z0-9-]+$/.test(article.slug)) throw new Error('Invalid editorial slug: ' + article.slug)
    const turkishPath = articlePath(article.slug)
    const url = absolute(pageHref(locale, turkishPath))
    const related = articles.filter(item => item.slug !== article.slug).slice(0, 3)
    const relatedServices = (article.relatedServices ?? []).map(slug => {
      const service = services.find(item => item.slug === slug)
      if (!service) throw new Error('Unknown service in article ' + article.slug + ': ' + slug)
      return service
    })
    const serviceLinks = relatedServices.length ? `<section class="sz-content sz-related"><h2>${escape(copy.services)}</h2><nav class="sz-related-grid" aria-label="${escape(copy.services)}">${relatedServices.map(service => `<a class="sz-related-link" href="${escape(pageHref(locale, '/hizmetler/' + service.slug + '/'))}"><span><small>${escape(copy.serviceGuide)}</small><strong>${escape(service.title)}</strong></span></a>`).join('')}</nav></section>` : ''
    const body = `<main><article class="sz-content">
  <div class="sz-reading-hero"><div><ol class="sz-breadcrumbs" aria-label="${escape(copy.breadcrumb)}"><li><a href="${home}">${escape(siteConfig.brand)}</a></li><li aria-hidden="true">/</li><li><a href="${listing}">${escape(copy.journal)}</a></li></ol><p class="sz-article-meta"><span>${escape(article.category)}</span><span>${escape(copy.readTime(article.readTime))}</span></p><h1>${escape(article.title)}</h1><p class="sz-reading-deck">${escape(article.excerpt)}</p></div><figure class="sz-reading-cover"><img src="${image(article.image)}" srcset="${srcset(article.image)}" sizes="(min-width:768px) 45vw,90vw" ${imageDimensions(article.image)} alt="${escape(article.alt)}" fetchpriority="high"><span>${escape(copy.journalLabel)} ${arrow(locale)}</span></figure></div>
  <div class="sz-reading-body"><p class="sz-reading-intro">${escape(article.intro)}</p><nav class="sz-reading-toc" aria-label="${escape(copy.inArticle)}"><strong>${escape(copy.inArticle)}</strong><ol>${article.sections.map((section, index) => `<li><a href="#not-${index + 1}">${escape(section.title)}</a></li>`).join('')}</ol></nav>${article.sections.map((section, index) => `<section aria-labelledby="not-${index + 1}"><h2 id="not-${index + 1}">${escape(section.title)}</h2>${section.paragraphs.map(paragraph => `<p>${escape(paragraph)}</p>`).join('')}</section>${index === 0 ? `<blockquote class="sz-reading-quote">${escape(article.quote)}</blockquote>` : ''}`).join('')}<aside class="sz-reading-cta"><p>${copy.articleCta.map(escape).join('<br>')}</p><a class="sz-pill-link" href="${booking}">${escape(copy.book)} ${arrow(locale)}</a></aside></div>
  </article>${serviceLinks}<section class="sz-content sz-related" aria-labelledby="related-title"><h2 id="related-title">${escape(copy.relatedArticles)}</h2><div class="sz-related-grid">${related.map(item => `<a class="sz-related-link" href="${escape(pageHref(locale, articlePath(item.slug)))}"><img src="${image(item.image, 480)}" width="112" height="112" alt="${escape(item.alt)}" loading="lazy"><span><small>${escape(item.category)}</small><strong>${escape(item.title)}</strong></span></a>`).join('')}</div></section></main>`
    const graph = [
      {
        '@type': 'BlogPosting', '@id': url + '#article', headline: article.title, description: article.excerpt,
        image: absolute(image(article.image)), datePublished: article.date, dateModified: article.date,
        inLanguage: localeTags[locale], author: { '@id': organizationId }, publisher: { '@id': organizationId },
        mainEntityOfPage: { '@id': url + '#webpage' },
        ...(article.area ? { spatialCoverage: { '@type': 'Place', name: article.area } } : {}),
      },
      breadcrumb(locale, turkishPath, [[copy.journal, journalPath], [article.title, turkishPath]]),
    ]
    await writePage(locale, turkishPath, metadata(readingShell({ locale, turkishPath, stylesheet, body }), {
      locale, turkishPath, title: article.title + ' | ' + siteConfig.brand, description: article.excerpt,
      type: 'article', image: image(article.image), imageAlt: article.alt, graph,
    }))
    built += 1
  }

  const body = `<main class="sz-content"><div class="sz-index-hero"><p class="sz-eyebrow">${escape(copy.journalEyebrow)}</p><h1>${escape(copy.journalHeading[0])} <em>${escape(copy.journalHeading[1])}</em></h1><p class="sz-reading-deck">${escape(copy.journalIntro)}</p></div><div class="sz-journal-grid sz-index-grid">${articles.map((article, index) => card(locale, article, index)).join('')}</div></main>`
  const url = absolute(pageHref(locale, journalPath))
  const graph = [
    {
      '@type': 'ItemList', '@id': url + '#journal-articles',
      itemListElement: articles.map((article, index) => ({
        '@type': 'ListItem', position: index + 1, name: article.title,
        url: absolute(pageHref(locale, articlePath(article.slug))),
      })),
    },
    breadcrumb(locale, journalPath, [[copy.journal, journalPath]]),
  ]
  await writePage(locale, journalPath, metadata(readingShell({ locale, turkishPath: journalPath, stylesheet, body }), {
    locale, turkishPath: journalPath, title: copy.journalTitle + ' | ' + siteConfig.brand,
    description: copy.journalDescription, pageType: 'CollectionPage', image: image('fuchsia-french'), graph,
  }))
  built += 1
}
console.log(`Journal build: ${built} pages across ${locales.length} languages.`)
