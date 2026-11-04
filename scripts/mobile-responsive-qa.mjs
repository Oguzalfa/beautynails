import { createServer } from 'node:http'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { chromium, webkit } from 'playwright'

const dist = resolve('dist')
const output = resolve(process.env.QA_OUT || '../.sazi-mobile-complete-qa')
const engine = process.env.QA_ENGINE || 'chromium'
const label = process.env.QA_LABEL || engine
const dimensions = process.env.QA_CASES || '320x844,360x844,375x844,390x844,414x844,430x844,600x960,767x1000,768x1024,820x1180,1024x1366,844x390,390x600'
const cases = dimensions.split(',').map(value => {
  const [width, height] = value.split('x').map(Number)
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 240 || height < 240) throw new Error('Invalid QA_CASES')
  return { width, height }
})
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.ttf':'font/ttf', '.woff2':'font/woff2' }
await mkdir(output, { recursive:true })
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    const file = resolve(dist, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname))
    if (!file.startsWith(dist + sep)) throw new Error('Invalid path')
    const data = await readFile(file)
    res.writeHead(200, { 'Content-Type':types[extname(file)] || 'application/octet-stream' })
    res.end(data)
  } catch {
    res.writeHead(404)
    res.end('Not found')
  }
})
await new Promise(done => server.listen(0, '127.0.0.1', done))
const base = (process.env.QA_URL || `http://127.0.0.1:${server.address().port}`).replace(/\/$/, '')
const report = { base, engine, physicalDevice:false, startedAt:new Date().toISOString(), cases:[], status:'RUNNING' }
let browser

async function ready(page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map(image => { image.loading = 'eager'; return image.decode().catch(() => null) }))
    document.querySelectorAll('.bn-at-reveal').forEach(element => element.classList.add('is-in'))
    document.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = 1000 })
  })
}

async function bounds(page) {
  return page.evaluate(() => {
    const visible = element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden'
    const selectors = 'h1,h2,h3,.bn-at-title,.bn-at-name,.bn-at-lash-title,.bn-at-book-title,.bn-at-cta,.bn-at-pair li,.bn-at-trust li,.bn-header .bn-wordmark,.sz-gallery-toolbar,.sz-shot-caption,.sz-article-card-copy,.sz-service-links'
    const clipped = [...document.querySelectorAll(selectors)].filter(element => {
      if (!visible(element) || element.matches('.bn-sr,.sr-only') || element.closest('dialog:not([open])')) return false
      const rect = element.getBoundingClientRect()
      return element.scrollWidth > element.clientWidth + 1 || rect.right > innerWidth + 1 || rect.left < -1
    }).map(element => ({ selector:element.className || element.tagName, text:element.textContent.trim().slice(0, 80), width:element.clientWidth, scroll:element.scrollWidth }))
    return {
      width:innerWidth,
      scrollWidth:document.documentElement.scrollWidth,
      clipped,
      brokenImages:[...document.images].filter(image => visible(image) && (!image.complete || !image.naturalWidth)).map(image => image.getAttribute('src')),
      visibleFooters:[...document.querySelectorAll('footer')].filter(visible).map(element => element.className),
      headingCount:[...document.querySelectorAll('h1')].filter(visible).length,
    }
  })
}

try {
  browser = await (engine === 'webkit' ? webkit : chromium).launch({ headless:true })
  for (const { width, height } of cases) {
    const context = await browser.newContext({ viewport:{width,height}, isMobile:true, hasTouch:true, deviceScaleFactor:1, reducedMotion:'reduce' })
    const page = await context.newPage()
    page.setDefaultTimeout(10000)
    const entry = { width, height, checks:[], issues:[] }
    const pageErrors = [], consoleErrors = [], failedResponses = []
    page.on('pageerror', error => pageErrors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()) })
    page.on('response', response => { if (response.status() >= 400) failedResponses.push(response.status() + ' ' + response.url()) })
    const expect = (condition, message, evidence) => {
      entry.checks.push({ name:message, status:condition?'PASS':'FAIL' })
      if (!condition) entry.issues.push({ message, evidence })
    }
    try {
      await page.goto(base + '/', {waitUntil:'load'})
      await page.locator('.bn-header').waitFor({state:'attached'})
      await ready(page)
      entry.layout = await bounds(page)
      expect(entry.layout.scrollWidth === width, 'No horizontal page overflow', entry.layout.scrollWidth)
      expect(entry.layout.clipped.length === 0, 'No clipped headings, descriptions or CTA', entry.layout.clipped)
      expect(entry.layout.brokenImages.length === 0, 'Visible images load', entry.layout.brokenImages)
      expect(entry.layout.visibleFooters.length === 1, 'One visible contact footer at every breakpoint', entry.layout.visibleFooters)
      expect(entry.layout.headingCount === 1, 'One visible page heading', entry.layout.headingCount)
      await page.screenshot({path:resolve(output, `${label}-${width}x${height}-home.png`), fullPage:width===390&&height===844})

      const toggle = page.locator('.bn-menu-toggle')
      if (await toggle.isVisible()) {
        const toggleBox = await toggle.boundingBox()
        expect(toggleBox.width >= 44 && toggleBox.height >= 44, 'Menu touch target at least 44px', toggleBox)
        await toggle.tap()
        const menu = page.locator('.bn-menu')
        await menu.waitFor({state:'visible'})
        expect(await toggle.getAttribute('aria-expanded') === 'true', 'Menu announces expanded state')
        expect(await menu.evaluate(element => element.contains(document.activeElement)), 'Menu receives keyboard focus')
        const menuBox = await menu.boundingBox()
        expect(menuBox.x >= 0 && menuBox.x+menuBox.width <= width+1 && menuBox.y >= 0 && menuBox.y+menuBox.height <= height+1, 'Open menu fits viewport', menuBox)
        await page.keyboard.press('Escape')
        expect(!(await menu.isVisible()), 'Escape closes menu')
        expect(await toggle.evaluate(element => element === document.activeElement), 'Menu restores focus')
        await toggle.tap()
        await menu.locator('a[href="#hizmetler"]').tap()
        expect(!(await menu.isVisible()), 'Service link closes menu')
        const anchor = page.locator(width < 768 ? '[data-at-anchor="hizmetler"]' : '#hizmetler')
        const targetBox = await anchor.boundingBox()
        const headerBox = await page.locator('.bn-header').boundingBox()
        expect(targetBox.y >= headerBox.height-2 && targetBox.y < height, 'Service navigation lands below sticky header', {target:targetBox.y,header:headerBox.height})
      }

      await page.evaluate(() => scrollTo(0,0))
      const booking = page.locator(width < 768 ? '.bn-at-hero-foot .bn-at-cta' : '.bn-hero__copy .bnx-appointment')
      await booking.tap()
      const panel = page.locator('.bn-modal__panel--form')
      await page.locator('.bn-form').waitFor({state:'visible'})
      const panelBox = await panel.boundingBox()
      expect(panelBox.x >= 0 && panelBox.x+panelBox.width <= width+1 && panelBox.y >= 0 && panelBox.y+panelBox.height <= height+1, 'Booking panel fits short viewport', panelBox)
      expect(await page.evaluate(() => document.body.style.overflow === 'hidden'), 'Booking locks background scrolling')
      const fonts = await panel.locator('input:not([type="checkbox"]),textarea,select').evaluateAll(elements => elements.map(element => ({name:element.getAttribute('name'),fontSize:parseFloat(getComputedStyle(element).fontSize)})))
      expect(fonts.every(field => field.fontSize >= 16), 'Text inputs avoid iOS focus zoom', fonts)
      await panel.locator('.bn-modal__close').focus()
      await page.keyboard.press('Shift+Tab')
      expect(await panel.evaluate(element => element.contains(document.activeElement)), 'Booking keyboard focus stays in modal')
      const submit = panel.locator('button[type="submit"]')
      await submit.click()
      expect(await panel.locator('.bn-field-error').count() === 3, 'Booking validates all required fields')
      const submitBox = await submit.boundingBox()
      expect(submitBox.height >= 44, 'Booking submit touch target at least 44px', submitBox)
      await page.screenshot({path:resolve(output, `${label}-${width}x${height}-booking.png`)})
      await panel.locator('[name="service"]').first().check()
      await panel.locator('[name="name"]').fill('Mobil test')
      await panel.locator('[name="phone"]').fill('05000000000')
      await page.evaluate(() => { window.open = url => { window.__qaDraftUrl = url; return null } })
      await submit.click()
      await panel.locator('.bn-form-success').waitFor({state:'visible'})
      const draft = await page.evaluate(() => window.__qaDraftUrl)
      expect(/^https:\/\/wa\.me\/905011281808\?text=/.test(draft || ''), 'Booking prepares correct WhatsApp draft without sending')
      expect(await panel.evaluate(element => element.contains(document.activeElement)), 'Booking success retains focus inside modal')
      expect((await panel.locator('.bn-form-success a').getAttribute('href')) === draft, 'Blocked popup retains an equivalent fallback link')
      await panel.locator('.bn-form-success button').focus()
      await page.keyboard.press('Tab')
      expect(await panel.locator('.bn-modal__close').evaluate(element => element === document.activeElement), 'Success controls keep a complete focus loop')
      await page.keyboard.press('Escape')
      expect(await panel.count() === 0, 'Escape closes booking')
      expect(await booking.evaluate(element => element === document.activeElement), 'Booking restores opener focus')
      expect(await page.evaluate(() => document.body.style.overflow !== 'hidden'), 'Booking restores scrolling')

      const serviceOpener = page.locator(width < 768 ? '.bn-at-nails > .bn-at-cta' : '.bn-service--nails .bn-button')
      await serviceOpener.tap()
      const servicePanel = page.locator('.bn-modal__panel:not(.bn-modal__panel--form)')
      await servicePanel.waitFor({state:'visible'})
      const serviceBox = await servicePanel.boundingBox()
      expect(serviceBox.x >= 0 && serviceBox.x+serviceBox.width <= width+1 && serviceBox.y >= 0 && serviceBox.y+serviceBox.height <= height+1, 'Service sheet fits viewport', serviceBox)
      expect(await servicePanel.locator('.bn-modal__close').evaluate(element => element === document.activeElement), 'Service dialog initially focuses close control')
      await page.keyboard.press('Shift+Tab')
      expect(await servicePanel.locator('.sz-service-detail-link').evaluate(element => element === document.activeElement), 'Service dialog traps backwards focus')
      await page.keyboard.press('Tab')
      expect(await servicePanel.locator('.bn-modal__close').evaluate(element => element === document.activeElement), 'Service dialog loops forwards focus')
      expect(await page.locator('.bn-header').evaluate(element => element.inert), 'Service dialog makes background inert')
      await page.keyboard.press('Escape')
      expect(await servicePanel.count() === 0, 'Escape closes service sheet')
      expect(await serviceOpener.evaluate(element => element === document.activeElement), 'Service dialog restores opener focus')
      expect(await page.locator('.bn-header').evaluate(element => !element.inert), 'Service dialog restores background interaction')

      if (width === 390 && height === 844) {
        await toggle.tap()
        await page.locator('.bn-menu .bnx-appointment').tap()
        await page.locator('.bn-form').waitFor({state:'visible'})
        expect(!(await page.locator('.bn-menu').isVisible()), 'Menu appointment closes navigation before showing form')
        await page.keyboard.press('Escape')
        expect(await page.evaluate(() => {
          const active = document.activeElement
          return active instanceof HTMLElement && active !== document.body && active.getClientRects().length > 0
        }), 'Menu appointment restores focus to a visible control')
      }

      const gallery = page.locator(`.sz-gallery.sz-only-${width < 768 ? 'mobile' : 'desktop'}`)
      const filterSizes = await gallery.locator('.sz-filters button').evaluateAll(elements => elements.map(element => ({label:element.textContent,height:element.getBoundingClientRect().height,width:element.getBoundingClientRect().width})))
      expect(filterSizes.every(button => button.width >= 44 && button.height >= 44), 'Gallery filters have 44px touch targets', filterSizes)
      const opener = gallery.locator('.sz-shot').first()
      await opener.tap()
      const lightbox = page.locator('.sz-lightbox[open]')
      await lightbox.waitFor({state:'visible'})
      await lightbox.locator('img').evaluate(image => image.decode())
      expect(await page.evaluate(() => document.body.style.overflow === 'hidden'), 'Gallery locks background scrolling')
      const lightboxBox = await lightbox.boundingBox()
      expect(lightboxBox.x >= 0 && lightboxBox.x+lightboxBox.width <= width+1 && lightboxBox.y >= 0 && lightboxBox.y+lightboxBox.height <= height+1, 'Gallery dialog fits landscape viewport', lightboxBox)
      const controls = await lightbox.locator('button').evaluateAll(elements => elements.map(element => ({label:element.textContent,height:element.getBoundingClientRect().height,width:element.getBoundingClientRect().width})))
      expect(controls.every(button => button.height >= 44 && button.width >= 44), 'Gallery controls have 44px touch targets', controls)
      const firstImage = await lightbox.locator('img').getAttribute('src')
      await lightbox.getByRole('button',{name:'Sonraki',exact:true}).click()
      expect(await lightbox.locator('img').getAttribute('src') !== firstImage, 'Gallery advances using touch control')
      const closeBox = await lightbox.locator('.sz-close').boundingBox()
      expect(closeBox.y >= lightboxBox.y && closeBox.y+closeBox.height <= height, 'Gallery close remains visible after navigation', closeBox)
      await page.screenshot({path:resolve(output, `${label}-${width}x${height}-lightbox.png`)})
      await page.keyboard.press('Escape')
      expect(await page.locator('.sz-lightbox[open]').count() === 0, 'Escape closes gallery')
      expect(await opener.evaluate(element => element === document.activeElement), 'Gallery restores opener focus')
      expect(await page.evaluate(() => document.body.style.overflow !== 'hidden'), 'Gallery restores scrolling')
      expect(pageErrors.length === 0, 'No page or hydration errors', pageErrors)
      expect(consoleErrors.length === 0, 'No browser console errors', consoleErrors)
      expect(failedResponses.length === 0, 'No failed pages or assets', failedResponses)

      if (engine === 'chromium' && [320,390,768].includes(width) && height !== 600) {
        const heading = page.getByRole('heading',{level:1})
        const before = await heading.evaluate(element => parseFloat(getComputedStyle(element).fontSize))
        await page.addStyleTag({content:'html{-webkit-text-size-adjust:200%!important;text-size-adjust:200%!important}'})
        await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))))
        const after = await heading.evaluate(element => parseFloat(getComputedStyle(element).fontSize))
        entry.textScaling = {requestedPercent:200,beforeHeadingFont:before,afterHeadingFont:after,supported:after>before+1}
        if (entry.textScaling.supported) {
          const zoomLayout = await bounds(page)
          expect(zoomLayout.scrollWidth === width, '200% text has no horizontal page overflow', zoomLayout.scrollWidth)
          expect(zoomLayout.clipped.length === 0, '200% headings and captions do not clip', zoomLayout.clipped)
          const zoomBounds = await page.evaluate(() => {
            const visible = element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden'
            const captionIssues = [...document.querySelectorAll('.sz-shot')].filter(visible).flatMap(shot => {
              const caption = shot.querySelector('.sz-shot-caption')
              if (!caption) return []
              const frame = shot.getBoundingClientRect(), text = caption.getBoundingClientRect()
              return text.top < frame.top-1 || text.bottom > frame.bottom+1 || text.left < frame.left-1 || text.right > frame.right+1
                ? [{text:caption.textContent.trim(),shot:{top:frame.top,bottom:frame.bottom},caption:{top:text.top,bottom:text.bottom}}] : []
            })
            const footerIssues = [...document.querySelectorAll('footer .bn-wordmark__name')].filter(visible).flatMap(element => {
              const rect = element.getBoundingClientRect()
              return rect.left < -1 || rect.right > innerWidth+1 || element.scrollWidth > element.clientWidth+1
                ? [{text:element.textContent,left:rect.left,right:rect.right,width:element.clientWidth,scroll:element.scrollWidth}] : []
            })
            const filterIssues = [...document.querySelectorAll('.sz-filters button')].filter(visible).flatMap(button => {
              const range = document.createRange()
              range.selectNodeContents(button)
              const lines = [...range.getClientRects()].filter(rect => rect.width>0 && rect.height>0)
              return lines.length > 1 ? [{text:button.textContent,lines:lines.length}] : []
            })
            const toggle = document.querySelector('.bn-menu-toggle')
            const rect = toggle && visible(toggle) ? toggle.getBoundingClientRect() : null
            const menuToggle = rect ? {left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom} : null
            return {captionIssues,footerIssues,filterIssues,menuToggle}
          })
          expect(zoomBounds.captionIssues.length === 0, '200% gallery captions stay within image cards', zoomBounds.captionIssues)
          expect(zoomBounds.footerIssues.length === 0, '200% footer wordmark stays within viewport', zoomBounds.footerIssues)
          expect(zoomBounds.filterIssues.length === 0, '200% filter labels stay on one readable line', zoomBounds.filterIssues)
          const menuToggle = zoomBounds.menuToggle
          expect(!menuToggle || (menuToggle.left >= 0 && menuToggle.right <= width+1 && menuToggle.top >= 0 && menuToggle.bottom <= height+1), '200% navigation toggle stays within viewport', menuToggle)
          if ([320,390].includes(width) && menuToggle && menuToggle.right <= width+1) {
            await toggle.tap()
            const menu = page.locator('.bn-menu')
            await menu.waitFor({state:'visible'})
            const menuBox = await menu.boundingBox()
            const headerBox = await page.locator('.bn-header').boundingBox()
            expect(menuBox.y >= headerBox.y+headerBox.height-1 && menuBox.x >= 0 && menuBox.x+menuBox.width <= width+1 && menuBox.y+menuBox.height <= height+1, '200% menu fits below enlarged header', {menu:menuBox,header:headerBox})
            await menu.locator('a[href="#hizmetler"]').tap()
            const targetBox = await page.locator('[data-at-anchor="hizmetler"]').boundingBox()
            const currentHeader = await page.locator('.bn-header').boundingBox()
            expect(targetBox.y >= currentHeader.height-2 && targetBox.y <= currentHeader.height+30, '200% service link lands below enlarged sticky header', {target:targetBox.y,header:currentHeader.height})
          }
          await gallery.scrollIntoViewIfNeeded()
          await page.screenshot({path:resolve(output, `${label}-${width}x${height}-text200.png`)})
        } else {
          entry.checks.push({name:'200% browser text adjustment',status:'UNSUPPORTED',evidence:entry.textScaling})
        }
      }
    } catch (error) {
      entry.issues.push({message:'Flow failed',evidence:error.message})
    } finally {
      entry.status = entry.issues.length ? 'FAIL' : 'PASS'
      report.cases.push(entry)
      console.log(`${entry.status} ${engine} ${width}x${height}: ${entry.checks.length} checks; ${entry.issues.map(issue => issue.message).join('; ') || 'no issues'}`)
      await context.close()
    }
  }
  report.status = report.cases.some(entry => entry.status === 'FAIL') ? 'FAIL' : 'PASS'
  process.exitCode = report.status === 'PASS' ? 0 : 1
} finally {
  report.finishedAt = new Date().toISOString()
  await writeFile(resolve(output, `${label}-report.json`),JSON.stringify(report,null,2))
  if (browser) await browser.close()
  await new Promise(done => server.close(done))
}
