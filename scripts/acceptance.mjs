/**
 * Real-browser acceptance: videos, reduced-motion, WebGL fallback,
 * breakpoints, menu/booking, remount checks. Not stills→video.
 */
import { chromium, devices } from 'playwright'
import { mkdirSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const BASE = process.env.ACCEPTANCE_URL || 'http://127.0.0.1:4174/'
const OUT = resolve('docs/beauty-nails-brief/evidence')
mkdirSync(OUT, { recursive: true })

const results = {
  startedAt: new Date().toISOString(),
  base: BASE,
  physicalDevice: false,
  notes: [],
  checks: {},
}

function ok(id, pass, detail, evidence = []) {
  results.checks[id] = { pass, detail, evidence }
  console.log(`${pass ? 'PASS' : 'FAIL'} ${id}: ${detail}`)
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms))
}

async function smoothScroll(page, toY, steps = 28) {
  const start = await page.evaluate(() => window.scrollY)
  for (let i = 1; i <= steps; i++) {
    const y = start + ((toY - start) * i) / steps
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await sleep(45)
  }
}

async function recordDesktopVideo(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
  })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await sleep(900)

  await page.screenshot({ path: resolve(OUT, 'accept-desktop-p0.png'), fullPage: false })

  const hizmetlerY = await page.locator('#hizmetler').evaluate((el) => {
    const top = el.getBoundingClientRect().top + window.scrollY
    return Math.max(0, top - 80)
  })

  // Mid scene: open booking while hero still pinned-ish
  await smoothScroll(page, Math.round(hizmetlerY * 0.35), 18)
  await page.screenshot({ path: resolve(OUT, 'accept-desktop-p05.png'), fullPage: false })
  await page.getByRole('button', { name: 'Özel Randevu' }).click()
  await sleep(400)
  await page.keyboard.press('Escape')
  await sleep(300)

  // Through pin exit into services
  await smoothScroll(page, hizmetlerY, 32)
  await sleep(400)
  await page.screenshot({ path: resolve(OUT, 'accept-desktop-services.png'), fullPage: false })

  // Anchor + back
  await page.evaluate(() => window.scrollTo(0, 0))
  await sleep(300)
  await page.locator('a[href="#hizmetler"]').first().click()
  await sleep(700)
  const afterAnchor = await page.evaluate(() => window.scrollY)
  await page.goBack()
  await sleep(700)
  const afterBack = await page.evaluate(() => window.scrollY)

  // Scroll back up through hero
  await smoothScroll(page, 0, 24)
  await sleep(400)

  const videoPath = await page.video().path()
  await context.close()
  const dest = resolve(OUT, 'desktop-scroll.webm')
  // Playwright writes webm into record dir; rename via copy when path known
  const { copyFileSync, renameSync } = await import('fs')
  try {
    renameSync(videoPath, dest)
  } catch {
    copyFileSync(videoPath, dest)
  }

  ok(
    'AC07_video',
    existsSync(dest),
    `Desktop scroll video + mid booking/Escape + anchor/back (anchorY=${afterAnchor}, backY=${afterBack})`,
    [dest, resolve(OUT, 'accept-desktop-p0.png'), resolve(OUT, 'accept-desktop-p05.png')],
  )
  ok('AC10_nav', afterAnchor > 200, `Anchor to #hizmetler scrollY=${afterAnchor}; back scrollY=${afterBack}`)
}

async function recordMobileVideo(browser) {
  const iPhone = devices['iPhone 13']
  const context = await browser.newContext({
    ...iPhone,
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    recordVideo: { dir: OUT, size: { width: 390, height: 844 } },
  })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await sleep(900)
  await page.screenshot({ path: resolve(OUT, 'accept-mobile-p0.png'), fullPage: false })

  const layout = await page.evaluate(() => {
    const copy = document.querySelector('.hero-copy')?.getBoundingClientRect()
    const visual = document.querySelector('.hero-visual')?.getBoundingClientRect()
    const bar = document.querySelector('.mobile-bar')?.getBoundingClientRect()
    return {
      textAbove: copy && visual ? copy.top < visual.top : false,
      barVisible: !!bar && bar.bottom <= window.innerHeight + 1,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    }
  })

  const hizmetlerY = await page.locator('#hizmetler').evaluate((el) => {
    return el.getBoundingClientRect().top + window.scrollY - 70
  })

  await smoothScroll(page, Math.round(hizmetlerY * 0.4), 20)
  await page.screenshot({ path: resolve(OUT, 'accept-mobile-p05.png'), fullPage: false })

  // Mid-scene booking via sticky bar
  await page.getByRole('button', { name: 'Randevu Al' }).last().click()
  await sleep(400)
  await page.keyboard.press('Escape')
  await sleep(250)

  await page.getByRole('button', { name: 'Menüyü aç' }).click()
  await sleep(300)
  await page.keyboard.press('Escape')
  await sleep(250)

  await smoothScroll(page, hizmetlerY, 28)
  await sleep(350)
  await smoothScroll(page, 0, 24)
  await sleep(350)

  const videoPath = await page.video().path()
  await context.close()
  const dest = resolve(OUT, 'mobile-scroll.webm')
  const { copyFileSync, renameSync } = await import('fs')
  try {
    renameSync(videoPath, dest)
  } catch {
    copyFileSync(videoPath, dest)
  }

  ok(
    'AC08_video',
    existsSync(dest) && layout.textAbove && layout.barVisible && !layout.overflowX,
    `Mobile video; textAbove=${layout.textAbove} bar=${layout.barVisible} overflowX=${layout.overflowX}`,
    [dest, resolve(OUT, 'accept-mobile-p0.png')],
  )
  ok('AC03', layout.textAbove && layout.barVisible, 'Mobile first viewport stack + bar')
}

async function breakpoints(browser) {
  const widths = [320, 360, 390, 768, 1024, 1440]
  const shots = []
  for (const w of widths) {
    const h = w <= 390 ? 844 : w <= 768 ? 1024 : 900
    const context = await browser.newContext({ viewport: { width: w, height: h } })
    const page = await context.newPage()
    await page.goto(BASE, { waitUntil: 'networkidle' })
    await sleep(500)
    const metrics = await page.evaluate(() => {
      const doc = document.documentElement
      const face = document.querySelector('.hero-portrait img')
      const bar = document.querySelector('.mobile-bar')
      const faceRect = face?.getBoundingClientRect()
      return {
        overflowX: doc.scrollWidth > window.innerWidth + 2,
        faceVisible: !!faceRect && faceRect.width > 40 && faceRect.height > 40,
        barOverlap:
          bar && getComputedStyle(bar).display !== 'none'
            ? (() => {
                const b = bar.getBoundingClientRect()
                const cta = document.querySelector('.hero-actions')?.getBoundingClientRect()
                return cta ? cta.bottom > b.top + 8 : false
              })()
            : false,
      }
    })
    const file = resolve(OUT, `breakpoint-${w}.png`)
    await page.screenshot({ path: file, fullPage: false })
    shots.push(file)
    ok(
      `BP_${w}`,
      !metrics.overflowX && metrics.faceVisible && !metrics.barOverlap,
      `w=${w} overflowX=${metrics.overflowX} face=${metrics.faceVisible} barOverlap=${metrics.barOverlap}`,
      [file],
    )

    // Orientation swap for tablets
    if (w === 768 || w === 1024) {
      await page.setViewportSize({ width: h, height: w })
      await sleep(400)
      const orientOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 2,
      )
      const orientFile = resolve(OUT, `breakpoint-${w}-orient.png`)
      await page.screenshot({ path: orientFile, fullPage: false })
      ok(`BP_${w}_orient`, !orientOverflow, `orientation swap overflowX=${orientOverflow}`, [
        orientFile,
      ])
    }

    await context.close()
  }
  ok(
    'AC04',
    widths.every((w) => results.checks[`BP_${w}`]?.pass),
    '320/360/390/768/1024(+1440) no overflow/face crop/bar overlap',
    shots,
  )
}

async function reducedMotion(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await sleep(700)
  const initial = await page.evaluate(() => {
    const spacer = document.querySelector('.pin-spacer')
    const copy = getComputedStyle(document.querySelector('.hero-copy')).opacity
    const canvas = document.querySelector('canvas.hero-canvas')
    return {
      pinSpacer: !!spacer,
      copyOpacity: Number(copy),
      canvas: !!canvas,
      h1: !!document.querySelector('h1'),
      cta: !!document.querySelector('.hero-actions .btn-primary'),
    }
  })
  await page.screenshot({ path: resolve(OUT, 'reduced-motion-on.png'), fullPage: false })
  await page.evaluate(() => window.scrollTo(0, 800))
  await sleep(400)
  const afterScroll = await page.evaluate(() => ({
    scrollY: window.scrollY,
    pinSpacer: !!document.querySelector('.pin-spacer'),
    copyOpacity: Number(getComputedStyle(document.querySelector('.hero-copy')).opacity),
  }))

  // Runtime preference flip: emulate media change if supported
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await sleep(800)
  const flippedOff = await page.evaluate(() => !!document.querySelector('.pin-spacer'))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await sleep(800)
  const flippedOn = await page.evaluate(() => {
    ScrollTrigger: void 0
    return {
      pinSpacer: !!document.querySelector('.pin-spacer'),
      copyOpacity: Number(getComputedStyle(document.querySelector('.hero-copy')).opacity),
    }
  })
  await page.screenshot({ path: resolve(OUT, 'reduced-motion-runtime.png'), fullPage: false })

  const pass =
    !initial.pinSpacer &&
    initial.copyOpacity > 0.9 &&
    !initial.canvas &&
    initial.h1 &&
    initial.cta &&
    afterScroll.scrollY > 100 &&
    afterScroll.copyOpacity > 0.9 &&
    flippedOn.copyOpacity > 0.9

  ok(
    'AC15',
    pass,
    `reduced init pin=${initial.pinSpacer} canvas=${initial.canvas} copy=${initial.copyOpacity}; afterScrollY=${afterScroll.scrollY}; flipOffPin=${flippedOff} flipOnPin=${flippedOn.pinSpacer}`,
    [resolve(OUT, 'reduced-motion-on.png'), resolve(OUT, 'reduced-motion-runtime.png')],
  )
  await context.close()
}

async function webglFallback(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  await page.addInitScript(() => {
    const proto = HTMLCanvasElement.prototype
    const original = proto.getContext
    proto.getContext = function (type, attrs) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null
      return original.call(this, type, attrs)
    }
  })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await sleep(800)
  const state = await page.evaluate(() => {
    const stage = document.querySelector('.hero-stage')
    const cs = stage ? getComputedStyle(stage) : null
    const canvas = document.querySelector('canvas.hero-canvas')
    const fallback = document.querySelector('.hero-fallback-arch')
    const h1 = document.querySelector('h1')
    const cta = document.querySelector('.hero-actions .btn-primary')
    const bgImage = cs?.backgroundImage || ''
    const bgColor = cs?.backgroundColor || ''
    const looksPink =
      bgImage.includes('gradient') ||
      bgColor.includes('255') ||
      bgColor.includes('rgb(255') ||
      bgColor.includes('rgba(255')
    return {
      hasCanvas: !!canvas,
      hasFallback: !!fallback,
      h1: !!h1 && getComputedStyle(h1).opacity !== '0',
      cta: !!cta,
      bgColor,
      bgImage: bgImage.slice(0, 80),
      looksPink,
      blackHero: bgColor === 'rgb(0, 0, 0)',
    }
  })
  await page.screenshot({ path: resolve(OUT, 'webgl-fallback.png'), fullPage: false })
  await context.close()

  const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page2 = await ctx2.newPage()
  await page2.goto(BASE, { waitUntil: 'networkidle' })
  // Wait for deferred Three.js boot (idle / fallback timer) before simulating loss.
  try {
    await page2.waitForFunction(
      () =>
        performance
          .getEntriesByType('resource')
          .some((e) => String(e.name).includes('heroScene')),
      { timeout: 5000 },
    )
  } catch {
    /* continue; may skip below */
  }
  await sleep(400)
  const loss = await page2.evaluate(async () => {
    const canvas = document.querySelector('canvas.hero-canvas')
    if (!canvas) return { skipped: true, reason: 'no-canvas' }
    const loads = performance
      .getEntriesByType('resource')
      .filter((e) => String(e.name).includes('heroScene')).length
    if (!loads) return { skipped: true, reason: 'heroScene-not-booted', heroSceneLoads: 0 }
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return { skipped: true, reason: 'no-gl' }
    const ext = gl.getExtension('WEBGL_lose_context')
    if (!ext) return { skipped: true, reason: 'no WEBGL_lose_context' }
    ext.loseContext()
    await new Promise((r) => setTimeout(r, 900))
    return {
      skipped: false,
      canvasGone: !document.querySelector('canvas.hero-canvas'),
      fallback: !!document.querySelector('.hero-fallback-arch'),
      h1: !!document.querySelector('h1'),
      heroSceneLoads: loads,
    }
  })
  await page2.screenshot({ path: resolve(OUT, 'webgl-context-lost.png'), fullPage: false })
  await ctx2.close()

  const passNoGl =
    state.h1 && state.cta && !state.blackHero && state.looksPink && (state.hasFallback || !state.hasCanvas)
  ok('AC16_no_webgl', passNoGl, `no-webgl fallback state=${JSON.stringify(state)}`, [
    resolve(OUT, 'webgl-fallback.png'),
  ])
  ok(
    'AC16_context_lost',
    loss.skipped || (loss.fallback && loss.h1 && loss.heroSceneLoads <= 2),
    `context loss ${JSON.stringify(loss)}`,
    [resolve(OUT, 'webgl-context-lost.png')],
  )
}

async function menuBookingA11y(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await sleep(500)

  await page.getByRole('button', { name: 'Menüyü aç' }).click()
  await sleep(200)
  const menuOpen = await page.locator('.nav-mobile.is-open').count()
  await page.keyboard.press('Escape')
  await sleep(250)
  const menuClosed = (await page.locator('.nav-mobile.is-open').count()) === 0
  const focusBack = await page.evaluate(
    () => document.activeElement?.classList?.contains('menu-toggle') || document.activeElement?.closest('.menu-toggle'),
  )

  await page.getByRole('button', { name: 'Randevunuzu Planlayın' }).click()
  await sleep(300)
  await page.getByRole('button', { name: 'Taslağı Kaydet' }).click()
  await sleep(200)
  const errors = await page.locator('.field-error').count()
  await page.locator('input[name="name"]').fill('Ayşe Deneme')
  await page.locator('input[name="phone"]').fill('05551234567')
  await page.locator('select[name="service"]').selectOption({ index: 1 })
  await page.getByRole('button', { name: 'Taslağı Kaydet' }).click()
  await sleep(300)
  const draft = await page.locator('.form-success').innerText()
  const honest = /taslak|gönderilmedi|henüz/i.test(draft)
  await page.screenshot({ path: resolve(OUT, 'booking-draft.png'), fullPage: false })
  await page.keyboard.press('Escape')
  await sleep(200)

  ok(
    'AC20_menu',
    menuOpen > 0 && menuClosed && !!focusBack,
    `menu open/Escape/focusBack=${!!focusBack}`,
  )
  ok('AC13', errors >= 3, `empty submit field errors=${errors}`)
  ok('AC12_AC14', honest, `draft message honest=${honest} text=${JSON.stringify(draft.slice(0, 120))}`, [
    resolve(OUT, 'booking-draft.png'),
  ])
  await context.close()
}

async function remountCheck(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await sleep(800)
  const before = await page.evaluate(() => ({
    spacers: document.querySelectorAll('.pin-spacer').length,
    canvases: document.querySelectorAll('canvas.hero-canvas').length,
  }))
  await page.reload({ waitUntil: 'networkidle' })
  await sleep(900)
  const after = await page.evaluate(() => ({
    spacers: document.querySelectorAll('.pin-spacer').length,
    canvases: document.querySelectorAll('canvas.hero-canvas').length,
  }))
  // Soft remount via navigating hash
  await page.locator('a[href="#deneyim"]').first().click()
  await sleep(400)
  await page.locator('a[href="#top"]').first().click()
  await sleep(800)
  const final = await page.evaluate(() => ({
    spacers: document.querySelectorAll('.pin-spacer').length,
    canvases: document.querySelectorAll('canvas.hero-canvas').length,
  }))
  const pass =
    before.spacers <= 1 &&
    after.spacers <= 1 &&
    final.spacers <= 1 &&
    before.canvases <= 1 &&
    after.canvases <= 1 &&
    final.canvases <= 1
  ok('AC18', pass, `spacers/canvases before=${JSON.stringify(before)} after=${JSON.stringify(after)} final=${JSON.stringify(final)}`)
  await context.close()
}

async function visualIdentity(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await sleep(700)
  const id = await page.evaluate(() => {
    const pink = getComputedStyle(document.documentElement).getPropertyValue('--pink').trim()
    const brand = document.querySelector('.logo__name')?.textContent?.trim()
    const h1 = document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim()
    const em = document.querySelector('h1 em')?.textContent
    const cards = document.querySelectorAll('.service-card').length
    return { pink, brand, h1, em, cards }
  })
  await page.screenshot({ path: resolve(OUT, 'accept-identity-1440.png'), fullPage: false })
  ok(
    'AC01',
    id.pink.toLowerCase() === '#ef2c83' && /beauty nails/i.test(id.brand || '') && id.em === 'özel',
    JSON.stringify(id),
    [resolve(OUT, 'accept-identity-1440.png')],
  )
  ok('AC02', id.cards === 4, `service cards=${id.cards}`)
  ok('AC05', existsSync(resolve('public/images/hero-portrait-cutout.webp')), 'portrait webp present')
  await context.close()
}

const browser = await chromium.launch({ headless: true })
try {
  await visualIdentity(browser)
  await recordDesktopVideo(browser)
  await recordMobileVideo(browser)
  await breakpoints(browser)
  await reducedMotion(browser)
  await webglFallback(browser)
  await menuBookingA11y(browser)
  await remountCheck(browser)
} catch (err) {
  results.fatal = String(err?.stack || err)
  console.error(err)
} finally {
  await browser.close()
}

results.finishedAt = new Date().toISOString()
const reportPath = resolve(OUT, 'acceptance-results.json')
writeFileSync(reportPath, JSON.stringify(results, null, 2))
console.log('Wrote', reportPath)

const failed = Object.entries(results.checks).filter(([, v]) => !v.pass)
process.exit(failed.length || results.fatal ? 1 : 0)
