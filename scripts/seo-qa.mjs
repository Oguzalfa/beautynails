import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { chromium, webkit } from 'playwright'
import { locales, languageNames, localeTags, ogLocales, localeDir, localizedContent, pageHref } from '../src/i18n/routes.mjs'

const canonicalOrigin = 'https://www.sazibeauty.com'
const organizationId = canonicalOrigin + '/#organization'
const telephone = '+905011281808'
const studioLocality = 'Cevizli, Kartal, İstanbul'
const dist = resolve('dist')
const output = resolve(process.env.QA_OUT || '../.sazi-seo-qa')
const engine = process.env.QA_ENGINE || 'chromium'
const label = process.env.QA_LABEL || engine
const widths = (process.env.QA_WIDTHS || '320,390,768,1440').split(',').map(Number)
const { services, journal: articles } = localizedContent.tr
const nailExtensionGuideSlug = 'maltepe-protez-tirnak-randevu-rehberi'
const localGuideSlugs = [nailExtensionGuideSlug, 'maltepe-manikur-pedikur-rehberi', 'maltepe-kirpik-kalici-makyaj-randevu-rehberi']
const legacyArticleSlug = articles.find(article => !localGuideSlugs.includes(article.slug))?.slug
const localGuideArea = 'Maltepe, İstanbul'
const sourcePages = [
  { path:'/', type:'home' },
  ...services.map(service => ({ path:`/hizmetler/${service.slug}/`, type:'service', slug:service.slug })),
  { path:'/iletisim/', type:'contact' },
  { path:'/bakim-rehberi/', type:'journal' },
  ...articles.map(article => ({ path:`/bakim-rehberi/${article.slug}/`, type:'article', slug:article.slug })),
]
const pages = locales.flatMap(locale => sourcePages.map(source => {
  const { services: localizedServices, journal } = localizedContent[locale]
  const entry = source.type === 'service' ? localizedServices.find(service => service.slug === source.slug)
    : source.type === 'article' ? journal.find(article => article.slug === source.slug) : undefined
  return { source, locale, entry, path:pageHref(locale, source.path) }
}))
const dictionaries = { tr:{} }
for (const locale of locales.filter(value => value !== 'tr')) {
  dictionaries[locale] = JSON.parse(await readFile(`src/i18n/ui-${locale}.json`, 'utf8'))
}
const translated = (locale, source) => dictionaries[locale][source] ?? source
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.ttf':'font/ttf', '.woff2':'font/woff2', '.xml':'application/xml', '.txt':'text/plain; charset=utf-8' }
await mkdir(output, { recursive:true })

const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    const file = resolve(dist, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname))
    if (!file.startsWith(dist + sep)) throw new Error('Invalid static path')
    const data = await readFile(file)
    res.writeHead(200, { 'Content-Type':types[extname(file)] || 'application/octet-stream' })
    res.end(data)
  } catch {
    res.writeHead(404, { 'Content-Type':'text/plain; charset=utf-8' })
    res.end('Not found')
  }
})
await new Promise(resolveReady => server.listen(0, '127.0.0.1', resolveReady))
const base = (process.env.QA_URL || `http://127.0.0.1:${server.address().port}`).replace(/\/$/, '')
if (new URL(base).search || new URL(base).hash) throw new Error('QA_URL must be an origin without credentials or query parameters')
const report = { engine, base, physicalDevice:false, startedAt:new Date().toISOString(), checks:[], status:'RUNNING' }
let browser

function decode(value) {
  const entities = { amp:'&', quot:'"', apos:"'", lt:'<', gt:'>', nbsp:' ' }
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (original, entity) => {
    if (!entity.startsWith('#')) return entities[entity.toLowerCase()]
    const number = /^#x/i.test(entity) ? parseInt(entity.slice(2), 16) : Number(entity.slice(1))
    return number <= 0x10ffff ? String.fromCodePoint(number) : original
  })
}
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(match => [match[1].toLowerCase(), decode(match[2] ?? match[3])]))
}
function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(match => attributes(match[0]))
}
function bodyText(html) {
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || ''
  return decode(body.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
}
function assertLanguageAlternates(links, sourcePath, label) {
  const actual = links.filter(item => item.rel === 'alternate' && item.hreflang)
    .map(item => [item.hreflang, item.href])
  const expected = locales.map(language => [localeTags[language], canonicalOrigin + pageHref(language, sourcePath)])
  expected.push(['x-default', canonicalOrigin + sourcePath])
  assert.deepEqual(actual.sort(), expected.sort(), label + ': all reciprocal language variants')
}
function assertLocalizedLink(hrefs, locale, sourcePath, label) {
  const href = pageHref(locale, sourcePath)
  assert.ok(hrefs.includes(href) || hrefs.includes(canonicalOrigin + href), `${label}: localized link ${href}`)
}
function checkNoInventedFacts(node) {
  if (!node || typeof node !== 'object') return
  for (const [key, value] of Object.entries(node)) {
    assert.ok(!['address','geo','openingHours','openingHoursSpecification','hasMap','review','reviews','aggregateRating','priceRange'].includes(key), `Unverified business field: ${key}`)
    checkNoInventedFacts(value)
  }
}
function inspectHtml(html, { source, locale, entry, path }) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1]
  assert.ok(head, `${path}: HTML head`)
  const titles = [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)].map(match => decode(match[1]).trim())
  assert.equal(titles.length, 1, `${path}: one title`)
  assert.ok(titles[0].length >= 15 && titles[0].includes('Şazi Beauty'), `${path}: meaningful branded title`)
  const meta = tags(head, 'meta')
  const descriptions = meta.filter(item => item.name === 'description')
  assert.equal(descriptions.length, 1, `${path}: one description`)
  assert.ok(descriptions[0].content.length >= 40, `${path}: useful description`)
  const links = tags(head, 'link')
  const canonicals = links.filter(item => item.rel === 'canonical')
  assert.equal(canonicals.length, 1, `${path}: one canonical`)
  assert.equal(canonicals[0].href, canonicalOrigin + path, `${path}: self canonical`)
  assertLanguageAlternates(links, source.path, path)
  const robots = meta.filter(item => item.name === 'robots')
  assert.equal(robots.length, 1, `${path}: one robots directive`)
  assert.ok(/\bindex\b/.test(robots[0].content) && !/\b(?:noindex|nofollow)\b/.test(robots[0].content), `${path}: indexable HTML`)
  const [htmlAttributes] = tags(html, 'html')
  assert.equal(htmlAttributes?.lang, locale, `${path}: document language`)
  assert.equal(htmlAttributes?.dir || 'ltr', localeDir(locale), `${path}: text direction`)
  const text = bodyText(html)
  const hrefs = tags(html, 'a').map(item => item.href)
  const minimum = source.type === 'home' ? 1000 : source.type === 'service' ? 700 : 300
  assert.ok(text.length >= minimum, `${path}: substantial initial text (${text.length})`)
  assert.ok(!html.includes('<div id="root"></div>'), `${path}: nonempty initial app HTML`)
  const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
    .map(match => decode(match[1].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim())
  assert.ok(headings.length && headings.every(Boolean), `${path}: populated initial heading`)
  if (locale === 'ar') assert.match(headings.join(' '), /\p{Script=Arabic}/u, `${path}: Arabic initial heading`)
  if (entry) {
    assert.deepEqual(headings, [entry.title], `${path}: translated entry heading`)
    assert.ok(titles[0].includes(entry.title), `${path}: translated entry title`)
    assert.equal(descriptions[0].content, entry.description ?? entry.excerpt, `${path}: translated description`)
    const expectedCopy = [entry.intro, ...entry.sections.flatMap(section => [section.title, ...section.paragraphs])]
    if (entry.questions) expectedCopy.push(...entry.questions.flatMap(item => [item.question, item.answer]))
    if (entry.quote) expectedCopy.push(entry.quote)
    for (const copy of expectedCopy) assert.ok(text.includes(copy), `${path}: initial copy includes ${copy.slice(0, 80)}`)
  }
  if (source.type === 'home') {
    const heading = translated(locale, 'Sıradanın')
    assert.ok(headings.every(value => value.includes(heading)), `${path}: desktop and mobile hero translated`)
    for (const service of services) {
      assertLocalizedLink(hrefs, locale, `/hizmetler/${service.slug}/`, path)
    }
  }
  const schemas = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(match => JSON.parse(match[1]))
  assert.equal(schemas.length, 1, `${path}: one unified JSON-LD graph`)
  const schema = schemas[0]
  assert.equal(schema['@context'], 'https://schema.org', `${path}: schema context`)
  assert.ok(Array.isArray(schema['@graph']), `${path}: graph object format`)
  const organizations = schema['@graph'].filter(item => item['@type'] === 'Organization')
  assert.equal(organizations.length, 1, `${path}: one business entity`)
  const organization = organizations[0]
  assert.equal(organization['@id'], organizationId, `${path}: stable entity ID`)
  assert.equal(organization.name, 'Şazi Beauty', `${path}: correct business identity`)
  assert.equal(organization.telephone, telephone, `${path}: verified contact phone`)
  assert.deepEqual(organization.location, { '@type':'Place', name:studioLocality }, `${path}: confirmed studio locality`)
  if (source.type === 'contact') assert.ok(text.includes(studioLocality), `${path}: visible studio locality`)
  assert.ok(organization.contactPoint?.some(item => item.telephone === telephone), `${path}: consistent contact point`)
  checkNoInventedFacts(schema)
  const webpage = schema['@graph'].find(item => item['@id'] === canonicalOrigin + path + '#webpage')
  assert.equal(webpage?.inLanguage, localeTags[locale], `${path}: localized page schema`)
  assert.equal(webpage?.url, canonicalOrigin + path, `${path}: page schema URL`)
  if (source.type === 'service') {
    const service = schema['@graph'].find(item => item['@type'] === 'Service')
    assert.equal(service?.provider?.['@id'], organizationId, `${path}: service entity`)
    assert.equal(service?.name, entry.title, `${path}: localized service schema name`)
    assert.equal(service?.url, canonicalOrigin + path, `${path}: localized service schema URL`)
    for (const guide of articles.filter(item => item.relatedServices?.includes(source.slug))) {
      assertLocalizedLink(hrefs, locale, `/bakim-rehberi/${guide.slug}/`, `${path}: related guide`)
    }
  }
  if (source.type === 'article') {
    const article = schema['@graph'].find(item => item['@type'] === 'BlogPosting')
    assert.ok(article && article.author?.['@id'] === organizationId && article.publisher?.['@id'] === organizationId, `${path}: article entity links`)
    assert.equal(article.headline, entry.title, `${path}: localized article schema headline`)
    assert.equal(article.inLanguage, localeTags[locale], `${path}: localized article schema language`)
    assert.equal(article.mainEntityOfPage?.['@id'], canonicalOrigin + path + '#webpage', `${path}: localized article schema page`)
    if (localGuideSlugs.includes(source.slug)) {
      const guide = articles.find(item => item.slug === source.slug)
      assert.equal(entry.area, localGuideArea, `${path}: Maltepe guide area`)
      assert.deepEqual(entry.relatedServices, guide.relatedServices, `${path}: localized guide keeps its service relationships`)
      assert.equal(article.description, entry.excerpt, `${path}: localized article schema description`)
      assert.equal(article.datePublished, entry.date, `${path}: article publication date`)
      assert.equal(article.spatialCoverage?.['@type'], 'Place', `${path}: article spatial coverage type`)
      assert.equal(article.spatialCoverage?.name, localGuideArea, `${path}: Maltepe spatial coverage`)
      const social = Object.fromEntries(meta.filter(item => item.property).map(item => [item.property, item.content]))
      assert.equal(social['og:type'], 'article', `${path}: article social type`)
      assert.equal(social['og:locale'], ogLocales[locale], `${path}: localized social language`)
      assert.equal(social['og:title'], titles[0], `${path}: localized social title`)
      assert.equal(social['og:description'], entry.excerpt, `${path}: localized social description`)
      assert.equal(social['og:image:alt'], entry.alt, `${path}: localized social image alternative`)
      assert.equal(social['og:url'], canonicalOrigin + path, `${path}: localized social URL`)
      for (const slug of guide.relatedServices) {
        assertLocalizedLink(hrefs, locale, `/hizmetler/${slug}/`, `${path}: related service`)
      }
    }
    if (source.slug === nailExtensionGuideSlug) {
      assert.ok(entry.bookingMessage?.trim().length > 40, `${path}: meaningful nail extension enquiry`)
      assert.ok(hrefs.includes(`https://wa.me/${telephone.slice(1)}?text=${encodeURIComponent(entry.bookingMessage)}`), `${path}: correct WhatsApp enquiry link`)
    }
  }
  if (source.type === 'journal') {
    const entries = localizedContent[locale].journal
    const list = schema['@graph'].find(item => item['@type'] === 'ItemList')
    const expectedItems = entries.map((article, index) => {
      const sourcePath = `/bakim-rehberi/${article.slug}/`
      assertLocalizedLink(hrefs, locale, sourcePath, `${path}: journal listing`)
      return { position:index + 1, name:article.title, url:canonicalOrigin + pageHref(locale, sourcePath) }
    })
    assert.deepEqual(list?.itemListElement?.map(({position, name, url}) => ({position, name, url})), expectedItems, `${path}: ordered journal schema inventory`)
  }
  return { path, locale, sourcePath:source.path, title:titles[0], heading:headings[0], description:descriptions[0].content, textLength:text.length, canonical:canonicals[0].href, schema:true }
}

async function ready(page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map(image => { image.loading='eager'; return image.decode().catch(() => null) }))
  })
}
async function inspectLayout(page) {
  const result = await page.evaluate(() => ({
    width:innerWidth,
    scroll:document.documentElement.scrollWidth,
    missingImages:[...document.images].filter(image => image.getClientRects().length && (!image.complete || !image.naturalWidth)).map(image => image.getAttribute('src')),
    clipped:[...document.querySelectorAll('h1,h2,h3,.sz-section-intro,.sz-article-card-copy,.sz-reading-brand,.sz-pill-link,.sz-related-link,.sz-service-links,.sz-language__trigger')].filter(element => {
      const box=element.getBoundingClientRect()
      return !element.matches('.bn-sr,.sr-only') && box.width > 0 && (element.scrollWidth > element.clientWidth + 1 || box.right > innerWidth + 1 || box.left < -.5)
    }).map(element => ({class:element.className,text:element.textContent.slice(0,80)}))
  }))
  assert.ok(result.scroll <= result.width, `Horizontal overflow: ${JSON.stringify(result)}`)
  assert.deepEqual(result.missingImages, [], 'No missing visible images')
  assert.deepEqual(result.clipped, [], 'No clipped content or links')
  return result
}

async function expectDocumentLanguage(page, locale) {
  assert.equal(await page.locator('html').getAttribute('lang'), locale, `${page.url()}: rendered language`)
  assert.equal(await page.locator('html').evaluate(element => getComputedStyle(element).direction), localeDir(locale), `${page.url()}: rendered direction`)
}

async function inspectHomepageJournal(page, locale) {
  const journal = page.locator('.sz-journal:visible')
  assert.equal(await journal.count(), 1, `${locale}: one visible homepage journal`)
  const cards = await journal.locator('a.sz-article-card').evaluateAll(elements => elements.map(element => element.getAttribute('href')))
  const expected = localizedContent[locale].journal.slice(0, 3).map(article => pageHref(locale, `/bakim-rehberi/${article.slug}/`))
  assert.deepEqual(cards, expected, `${locale}: exactly three current homepage articles`)
  const listing = pageHref(locale, '/bakim-rehberi/')
  assert.ok(await journal.locator(`a.sz-pill-link[href="${listing}"]`).isVisible(), `${locale}: visible link to all journal articles`)
}

async function openPicker(page, touch) {
  const picker = page.locator('.sz-language:visible')
  assert.equal(await picker.count(), 1, 'One visible language picker')
  const trigger = picker.locator('.sz-language__trigger')
  const box = await trigger.boundingBox()
  assert.ok(box && box.width >= 44 && box.height >= 44, 'Language picker has a usable touch target')
  if (touch) await trigger.tap()
  else await trigger.click()
  assert.notEqual(await picker.getAttribute('open'), null, 'Language picker opens')
  const options = picker.locator('.sz-language__options')
  const links = await options.locator('a[data-site-language]:visible').evaluateAll(elements => elements.map(element => [element.dataset.siteLanguage, element.textContent.trim()]))
  assert.deepEqual(Object.fromEntries(links), languageNames, 'Every language option is reachable under its native name')
  const optionBox = await options.boundingBox()
  const viewport = page.viewportSize()
  assert.ok(optionBox && viewport && optionBox.x >= -1 && optionBox.x + optionBox.width <= viewport.width + 1, 'Language menu stays inside viewport width')
  return picker
}

async function selectLanguage(page, current, next, sourcePath = '/', touch = false) {
  const picker = await openPicker(page, touch)
  assert.equal(await picker.locator('a[aria-current="page"]').getAttribute('data-site-language'), current, 'Active language is identified')
  const link = picker.locator(`a[data-site-language="${next}"]`)
  const destination = pageHref(next, sourcePath)
  assert.equal(await link.getAttribute('href'), destination, 'Language link points to the equivalent page')
  await Promise.all([
    page.waitForURL(base + destination, {waitUntil:'load'}),
    touch ? link.tap() : link.click(),
  ])
  await expectDocumentLanguage(page, next)
}

async function auditLanguagePreferences() {
  const browserLocales = { en:'en-GB', de:'de-DE', ar:'ar-SA', ru:'ru-RU', uz:'uz-UZ', tk:'tk-TM' }
  const firstService = sourcePages.find(item => item.type === 'service').path
  for (const locale of locales.filter(item => item !== 'tr')) {
    const context = await browser.newContext({locale:browserLocales[locale], reducedMotion:'reduce'})
    try {
      const page = await context.newPage()
      await page.goto(base + firstService, {waitUntil:'load'})
      assert.equal(page.url(), base + firstService, 'Browser language preserves a direct Turkish service link')
      await expectDocumentLanguage(page, 'tr')
      if (locale === 'en') {
        for (const suffix of ['?utm_source=qa', '#hizmetler']) {
          await page.goto(base + '/' + suffix, {waitUntil:'load'})
          assert.equal(page.url(), base + '/' + suffix, 'Root URL query and fragment are preserved')
        }
      }
      await page.goto(base + '/', {waitUntil:'load'})
      await page.waitForURL(base + pageHref(locale), {waitUntil:'load'})
      await expectDocumentLanguage(page, locale)
      assert.equal(await page.evaluate(() => localStorage.getItem('sazi-language')), null, 'Browser language is not saved as a manual preference')
      await page.goto(base + '/', {waitUntil:'load'})
      assert.equal(page.url(), base + '/', 'Browser language is applied only on the first root visit')
      await expectDocumentLanguage(page, 'tr')
    } finally {
      await context.close()
    }
  }

  const unsupported = await browser.newContext({locale:'fr-FR'})
  try {
    const page = await unsupported.newPage()
    await page.goto(base + '/', {waitUntil:'load'})
    assert.equal(page.url(), base + '/', 'Unsupported language falls back to the Turkish homepage')
    await expectDocumentLanguage(page, 'tr')
  } finally {
    await unsupported.close()
  }
}

async function auditLocalizedBooking(page, locale, touch) {
  const t = source => {
    assert.ok(dictionaries[locale][source], `${locale}: booking copy exists for ${source}`)
    return dictionaries[locale][source]
  }
  const opener = page.locator(touch ? '.bn-at-hero-foot .bn-at-cta' : '.bn-hero__copy .bnx-appointment')
  if (touch) await opener.tap()
  else await opener.click()
  const panel = page.getByRole('dialog', {name:t('Randevu talebi'),exact:true})
  const form = panel.locator('.bn-form')
  await form.waitFor({state:'visible'})
  const [box, viewport] = [await panel.boundingBox(), page.viewportSize()]
  assert.ok(box && viewport && box.x >= -1 && box.y >= -1 && box.x + box.width <= viewport.width + 1 && box.y + box.height <= viewport.height + 1, `${locale}: booking panel fits viewport`)
  assert.equal(await form.locator('legend').innerText(), t('Hizmet'), `${locale}: localized service legend`)
  for (const field of ['Ad Soyad', 'Telefon', 'Saat', 'Not (isteğe bağlı)']) {
    assert.ok(await form.getByLabel(t(field),{exact:true}).isVisible(), `${locale}: visible localized label ${field}`)
  }
  const option = 'Tırnak Sanatı'
  const service = form.getByRole('checkbox', {name:t(option),exact:true})
  const submit = form.getByRole('button', {name:t('WhatsApp taslağını hazırla'),exact:true})
  await submit.click()
  for (const error of ['Lütfen adınızı yazın.', 'Lütfen telefon numaranızı yazın.', 'Lütfen en az bir hizmet seçin.']) {
    assert.ok(await form.getByText(t(error), {exact:true}).isVisible(), `${locale}: translated validation ${error}`)
  }
  const data = {name:'QA Test $&',phone:'05000000000',time:'16:40',note:'QA + & %'}
  await service.check()
  for (const [field, value] of Object.entries(data)) await form.locator(`[name="${field}"]`).fill(value)
  await page.evaluate(() => {
    window.open = (...args) => {
      window.__qaDraft = args
      return null
    }
  })
  await submit.click()
  const fallback = panel.getByRole('link', {name:t('WhatsApp taslağını aç'),exact:true})
  await fallback.waitFor({state:'visible'})
  const expectedText = [
    t('Merhaba, {brand} randevu talebi:').replace('{brand}', 'Şazi Beauty'),
    t('Hizmet: {services}').replace('{services}', t(option)),
    t('Ad soyad: {name}').replace('{name}', () => data.name),
    t('Telefon: {phone}').replace('{phone}', data.phone),
    t('Saat: {time}').replace('{time}', data.time),
    t('Not: {note}').replace('{note}', data.note),
  ].join('\n')
  const expectedUrl = `https://wa.me/${telephone.slice(1)}?text=${encodeURIComponent(expectedText)}`
  assert.deepEqual(await page.evaluate(() => window.__qaDraft), [expectedUrl,'_blank','noopener'], `${locale}: localized encoded draft uses the existing business recipient`)
  assert.equal(await fallback.getAttribute('href'), expectedUrl, `${locale}: WhatsApp fallback matches draft`)
  assert.ok(await fallback.evaluate(element => element === document.activeElement), `${locale}: draft fallback receives focus`)
  await page.keyboard.press('Escape')
  await panel.waitFor({state:'hidden'})
  assert.ok(await opener.evaluate(element => element === document.activeElement), `${locale}: close restores appointment button focus`)
}

try {
  browser = await (engine === 'webkit' ? webkit : chromium).launch({ headless:true })
  const audit = await browser.newContext()
  const sitemapResponse = await audit.request.get(base + '/sitemap.xml')
  assert.equal(sitemapResponse.status(), 200, 'Sitemap HTTP status')
  const sitemap = await sitemapResponse.text()
  const sitemapEntries = [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>([\s\S]*?)<\/url>/g)]
  const sitemapUrls = sitemapEntries.map(match => decode(match[1]))
  const sitemapByUrl = new Map(sitemapEntries.map(match => [decode(match[1]), match[2]]))
  assert.equal(articles.length, 6, 'Six journal articles')
  const localGuides = articles.slice(0, localGuideSlugs.length)
  assert.deepEqual(localGuides.map(article => article.slug), localGuideSlugs, 'Maltepe guides lead the journal')
  for (const guide of localGuides) {
    assert.ok(Array.isArray(guide.relatedServices) && guide.relatedServices.length > 0, `${guide.slug}: guide names related services`)
    assert.ok(guide.relatedServices.every(slug => services.some(service => service.slug === slug)), `${guide.slug}: related services exist`)
  }
  assert.equal(sourcePages.length, 13, 'Thirteen Turkish pages')
  for (const source of sourcePages) assert.equal(pageHref('tr', source.path), source.path, 'Original Turkish routes remain stable')
  assert.equal(pages.length, 91, 'Seven languages with thirteen pages each')
  assert.equal(sitemapUrls.length, pages.length, 'Full localized sitemap inventory')
  assert.deepEqual([...new Set(sitemapUrls)].sort(), pages.map(item => canonicalOrigin + item.path).sort(), 'Exact canonical sitemap inventory')
  const rawPages = []
  for (const item of pages) {
    const { path } = item
    const sitemapEntry = sitemapByUrl.get(canonicalOrigin + path)
    assertLanguageAlternates(tags(sitemapEntry, 'xhtml:link'), item.source.path, 'Sitemap ' + path)
    const dates = [...sitemapEntry.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(match => match[1])
    assert.deepEqual(dates, item.source.type === 'article' ? [item.entry.date] : [], `${path}: sitemap uses the recorded article date`)
    const response = await audit.request.get(base + path, {maxRedirects:0})
    assert.equal(response.status(), 200, `${path}: raw HTTP status`)
    assert.match(response.headers()['content-type'] || '', /text\/html/i, `${path}: HTML response`)
    if (new URL(base).hostname === 'www.sazibeauty.com') assert.ok(!/noindex/i.test(response.headers()['x-robots-tag'] || ''), `${path}: production response indexable`)
    const html = await response.text()
    rawPages.push(inspectHtml(html, item))
  }
  for (const source of sourcePages) {
    const variants = rawPages.filter(item => item.sourcePath === source.path)
    for (const field of ['heading', 'title', 'description']) {
      assert.equal(new Set(variants.map(item => item[field])).size, locales.length, `${source.path}: distinct localized ${field} values`)
    }
  }
  const robotsResponse = await audit.request.get(base + '/robots.txt')
  assert.equal(robotsResponse.status(), 200, 'Robots HTTP status')
  const robots = await robotsResponse.text()
  assert.ok(robots.includes('Sitemap: ' + canonicalOrigin + '/sitemap.xml'), 'Robots declares sitemap')
  assert.ok(!/^Disallow:\s*\/\s*$/m.test(robots), 'Public crawling not blocked')
  const missingResponse = await audit.request.get(base + '/this-url-must-not-exist-seo-qa')
  assert.equal(missingResponse.status(), 404, 'Genuine 404, no homepage fallback')
  report.checks.push({type:'raw-html-and-sitemap',pages:rawPages,status:'PASS'})
  await audit.close()
  console.log(`PASS ${engine}: ${pages.length} raw HTML pages, reciprocal hreflang, localized copy and schemas`)

  const noJs = await browser.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, javaScriptEnabled:false, reducedMotion:'reduce' })
  const noJsPage = await noJs.newPage()
  await noJsPage.goto(base + '/', { waitUntil:'load' })
  assert.equal(await noJsPage.getByRole('heading', {level:1}).count(), 1, 'One accessible home title without JS')
  await noJsPage.locator('.bn-at-nails').waitFor({state:'visible'})
  const noJsFooter = noJsPage.locator('.bn-at-foot')
  for (const service of services) assert.equal(await noJsFooter.locator(`a[href="/hizmetler/${service.slug}/"]`).isVisible(), true, `Visible no-JS service link: ${service.slug}`)
  assert.equal(await noJsFooter.locator('a[href="/iletisim/"]').isVisible(), true, 'Visible no-JS contact link')
  await inspectHomepageJournal(noJsPage, 'tr')
  await noJsPage.screenshot({path:resolve(output,`${label}-no-js-390.png`)})
  for (const locale of locales.filter(item => item !== 'tr')) {
    await noJsPage.goto(base + pageHref(locale), {waitUntil:'load'})
    await expectDocumentLanguage(noJsPage, locale)
    const title = await noJsPage.getByRole('heading', {level:1}).innerText()
    assert.ok(title.includes(translated(locale, 'Sıradanın')), 'Visible localized homepage heading without JS')
    await inspectHomepageJournal(noJsPage, locale)
    for (const service of services) {
      const path = pageHref(locale, `/hizmetler/${service.slug}/`)
      assert.equal(await noJsFooter.locator(`a[href="${path}"]`).isVisible(), true, `Visible localized service link without JS: ${path}`)
    }
  }
  const firstService = sourcePages.find(item => item.type === 'service').path
  await noJsPage.goto(base + firstService, {waitUntil:'load'})
  await openPicker(noJsPage, true)
  await noJsPage.locator('.sz-language:visible a[data-site-language="en"]').tap()
  await noJsPage.waitForURL(base + pageHref('en', firstService))
  await expectDocumentLanguage(noJsPage, 'en')
  assert.equal(await noJsPage.getByRole('heading', {level:1}).innerText(), localizedContent.en.services[0].title, 'Static service and language link work without JS')
  report.checks.push({type:'javascript-disabled',width:390,locales,homepages:true,homepageJournal:true,serviceLanguageLink:true,status:'PASS'})
  await noJs.close()
  console.log(`PASS ${engine}: seven homepages and equivalent static service links work without JavaScript`)

  await auditLanguagePreferences()
  report.checks.push({type:'browser-language-preferences',locales,firstRootVisit:true,directLinks:true,unsupportedFallback:true,status:'PASS'})
  console.log(`PASS ${engine}: browser locale on first root visit, unsupported fallback and unchanged direct links`)

  for (const width of widths) {
    const height = Number(process.env.QA_HEIGHT) || (width < 768 ? 844 : 1000)
    const context = await browser.newContext({locale:'tr-TR',viewport:{width,height},isMobile:width<768,hasTouch:width<768,deviceScaleFactor:1,reducedMotion:'reduce'})
    const page = await context.newPage()
    const errors = [], consoleErrors = [], failedRequests = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()) })
    page.on('response', response => { if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`) })
    await page.goto(base + '/', {waitUntil:'load'})
    await page.locator('.bn-header').waitFor({state:'attached'})
    await ready(page)
    await inspectLayout(page)
    await page.screenshot({path:resolve(output,`${label}-${width}-home.png`)})
    assert.equal(await page.getByRole('heading',{level:1}).count(),1,'One visible hydrated home heading')
    const variant = width < 768 ? 'mobile' : 'desktop'
    const booking = page.locator(width < 768 ? '.bn-at-hero-foot .bn-at-cta' : '.bn-hero__copy .bnx-appointment')
    await booking.click()
    await page.locator('.bn-form').waitFor({state:'visible'})
    await page.keyboard.press('Escape')
    assert.equal(await page.locator('.bn-form').count(),0,'Booking modal closes after hydration')
    await page.locator(width < 768 ? '.bn-at-nails > .bn-at-cta' : '.bn-service--nails .bn-button').click()
    await page.locator('.bn-modal [role="dialog"]').waitFor({state:'visible'})
    await page.keyboard.press('Escape')
    assert.equal(await page.locator('.bn-modal').count(),0,'Service modal remains functional')
    const gallery = page.locator(`.sz-gallery.sz-only-${variant}`)
    for (const [category,count] of [['French',3],['Sade',5],['Desenli',16],['Videolar',4],['İlham',6],['Tümü',8]]) {
      await gallery.getByRole('button',{name:category,exact:true}).click()
      assert.equal(await gallery.locator('.sz-shot').count(),count,category+' filter after hydration')
    }
    const opener = gallery.locator('.sz-shot').first()
    await opener.click()
    const lightbox = page.locator('.sz-lightbox[open]')
    await lightbox.waitFor()
    const first = await lightbox.locator('img').getAttribute('src')
    await lightbox.getByRole('button',{name:'Sonraki',exact:true}).click()
    assert.notEqual(await lightbox.locator('img').getAttribute('src'),first,'Gallery next image')
    await page.keyboard.press('Escape')
    assert.equal(await page.locator('.sz-lightbox[open]').count(),0,'Gallery closes')
    assert.equal(await opener.evaluate(element=>element===document.activeElement),true,'Gallery restores focus')
    assert.deepEqual(errors,[],'No hydration/page errors')
    assert.deepEqual(consoleErrors,[],'No hydration/console errors')
    report.checks.push({type:'hydrated-homepage',width,height,booking:true,serviceModal:true,gallery:true,noOverflow:true,status:'PASS'})

    const localizedLayouts = pages.filter(item => item.locale !== 'tr' && (
      width === 390 || ['en','de','ar'].includes(item.locale)
    ) && (['home','contact','journal'].includes(item.source.type) || [services[0].slug, legacyArticleSlug].includes(item.source.slug)
      || (width === 390 && localGuideSlugs.includes(item.source.slug))))
    const layoutPages = [...pages.filter(item => item.locale === 'tr' && item.path !== '/'), ...localizedLayouts]
    const localizedBookings = []
    for (const { path, locale, source, entry } of layoutPages) {
      const response = await page.goto(base + path,{waitUntil:'load'})
      assert.equal(response.status(),200,path+' renders directly')
      assert.equal(page.url(), base + path, path+' preserves direct address')
      await ready(page)
      await inspectLayout(page)
      await expectDocumentLanguage(page, locale)
      assert.equal(await page.getByRole('heading',{level:1}).count(),1,path+' has one visible H1')
      if (locale === 'ar') {
        assert.equal(await page.getByRole('heading',{level:1}).evaluate(element => getComputedStyle(element).direction), 'rtl', path+' displays RTL text')
      }
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),canonicalOrigin+path,path+' browser canonical')
      const title = await page.getByRole('heading',{level:1}).innerText()
      if (entry) assert.equal(title, entry.title, path+' displays the translated title')
      if (source.type === 'home') assert.ok(title.includes(translated(locale,'Sıradanın')), path+' displays the localized hero')
      if (locale === 'tr' || source.type === 'home') {
        const name=path.slice(1).replaceAll('/','-').replace(/-$/,'')
        await page.screenshot({path:resolve(output,`${label}-${width}-${name}.png`),fullPage:width===390 && locale === 'tr'})
      }
      if (source.type === 'home' && (width === 390 || (width === 1440 && ['en', 'ar'].includes(locale)))) {
        await auditLocalizedBooking(page, locale, width < 768)
        localizedBookings.push(locale)
      }
    }

    await page.goto(base + '/', {waitUntil:'load'})
    await selectLanguage(page, 'tr', 'ar', '/', width < 768)
    await ready(page)
    await inspectLayout(page)
    assert.equal(await page.evaluate(() => localStorage.getItem('sazi-language')), 'ar', 'Manual choice is saved')
    await page.goto(base + '/', {waitUntil:'load'})
    await page.waitForURL(base + pageHref('ar'), {waitUntil:'load'})
    await expectDocumentLanguage(page, 'ar')
    await page.goto(base + firstService, {waitUntil:'load'})
    assert.equal(page.url(), base + firstService, 'Manual preference does not replace a direct service URL')
    await expectDocumentLanguage(page, 'tr')
    await selectLanguage(page, 'tr', 'en', firstService, width < 768)
    await page.goto(base + '/', {waitUntil:'load'})
    await page.waitForURL(base + pageHref('en'), {waitUntil:'load'})
    await selectLanguage(page, 'en', 'tr', '/', width < 768)
    assert.equal(await page.evaluate(() => localStorage.getItem('sazi-language')), 'tr', 'Choosing Turkish replaces the saved preference')

    if (width === 390) {
      let current = 'tr'
      for (const next of ['ru', 'uz', 'tk']) {
        await selectLanguage(page, current, next, '/', true)
        assert.equal(await page.evaluate(() => localStorage.getItem('sazi-language')), next, 'Manual choice is saved for ' + next)
        await page.goto(base + '/', {waitUntil:'load'})
        await page.waitForURL(base + pageHref(next), {waitUntil:'load'})
        await expectDocumentLanguage(page, next)
        current = next
      }
    }

    assert.deepEqual(errors,[],'No route/page errors')
    assert.deepEqual(consoleErrors,[],'No browser console errors')
    assert.deepEqual(failedRequests,[],'No failed route or asset responses')
    report.checks.push({type:'route-layouts-and-language-picker',width,height,pages:layoutPages.length,images:true,manualPreference:true,localizedBookings,noOverflow:true,status:'PASS'})
    console.log(`PASS ${engine} ${width}x${height}: Turkish booking/service/gallery, ${layoutPages.length} route layouts, language selection and persistence${localizedBookings.length ? `, booking in ${localizedBookings.join(', ')}` : ''}`)
    await context.close()
  }
  report.status='PASS'
} catch (error) {
  report.status='FAIL'
  report.error=error.message
  throw error
} finally {
  report.finishedAt=new Date().toISOString()
  await writeFile(resolve(output,`${label}-report.json`),JSON.stringify(report,null,2))
  if (browser) await browser.close()
  await new Promise(resolveClosed=>server.close(resolveClosed))
}
