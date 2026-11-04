import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { chromium, webkit } from 'playwright'

const canonicalOrigin = 'https://www.sazibeauty.com'
const organizationId = canonicalOrigin + '/#organization'
const telephone = '+905011281808'
const dist = resolve('dist')
const output = resolve(process.env.QA_OUT || '../.sazi-seo-qa')
const engine = process.env.QA_ENGINE || 'chromium'
const label = process.env.QA_LABEL || engine
const widths = (process.env.QA_WIDTHS || '320,390,1440').split(',').map(Number)
const services = JSON.parse(await readFile('src/content/services-seo.json', 'utf8'))
const articles = JSON.parse(await readFile('src/content/journal.json', 'utf8'))
const expectedPaths = ['/', ...services.map(s => `/hizmetler/${s.slug}/`), '/iletisim/', '/bakim-rehberi/', ...articles.map(a => `/bakim-rehberi/${a.slug}/`)]
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
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
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
function checkNoInventedFacts(node) {
  if (!node || typeof node !== 'object') return
  for (const [key, value] of Object.entries(node)) {
    assert.ok(!['address','geo','openingHours','openingHoursSpecification','hasMap','review','reviews','aggregateRating','priceRange'].includes(key), `Unverified business field: ${key}`)
    checkNoInventedFacts(value)
  }
}
function inspectHtml(html, path) {
  const titles = [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)].map(match => decode(match[1]).trim())
  assert.equal(titles.length, 1, `${path}: one title`)
  assert.ok(titles[0].length >= 15 && titles[0].includes('Şazi Beauty'), `${path}: meaningful branded title`)
  const meta = tags(html, 'meta')
  const descriptions = meta.filter(item => item.name === 'description')
  assert.equal(descriptions.length, 1, `${path}: one description`)
  assert.ok(descriptions[0].content.length >= 40, `${path}: useful description`)
  const canonicals = tags(html, 'link').filter(item => item.rel === 'canonical')
  assert.equal(canonicals.length, 1, `${path}: one canonical`)
  assert.equal(canonicals[0].href, canonicalOrigin + path, `${path}: self canonical`)
  const robots = meta.filter(item => item.name === 'robots')
  assert.equal(robots.length, 1, `${path}: one robots directive`)
  assert.ok(/\bindex\b/.test(robots[0].content) && !/\b(?:noindex|nofollow)\b/.test(robots[0].content), `${path}: indexable HTML`)
  assert.match(html, /<html\b[^>]*\blang=["']tr["']/i, `${path}: Turkish language`)
  const text = bodyText(html)
  const minimum = path === '/' ? 1000 : path.startsWith('/hizmetler/') ? 700 : 300
  assert.ok(text.length >= minimum, `${path}: substantial initial text (${text.length})`)
  assert.ok(!html.includes('<div id="root"></div>'), `${path}: nonempty initial app HTML`)
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
  assert.ok(organization.contactPoint?.some(item => item.telephone === telephone), `${path}: consistent contact point`)
  checkNoInventedFacts(schema)
  if (path.startsWith('/hizmetler/')) assert.ok(schema['@graph'].some(item => item['@type'] === 'Service' && item.provider?.['@id'] === organizationId), `${path}: service entity`)
  if (articles.some(article => path === `/bakim-rehberi/${article.slug}/`)) {
    const article = schema['@graph'].find(item => item['@type'] === 'BlogPosting')
    assert.ok(article && article.author?.['@id'] === organizationId && article.publisher?.['@id'] === organizationId, `${path}: article entity links`)
  }
  return { path, title:titles[0], textLength:text.length, canonical:canonicals[0].href, schema:true }
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
    clipped:[...document.querySelectorAll('h1,h2,h3,.sz-section-intro,.sz-article-card-copy,.sz-reading-brand,.sz-pill-link,.sz-related-link,.sz-service-links')].filter(element => {
      const box=element.getBoundingClientRect()
      return !element.matches('.bn-sr,.sr-only') && box.width > 0 && (element.scrollWidth > element.clientWidth + 1 || box.right > innerWidth + 1 || box.left < -.5)
    }).map(element => ({class:element.className,text:element.textContent.slice(0,80)}))
  }))
  assert.ok(result.scroll <= result.width, `Horizontal overflow: ${JSON.stringify(result)}`)
  assert.deepEqual(result.missingImages, [], 'No missing visible images')
  assert.deepEqual(result.clipped, [], 'No clipped content or links')
  return result
}

try {
  browser = await (engine === 'webkit' ? webkit : chromium).launch({ headless:true })
  const audit = await browser.newContext()
  const sitemapResponse = await audit.request.get(base + '/sitemap.xml')
  assert.equal(sitemapResponse.status(), 200, 'Sitemap HTTP status')
  const sitemap = await sitemapResponse.text()
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1]))
  assert.equal(sitemapUrls.length, 10, 'Ten sitemap URLs')
  assert.deepEqual([...new Set(sitemapUrls)].sort(), expectedPaths.map(path => canonicalOrigin + path).sort(), 'Exact canonical sitemap inventory')
  const rawPages = []
  for (const path of expectedPaths) {
    const response = await audit.request.get(base + path)
    assert.equal(response.status(), 200, `${path}: raw HTTP status`)
    assert.match(response.headers()['content-type'] || '', /text\/html/i, `${path}: HTML response`)
    if (new URL(base).hostname === 'www.sazibeauty.com') assert.ok(!/noindex/i.test(response.headers()['x-robots-tag'] || ''), `${path}: production response indexable`)
    const html = await response.text()
    rawPages.push(inspectHtml(html, path))
    if (path === '/') {
      const hrefs = tags(html, 'a').map(item => item.href)
      for (const service of services) assert.ok(hrefs.includes(`/hizmetler/${service.slug}/`) || hrefs.includes(canonicalOrigin + `/hizmetler/${service.slug}/`), `Raw homepage links to ${service.slug}`)
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
  console.log(`PASS ${engine}: 10 raw HTML pages, canonicals, descriptions, indexable robots, unified graphs and verified entity`)

  const noJs = await browser.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, javaScriptEnabled:false, reducedMotion:'reduce' })
  const noJsPage = await noJs.newPage()
  await noJsPage.goto(base + '/', { waitUntil:'load' })
  assert.equal(await noJsPage.getByRole('heading', {level:1}).count(), 1, 'One accessible home title without JS')
  await noJsPage.locator('.bn-at-nails').waitFor({state:'visible'})
  const noJsFooter = noJsPage.locator('.bn-at-foot')
  for (const service of services) assert.equal(await noJsFooter.locator(`a[href="/hizmetler/${service.slug}/"]`).isVisible(), true, `Visible no-JS service link: ${service.slug}`)
  assert.equal(await noJsFooter.locator('a[href="/iletisim/"]').isVisible(), true, 'Visible no-JS contact link')
  await noJsPage.screenshot({path:resolve(output,`${label}-no-js-390.png`)})
  report.checks.push({type:'javascript-disabled-homepage',width:390,title:true,services:true,footerLinks:true,status:'PASS'})
  await noJs.close()
  console.log(`PASS ${engine}: homepage title, services and footer links render without JavaScript`)

  for (const width of widths) {
    const height = Number(process.env.QA_HEIGHT) || (width < 768 ? 844 : 1000)
    const context = await browser.newContext({viewport:{width,height},isMobile:width<768,hasTouch:width<768,deviceScaleFactor:1,reducedMotion:'reduce'})
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
    for (const [category,count] of [['Tırnak',3],['Kirpik',1],['Makyaj',2],['Tümü',6]]) {
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

    for (const path of expectedPaths.filter(path=>path!='/')) {
      const response = await page.goto(base + path,{waitUntil:'load'})
      assert.equal(response.status(),200,path+' renders directly')
      await ready(page)
      await inspectLayout(page)
      assert.equal(await page.getByRole('heading',{level:1}).count(),1,path+' has one visible H1')
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),canonicalOrigin+path,path+' browser canonical')
      const name=path.slice(1).replaceAll('/','-').replace(/-$/,'')
      await page.screenshot({path:resolve(output,`${label}-${width}-${name}.png`),fullPage:width===390})
    }
    assert.deepEqual(errors,[],'No route/page errors')
    assert.deepEqual(consoleErrors,[],'No browser console errors')
    assert.deepEqual(failedRequests,[],'No failed route or asset responses')
    report.checks.push({type:'all-route-layouts',width,height,pages:expectedPaths.length-1,images:true,noOverflow:true,status:'PASS'})
    console.log(`PASS ${engine} ${width}x${height}: hydrated booking/service/gallery, 9 static routes, no overflow, images or console errors`)
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
