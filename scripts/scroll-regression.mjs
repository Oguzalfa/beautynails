import { chromium } from 'playwright'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'

const offline = process.env.BEAUTY_FIX_OFFLINE === '1'
const base = offline ? 'https://beauty.fixture.invalid/' :
  process.env.BEAUTY_FIX_URL || 'http://127.0.0.1:4174/'
const out = resolve('docs/beauty-nails-brief/scroll-fix-evidence')
await mkdir(out, { recursive: true })
const checks = []
const browser = await chromium.launch({ headless: true })

async function makeContext(options) {
  const context = await browser.newContext(options)
  if (offline) {
    const dist = resolve('dist')
    const types = { '.html': 'text/html', '.js': 'application/javascript',
      '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png',
      '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' }
    await context.route('**/*', async (route) => {
      const url = new URL(route.request().url())
      // A completely offline fixture: no DNS, HTTP connection, third-party
      // resource or request to the user's running preview is performed.
      if (url.origin !== new URL(base).origin) return route.abort()
      const path = resolve(dist, `.${decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)}`)
      if (!path.startsWith(dist + sep)) return route.abort()
      try {
        await route.fulfill({ status: 200, contentType: types[extname(path)] ||
          'application/octet-stream', body: await readFile(path) })
      } catch {
        await route.fulfill({ status: 404, body: 'Fixture asset not found' })
      }
    })
  }
  return context
}

function check(name, pass, details) {
  checks.push({ name, pass: !!pass, details })
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name}: ${JSON.stringify(details)}`)
}

async function scene(page) {
  return page.evaluate(() => {
    const story = document.querySelector('.story-pin')
    const header = document.querySelector('.site-header')
    const bar = document.querySelector('.mobile-bar')
    const visibleBar = bar && getComputedStyle(bar).display !== 'none'
    const service = document.querySelector('#hizmetler')
    const inner = document.querySelector('.services__inner')
    const rect = (el) => {
      const r = el?.getBoundingClientRect()
      return r ? { top: r.top, bottom: r.bottom, height: r.height } : null
    }
    return {
      p: Number(story?.style.getPropertyValue('--story-p') || 0),
      phase: story?.dataset.phase,
      mode: story?.dataset.storyMode,
      portraitOpacity: Number(getComputedStyle(document.querySelector('.hero-portrait')).opacity),
      panelOpacity: Number(getComputedStyle(document.querySelector('.manicure-panel')).opacity),
      header: rect(header),
      bar: visibleBar ? rect(bar) : null,
      service: rect(service),
      inner: rect(inner),
      usable: innerHeight - (header?.getBoundingClientRect().height || 0) -
        (visibleBar ? bar.getBoundingClientRect().height : 0),
      viewportHeight: innerHeight,
      overflow: document.documentElement.scrollWidth > innerWidth + 2,
      photos: [...document.querySelectorAll('.service-card img')]
        .map((img) => ({ loaded: img.complete && img.naturalWidth > 0, rect: rect(img) })),
      serviceCopies: document.querySelectorAll('#hizmetler').length,
      spacers: document.querySelectorAll('.pin-spacer').length,
      canvases: document.querySelectorAll('canvas.hero-canvas').length,
    }
  })
}

async function scrollToProgress(page, p) {
  const dimensions = await scene(page)
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }),
    Math.round(dimensions.usable * (dimensions.mode === 'pinned' ? 1.1 : 0.75) * p))
  await page.waitForTimeout(900)
  return scene(page)
}

try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const name = viewport.width === 1440 ? 'desktop' : 'mobile'
    const context = await makeContext({ viewport,
      isMobile: name === 'mobile', hasTouch: name === 'mobile',
      recordVideo: { dir: out, size: viewport } })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', (error) => errors.push(String(error)))
    await page.goto(base, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1800)
    const states = []
    for (const p of [0, 0.25, 0.5, 0.75, 1]) {
      const state = await scrollToProgress(page, p)
      states.push(state)
      await page.screenshot({ path: resolve(out, `${name}-p${Math.round(p * 100)}.png`) })
    }
    check(`${name}: opaque portrait and panel`, states.every((s) =>
      s.portraitOpacity >= 0.99 && s.panelOpacity >= 0.99), states.map((s) =>
      ({ p: s.p, portrait: s.portraitOpacity, panel: s.panelOpacity })))
    const last = states.at(-1)
    check(`${name}: real services visible at final scene`, last.serviceCopies === 1 &&
      last.photos.length === 4 && last.photos.every((p) => p.loaded) &&
      last.inner.top >= last.header.bottom - 2 &&
      last.inner.bottom <= (last.bar?.top ?? last.viewportHeight) + 2,
      { mode: last.mode, header: last.header, service: last.service, inner: last.inner, bar: last.bar })
    check(`${name}: no overflow or duplicate renderer`, states.every((s) =>
      !s.overflow && s.spacers <= 1 && s.canvases <= 1), states.map((s) =>
      ({ overflow: s.overflow, spacers: s.spacers, canvases: s.canvases })))

    // Fast reversal uses the same scrubbed clock in both directions.
    await scrollToProgress(page, 0.15)
    const reverse = await scrollToProgress(page, 0.75)
    check(`${name}: reversible scene clock`, Math.abs(reverse.p - 0.75) < 0.04 &&
      reverse.portraitOpacity >= 0.99, { p: reverse.p, phase: reverse.phase })

    // The header is present in both layouts; use real anchors, not a test-only setter.
    await page.locator('a[href="#top"]').first().click()
    await page.waitForTimeout(900)
    const top = await scene(page)
    check(`${name}: logo returns to start`, top.p < 0.025 &&
      await page.locator('.hero-copy').evaluate((el) => Number(getComputedStyle(el).opacity) > 0.99),
      { p: top.p, hash: await page.evaluate(() => location.hash) })

    if (name === 'mobile') {
      await page.getByRole('button', { name: 'Menüyü aç' }).click()
    }
    await page.locator('.site-header a[href="#hizmetler"]:visible').first().click()
    await page.waitForTimeout(900)
    const anchor = await scene(page)
    check(`${name}: services anchor reaches actual services`, anchor.p > 0.975 &&
      anchor.inner.top >= anchor.header.bottom - 2 &&
      anchor.inner.bottom <= (anchor.bar?.top ?? anchor.viewportHeight) + 2,
      { p: anchor.p, inner: anchor.inner, hash: await page.evaluate(() => location.hash) })
    await page.goBack()
    await page.waitForTimeout(900)
    const back = await scene(page)
    check(`${name}: history restores opening`, back.p < 0.025,
      { p: back.p, hash: await page.evaluate(() => location.hash) })

    // Check the existing local booking flow while the scene is active.
    const booking = name === 'mobile'
      ? page.locator('.mobile-bar').getByRole('button', { name: 'Randevu Al' })
      : page.locator('.site-header').getByRole('button', { name: /Özel Randevu/ })
    await booking.click()
    const dialogOpen = await page.locator('[role="dialog"]').count()
    await page.keyboard.press('Escape')
    await page.waitForTimeout(150)
    check(`${name}: booking opens and Escape closes`, dialogOpen === 1 &&
      await page.locator('[role="dialog"]').count() === 0, { dialogOpen })

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.waitForTimeout(700)
    const reduced = await scene(page)
    check(`${name}: runtime reduced motion clears pin`, reduced.spacers === 0 &&
      reduced.canvases === 0 && reduced.portraitOpacity >= 0.99, reduced)
    check(`${name}: no runtime errors`, errors.length === 0, errors)
    await context.close()
  }

  const short = await makeContext({ viewport: { width: 320, height: 568 },
    isMobile: true, hasTouch: true })
  const page = await short.newPage()
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  const initial = await scene(page)
  await page.locator('#hizmetler').scrollIntoViewIfNeeded()
  const natural = await scene(page)
  check('short viewport: natural flow and reachable services', initial.mode === 'natural' &&
    initial.spacers === 0 && !natural.overflow && natural.service.top < natural.viewportHeight,
    { mode: initial.mode, spacers: initial.spacers, service: natural.service })
  await short.close()
} catch (error) {
  check('test runner', false, String(error?.stack || error))
} finally {
  await browser.close()
  await writeFile(resolve(out, 'scroll-regression-results.json'), JSON.stringify({ base,
    mode: offline ? 'offline-built-files-no-network-external-fonts-blocked' : 'local-preview', checks }, null, 2))
}
process.exitCode = checks.some((c) => !c.pass) ? 1 : 0
