import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { resolve, extname } from 'node:path'
import { chromium, webkit } from 'playwright'

const out = resolve(process.env.QA_OUT || '../.sazi-live-repair-qa')
const label = process.env.QA_LABEL || 'after'
const baseline = label.includes('before')
await mkdir(out, { recursive: true })
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.webp':'image/webp', '.png':'image/png', '.svg':'image/svg+xml', '.ttf':'font/ttf' }
const dist = resolve('dist')
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    const file = resolve(dist, '.' + (path.endsWith('/') ? path+'index.html' : path))
    if (!file.startsWith(dist + '/') && !file.startsWith(dist + '\\')) throw new Error('Invalid path')
    const data = await readFile(file)
    res.writeHead(200, { 'Content-Type':types[extname(file)] || 'application/octet-stream' })
    res.end(data)
  } catch {
    res.writeHead(404); res.end('Not found')
  }
})
await new Promise(r => server.listen(0, '127.0.0.1', r))
const base = process.env.QA_URL || `http://127.0.0.1:${server.address().port}`
const engine = process.env.QA_ENGINE || 'chromium'
const browser = await (engine === 'webkit' ? webkit : chromium).launch({ headless: true })
const widths = (process.env.QA_WIDTHS || '320,360,390,430,767,768,1024,1440').split(',').map(Number)
const reports = []
try {
  for (const width of widths) {
    const height = Number(process.env.QA_HEIGHT) || (width < 768 ? 844 : 1000)
    const context = await browser.newContext({ viewport:{ width, height }, isMobile:width < 768, hasTouch:width < 768, deviceScaleFactor:1, reducedMotion:'reduce' })
    const page = await context.newPage()
    const errors = []
    const failed = []
    page.on('pageerror', e => { errors.push(e.message); console.error(`RUNTIME ${engine}: ${e.message}`) })
    page.on('response', r => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`) })
    await page.goto(base, { waitUntil:'load' })
    await page.locator('.bn-header').waitFor({ state:'attached', timeout:15000 })
    await page.evaluate(async () => {
      await document.fonts.ready
      await Promise.all([...document.images].map(i => { i.loading='eager'; return i.decode().catch(() => null) }))
      document.querySelectorAll('.bn-at-reveal').forEach(e => e.classList.add('is-in'))
      document.getAnimations().forEach(a => { a.pause(); a.currentTime=1000 })
    })
    const metrics = await page.evaluate(() => {
      const box = el => { const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,bottom:r.bottom} }
      const q = s => { const e=document.querySelector(s);return e?box(e):null }
      const selectors = '.bn-at-title,.bn-at-name,.bn-at-lash-title,.bn-at-book-title,.bn-at-cta,.bn-at-pair li,.bn-at-trust li,.bn-header .bn-wordmark,.sz-gallery-toolbar,.sz-shot-caption,.sz-article-card-copy'
      return { width:innerWidth,scroll:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,
        header:q('.bn-header'),hero:q('.bn-at-hero'),title:q('.bn-at-title'),portrait:q('.bn-at-portrait'),copy:q('.bn-at-hero-foot p'),cta:q('.bn-at-hero-foot .bn-at-cta'),
        trust:[...document.querySelectorAll('.bn-at-trust li')].map(box),
        clipped:[...document.querySelectorAll(selectors)].filter(e => e.getClientRects().length && (e.scrollWidth>e.clientWidth+1 || e.getBoundingClientRect().right>innerWidth+1 || e.getBoundingClientRect().left<-.5)).map(e => ({class:e.className,...box(e),scroll:e.scrollWidth,client:e.clientWidth})),
        images:[...document.images].filter(i => i.getClientRects().length).map(i => ({src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>0})),
        sections:[...document.querySelectorAll('.sazi-mobile-v3>section')].map(e => ({class:e.className,...box(e)})) }
    })
    await page.screenshot({ path:resolve(out,`${label}-${width}.png`), fullPage:true })
    if (!baseline) {
      assert.equal(metrics.scroll,width,`Horizontal overflow at ${width}`)
      assert.deepEqual(metrics.clipped,[],`Clipped text or controls at ${width}`)
      assert.ok(metrics.images.every(i => i.ok),`Missing image at ${width}`)
      if (width < 768) {
        assert.ok(metrics.copy.y >= metrics.portrait.bottom,`Hero text overlaps portrait at ${width}`)
        assert.ok(metrics.cta.w > 130,`Hero CTA squeezed at ${width}`)
        if (height >= 640) assert.ok(metrics.cta.bottom < height,`Hero CTA below the first viewport at ${width}`)
        assert.equal(new Set(metrics.trust.map(t => t.h)).size,1,'Uneven trust columns')
        const toggle = page.locator('.bn-menu-toggle')
        await toggle.click()
        const menu = page.locator('.bn-menu')
        await menu.waitFor({state:'visible'})
        const menuBox = await menu.boundingBox()
        assert.ok(menuBox.y >= metrics.header.bottom && menuBox.y+menuBox.height<=height,'Menu outside viewport')
        await menu.locator('a[href="#hizmetler"]').click()
        await menu.waitFor({state:'hidden'})
        const anchor = await page.locator('[data-at-anchor="hizmetler"]').boundingBox()
        assert.ok(anchor.y >= metrics.header.h-2 && anchor.y <= metrics.header.h+24,'Service navigation lands under header')
        await page.locator('.bn-at-nails > .bn-at-cta').click()
        await page.locator('.bn-modal [role="dialog"]').waitFor({state:'visible'})
        await page.locator('.bn-modal__close').click()
        await page.evaluate(() => scrollTo(0,0))
        await page.locator('.bn-at-hero-foot .bn-at-cta').click()
        await page.locator('.bn-form').waitFor()
        const modal = await page.locator('.bn-modal__panel').boundingBox()
        assert.ok(modal.x >= 0 && modal.x+modal.width <= width+1 && modal.y>=0 && modal.y+modal.height<=height+1,'Booking panel outside viewport')
        await page.locator('.bn-form button[type="submit"]').click()
        assert.equal(await page.locator('.bn-field-error').count(),3,'Required booking validation')
        await page.locator('.bn-form [name="service"]').first().check()
        await page.locator('.bn-form [name="name"]').fill('Mobil arayüz testi')
        await page.locator('.bn-form [name="phone"]').fill('05000000000')
        await page.evaluate(() => { window.open = url => { window.__qaDraft=url; return null } })
        await page.locator('.bn-form button[type="submit"]').click()
        const draft = await page.evaluate(() => window.__qaDraft)
        assert.ok(/^https:\/\/wa\.me\/905011281808\?text=/.test(draft),'WhatsApp draft target')
        await page.locator('.bn-modal__close').click()
        await page.locator('.sazi-mobile-v3 .sz-shot').first().click()
        await page.locator('.sz-lightbox[open]').waitFor()
        await page.getByRole('button',{name:'Sonraki',exact:true}).click()
        await page.keyboard.press('Escape')
        assert.equal(await page.locator('.sz-lightbox[open]').count(),0,'Gallery closes')
        await page.goto(base+'/#hizmetler')
        await page.evaluate(() => document.fonts.ready)
        await page.waitForTimeout(100)
        const directAnchor = await page.locator('[data-at-anchor="hizmetler"]').boundingBox()
        assert.ok(directAnchor.y >= metrics.header.h-2 && directAnchor.y <= metrics.header.h+24,'Direct mobile hash links')
        if (width === 390) {
          await page.emulateMedia({ reducedMotion:'no-preference' })
          await page.locator('.bn-at-book').scrollIntoViewIfNeeded()
          await page.waitForFunction(() => document.querySelector('.bn-at-orb')?.getAttribute('data-paused') === 'false')
          await page.emulateMedia({ reducedMotion:'reduce' })
          await page.waitForFunction(() => document.querySelector('.bn-at-orb')?.getAttribute('data-paused') === 'true')
          await page.emulateMedia({ reducedMotion:'no-preference' })
          await page.waitForFunction(() => document.querySelector('.bn-at-orb')?.getAttribute('data-paused') === 'false')
        }
      }
      assert.deepEqual(errors,[],'Browser runtime errors')
      assert.deepEqual(failed,[],'HTTP errors')
    }
    reports.push({ ...metrics, errors, failed, result:baseline?'BASELINE':'PASS' })
    console.log(`${baseline?'BASELINE':'PASS'} ${engine} ${width}x${height}: page=${metrics.scroll}px; hero=${metrics.hero?.h}px; CTA=${metrics.cta?.bottom}px; clipped=${metrics.clipped.length}; errors=${errors.length+failed.length}`)
    await context.close()
  }
} finally {
  await writeFile(resolve(out,`${label}-report.json`),JSON.stringify(reports,null,2))
  await browser.close()
  server.close()
}
