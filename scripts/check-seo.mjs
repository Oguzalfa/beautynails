import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { resolve, sep } from 'node:path'

// Inspect the files a crawler actually receives, independently of the renderer.
const origin = 'https://www.beautynails.com.tr'
const languages = ['tr', 'en', 'de', 'ru', 'ar', 'uz', 'tk']
const routeGroups = [
  { kind: 'home', tr: '/', en: '/en/', de: '/de/', ru: '/ru/', uz: '/uz/', tk: '/tk/' },
  { kind: 'index', tr: '/hizmetler/', en: '/en/services/', de: '/de/leistungen/', ru: '/ru/uslugi/', uz: '/uz/xizmatlar/', tk: '/tk/hyzmatlar/' },
  {
    kind: 'service',
    tr: '/hizmetler/protez-tirnak/',
    en: '/en/services/nail-extensions/',
    de: '/de/leistungen/nagelverlaengerung/',
    ru: '/ru/uslugi/narashchivanie-nogtei/',
    uz: '/uz/xizmatlar/tirnoq-uzaytirish/',
    tk: '/tk/hyzmatlar/dyrnak-uzaltmak/',
  },
  {
    kind: 'service',
    tr: '/hizmetler/tirnak-sanati/',
    en: '/en/services/nail-art/',
    de: '/de/leistungen/nageldesign/',
    ru: '/ru/uslugi/dizain-nogtei/',
    uz: '/uz/xizmatlar/tirnoq-dizayni/',
    tk: '/tk/hyzmatlar/dyrnak-sungaty/',
  },
  {
    kind: 'service',
    tr: '/hizmetler/ipek-kirpik/',
    en: '/en/services/eyelash-extensions/',
    de: '/de/leistungen/seidenwimpern/',
    ru: '/ru/uslugi/narashchivanie-resnits/',
    uz: '/uz/xizmatlar/ipak-kipriklar/',
    tk: '/tk/hyzmatlar/kirpik-uzaltmak/',
  },
  {
    kind: 'service',
    tr: '/hizmetler/kalici-makyaj/',
    en: '/en/services/permanent-makeup/',
    de: '/de/leistungen/permanent-make-up/',
    ru: '/ru/uslugi/permanentnyi-makiyazh/',
    uz: '/uz/xizmatlar/doimiy-makiyaj/',
    tk: '/tk/hyzmatlar/hemiselik-makiyaz/',
  },
  {
    kind: 'service',
    tr: '/hizmetler/erkek-manikur-pedikur/',
    en: '/en/services/mens-manicure-pedicure/',
    de: '/de/leistungen/herren-manikuere-pedikuere/',
    ru: '/ru/uslugi/muzhskoi-manikyur-i-pedikyur/',
    uz: '/uz/xizmatlar/erkaklar-manikyur-pedikyur/',
    tk: '/tk/hyzmatlar/erkek-manikyur-pedikyur/',
  },
  { kind: 'index', tr: '/yazilar/', en: '/en/journal/', de: '/de/magazin/', ru: '/ru/stati/', uz: '/uz/maqolalar/', tk: '/tk/yazgylar/' },
  {
    kind: 'article',
    tr: '/yazilar/tirnak-sekli/',
    en: '/en/journal/nail-shape/',
    de: '/de/magazin/nagelform-waehlen/',
    ru: '/ru/stati/kak-vybrat-formu-nogtei/',
    uz: '/uz/maqolalar/tirnoq-shaklini-tanlash/',
    tk: '/tk/yazgylar/dyrnak-gornusi/',
  },
  {
    kind: 'article',
    tr: '/yazilar/kirpik-ifadesi/',
    en: '/en/journal/lash-style/',
    de: '/de/magazin/persoenlicher-wimpernlook/',
    ru: '/ru/stati/vyrazitelnost-resnits/',
    uz: '/uz/maqolalar/kiprik-uslubi/',
    tk: '/tk/yazgylar/kirpik-gornusi/',
  },
  {
    kind: 'article',
    tr: '/yazilar/erkek-bakimi/',
    en: '/en/journal/mens-grooming/',
    de: '/de/magazin/dezente-herrenpflege/',
    ru: '/ru/stati/muzhskoi-ukhod/',
    uz: '/uz/maqolalar/erkaklar-parvarishi/',
    tk: '/tk/yazgylar/erkek-idegi/',
  },
  {
    kind: 'article',
    tr: '/yazilar/maltepe-tirnak-randevu-rehberi/',
    en: '/en/journal/maltepe-nail-appointment/',
    de: '/de/magazin/maltepe-nageltermin/',
    ru: '/ru/stati/maltepe-zapis-na-manikyur/',
    uz: '/uz/maqolalar/maltepe-tirnoq-qabuli/',
    tk: '/tk/yazgylar/maltepe-dyrnak-wagty/',
  },
  {
    kind: 'article',
    tr: '/yazilar/maltepe-ipek-kirpik-randevu-rehberi/',
    en: '/en/journal/maltepe-lash-appointment/',
    de: '/de/magazin/maltepe-wimperntermin/',
    ru: '/ru/stati/maltepe-zapis-na-resnitsy/',
    uz: '/uz/maqolalar/maltepe-kiprik-qabuli/',
    tk: '/tk/yazgylar/maltepe-kirpik-wagty/',
  },
].map((group) => ({ ...group, ar: group.en.replace('/en/', '/ar/') }))
const routes = new Map(routeGroups.flatMap(({ kind, ...paths }) =>
  languages.map((language) => [paths[language], { kind, language, paths }])))
assert.equal(routes.size, 91, 'seven languages with thirteen distinct routes each')
const dist = resolve('dist')
const decode = (value) => value.replace(/&(amp|quot|apos|lt|gt|#39);/g, (_, key) => ({
  amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', '#39': "'",
})[key])
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([^\s=<>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)]
  .map((match) => [match[1].toLowerCase(), decode(match[2] ?? match[3])]))
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((match) => attributes(match[0]))
const withoutScripts = (html) => html.replace(/<script\b[\s\S]*?<\/script>/gi, '')
const text = (html) => decode(withoutScripts(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
const pageFile = (path) => path === '/' ? 'dist/index.html' : `dist${path}index.html`
const titles = new Set()
const descriptions = new Set()
const links = new Map()
const checkedAssets = new Set()

async function checkAsset(value, pagePath) {
  if (!value || /^(?:data:|blob:)/i.test(value)) return
  const url = new URL(value, origin + pagePath)
  if (url.origin !== origin) return
  const file = resolve(dist, decodeURIComponent(url.pathname).replace(/^\/+/, ''))
  assert.ok(file.startsWith(dist + sep), `${pagePath}: resource must stay inside dist`)
  if (checkedAssets.has(file)) return
  assert.ok((await stat(file)).isFile(), `${pagePath}: missing resource ${url.pathname}`)
  checkedAssets.add(file)
}

function checkNoInventedBusinessFields(value, pagePath) {
  if (!value || typeof value !== 'object') return
  // Update this guard only after the corresponding business facts are verified.
  const unverified = new Set(['address', 'geo', 'openingHours', 'openingHoursSpecification',
    'aggregateRating', 'review', 'priceRange', 'price', 'datePublished', 'dateModified'])
  for (const [key, child] of Object.entries(value)) {
    assert.ok(!unverified.has(key), `${pagePath}: unverified structured-data field ${key}`)
    checkNoInventedBusinessFields(child, pagePath)
  }
}

for (const [path, { kind, language, paths }] of routes) {
  const html = await readFile(pageFile(path), 'utf8')
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1]
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1]
  assert.ok(head, `${path}: valid head required`)
  assert.ok(body, `${path}: full HTML body required`)
  assert.equal(tags(html, 'html')[0]?.lang, language, `${path}: correct document language`)
  assert.equal(tags(html, 'html')[0]?.dir, language === 'ar' ? 'rtl' : 'ltr', `${path}: correct reading direction`)
  const title = [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)]
  assert.equal(title.length, 1, `${path}: exactly one title`)
  assert.match(text(title[0][1]), /BeautyNails/)
  titles.add(text(title[0][1]))
  const meta = tags(head, 'meta')
  const description = meta.filter((item) => item.name === 'description')
  assert.equal(description.length, 1, `${path}: exactly one description`)
  assert.ok(description[0].content?.length > 40, `${path}: descriptive summary required`)
  descriptions.add(description[0].content)
  const headLinks = tags(head, 'link')
  const canonical = headLinks.filter((item) => item.rel === 'canonical')
  assert.deepEqual(canonical.map((item) => item.href), [origin + path], `${path}: exact preferred canonical`)
  const alternates = headLinks.filter((item) => item.rel === 'alternate' && item.hreflang !== undefined)
  assert.equal(alternates.length, languages.length + 1, `${path}: one hreflang per language and the default`)
  const expectedAlternates = Object.fromEntries([
    ...languages.map((choice) => [choice, origin + paths[choice]]),
    ['x-default', origin + paths.tr],
  ])
  assert.deepEqual(Object.fromEntries(alternates.map((item) => [item.hreflang, item.href])),
    expectedAlternates, `${path}: reciprocal language group, including the Turkish x-default`)
  const robots = meta.filter((item) => item.name === 'robots')
  assert.equal(robots.length, 1, `${path}: one robots directive`)
  assert.ok(robots[0].content.split(/\s*,\s*/).includes('index'), `${path}: indexable HTML`)
  assert.doesNotMatch(robots[0].content, /noindex/i)
  assert.equal(meta.find((item) => item.property === 'og:url')?.content, origin + path)
  const verification = meta.filter((item) => item.name === 'google-site-verification')
  assert.ok(verification.length <= 1, `${path}: at most one verification tag`)
  for (const item of verification) {
    assert.match(item.content, /^[a-zA-Z0-9_-]+$/)
    assert.doesNotMatch(item.content, /placeholder|todo|your[_-]?token/i)
  }
  const visibleHtml = withoutScripts(body)
  const visibleText = text(visibleHtml)
  assert.equal([...visibleHtml.matchAll(/<h1(?:\s|>)/gi)].length, 1, `${path}: one server-rendered H1`)
  assert.match(visibleHtml, /data-prerendered="true"/)
  assert.doesNotMatch(visibleHtml, /<div\s+id="root"[^>]*>\s*<\/div>/i)
  assert.doesNotMatch(html, /şazi|sazibeauty/i, `${path}: correct business identity`)
  assert.ok(visibleText.includes('0532 242 23 03'), `${path}: verified contact is visible`)
  if (kind === 'article' || kind === 'service') {
    const story = visibleHtml.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1]
    assert.ok(story, `${path}: primary content article is server-rendered`)
    assert.ok(tags(story, 'h2').length >= 4, `${path}: all detail sections must be rendered`)
    const minimumWords = kind === 'article' ? 200 : 120
    assert.ok(text(story).split(/\s+/).length > minimumWords, `${path}: full detail text must exist without JavaScript`)
  }

  const scripts = [...head.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((match) => attributes(match[1]).type === 'application/ld+json')
  assert.equal(scripts.length, 1, `${path}: one JSON-LD graph`)
  const schema = JSON.parse(scripts[0][2])
  assert.equal(schema['@context'], 'https://schema.org')
  assert.ok(Array.isArray(schema['@graph']))
  checkNoInventedBusinessFields(schema, path)
  const graph = schema['@graph']
  const type = (value, expected) => (Array.isArray(value['@type']) ? value['@type'] : [value['@type']]).includes(expected)
  const org = graph.find((node) => type(node, 'Organization'))
  assert.ok(org, `${path}: identifiable publisher`)
  assert.equal(org.name, 'BeautyNails')
  assert.equal(org.url, origin + '/')
  assert.equal(org.telephone, '+905322422303')
  assert.ok(graph.some((node) => type(node, 'WebSite') && node.url === origin + '/'))
  const page = graph.find((node) => type(node, kind === 'index' ? 'CollectionPage' : 'WebPage'))
  assert.equal(page?.url, origin + path, `${path}: page entity matches canonical`)
  assert.equal(page?.inLanguage, language, `${path}: page entity matches document language`)
  if (kind !== 'home') {
    const crumbs = graph.find((node) => type(node, 'BreadcrumbList'))?.itemListElement
    assert.ok(crumbs?.length >= 2, `${path}: breadcrumbs required`)
    assert.equal(crumbs.at(-1).item, origin + path)
    crumbs.forEach((item, index) => assert.equal(item.position, index + 1))
  }
  if (kind === 'service') assert.ok(graph.some((node) => type(node, 'Service') && node.url === origin + path))
  if (kind === 'article') {
    const article = graph.find((node) => type(node, 'Article'))
    assert.ok(article?.headline && visibleText.includes(article.headline), `${path}: article headline is visible`)
    assert.equal(article.inLanguage, language, `${path}: article entity matches document language`)
    assert.equal(article.mainEntityOfPage?.['@id'], page['@id'])
    assert.equal(article.publisher?.['@id'], org['@id'])
  }
  if (kind === 'index') assert.ok(graph.some((node) => type(node, 'ItemList') && node.itemListElement?.length >= 3))

  const localLinks = []
  const languageLinks = new Map()
  for (const anchor of tags(visibleHtml, 'a')) {
    if (!anchor.href || /^(?:mailto:|tel:|javascript:)/i.test(anchor.href)) continue
    const target = new URL(anchor.href, origin + path)
    if (target.origin !== origin) continue
    const targetPath = target.pathname === '/' ? '/' : `${target.pathname.replace(/\/+$/, '')}/`
    assert.ok(routes.has(targetPath), `${path}: broken internal link ${anchor.href}`)
    localLinks.push(targetPath)
    if (anchor.hreflang) {
      const targets = languageLinks.get(anchor.hreflang) ?? new Set()
      targets.add(targetPath)
      languageLinks.set(anchor.hreflang, targets)
    }
  }
  for (const choice of languages) {
    if (choice === language) continue
    assert.ok(languageLinks.get(choice)?.has(paths[choice]),
      `${path}: body language link to ${paths[choice]} required`)
  }
  links.set(path, localLinks)
  for (const tag of ['script', 'link', 'img', 'source']) for (const resource of tags(html, tag)) {
    if (resource.src) await checkAsset(resource.src, path)
    if (tag === 'link' && resource.href && !['canonical', 'alternate'].includes(resource.rel)) {
      await checkAsset(resource.href, path)
    }
    if (resource.srcset) for (const candidate of resource.srcset.split(',')) await checkAsset(candidate.trim().split(/\s+/)[0], path)
  }
  for (const item of meta.filter((entry) => entry.property === 'og:image' || entry.name === 'twitter:image')) await checkAsset(item.content, path)
}

assert.equal(titles.size, routes.size, 'each page needs a unique title')
assert.equal(descriptions.size, routes.size, 'each page needs a unique description')
const visited = new Set(['/'])
const queue = ['/']
while (queue.length) for (const target of links.get(queue.shift()) ?? []) if (!visited.has(target)) {
  visited.add(target); queue.push(target)
}
assert.equal(visited.size, routes.size, 'every page is discoverable from the homepage through real links')
const sitemap = await readFile('dist/sitemap.xml', 'utf8')
assert.match(sitemap, /xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/)
const locations = [...sitemap.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((match) => decode(match[1]))
assert.equal(new Set(locations).size, routes.size, 'no duplicate sitemap entries')
assert.deepEqual(locations.sort(), [...routes.keys()].map((path) => origin + path).sort(), 'sitemap matches canonical page set')
const robots = await readFile('dist/robots.txt', 'utf8')
assert.match(robots, /^User-agent:\s*\*/m)
assert.match(robots, /^Allow:\s*\/$/m)
assert.doesNotMatch(robots, /^Disallow:\s*\/(?:\s|$)/m)
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`))
const missing = await readFile('dist/404.html', 'utf8')
assert.ok(tags(missing, 'meta').some((item) => item.name === 'robots' && /\bnoindex\b/i.test(item.content)))
assert.ok(!tags(missing, 'link').some((item) => item.rel === 'canonical'))
assert.ok(!tags(missing, 'link').some((item) => item.rel === 'alternate' && item.hreflang))
assert.match(text(missing), /Sayfa bulunamadı/)
assert.equal([...withoutScripts(missing).matchAll(/<h1(?:\s|>)/gi)].length, 1)

// These are deployment rules; actual HTTP status/headers still require live checks.
const hosting = JSON.parse(await readFile('vercel.json', 'utf8'))
const noindexRules = (hosting.headers ?? []).filter((rule) => rule.headers?.some((item) => item.key.toLowerCase() === 'x-robots-tag' && /noindex/i.test(item.value)))
assert.ok(noindexRules.length, 'Vercel aliases must be excluded from indexing')
for (const rule of noindexRules) {
  const host = rule.has?.find((condition) => condition.type === 'host')
  assert.ok(host, 'noindex must be host-scoped, never global')
  const pattern = new RegExp(host.value)
  assert.ok(pattern.test('beautynails-three.vercel.app'))
  assert.ok(!pattern.test('www.beautynails.com.tr'), 'the custom domain must remain indexable')
}
assert.ok(!(hosting.rewrites ?? []).some((rule) => /index\.html$/.test(rule.destination)), 'unknown routes must not fall back to a 200 homepage')
console.log(`SEO acceptance passed: ${routes.size} prerendered pages in ${languages.length} languages, reciprocal hreflang, language links, self-canonicals, unique metadata, localized truthful JSON-LD, full text, ${checkedAssets.size} local assets, sitemap, robots, 404 and alias exclusion.`)
