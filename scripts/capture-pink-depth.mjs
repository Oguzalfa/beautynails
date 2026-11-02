import { chromium, devices } from 'playwright'
import { mkdirSync, renameSync, copyFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const BASE = process.env.ACCEPTANCE_URL || 'http://127.0.0.1:4174/'
const OUT = resolve('docs/beauty-nails-brief/evidence')
mkdirSync(OUT, { recursive: true })

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms))
}

async function smoothScroll(page, toY, steps = 36) {
  const start = await page.evaluate(() => window.scrollY)
  for (let i = 1; i <= steps; i++) {
    const y = start + ((toY - start) * i) / steps
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await sleep(45)
  }
}

async function pinkSamples(page) {
  return page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel)
      if (!el) return null
      const cs = getComputedStyle(el)
      return {
        bg: cs.backgroundImage.slice(0, 60) || cs.backgroundColor,
        color: cs.color,
      }
    }
    return {
      body: pick('body'),
      header: pick('.site-header'),
      hero: pick('.hero-stage'),
      services: pick('.services'),
      experience: pick('.experience'),
      works: pick('.works'),
      booking: pick('.booking'),
      footer: pick('.site-footer'),
      storyP: getComputedStyle(document.documentElement).getPropertyValue('--story-p').trim(),
      cards: document.querySelectorAll('.service-card').length,
    }
  })
}

const browser = await chromium.launch({ headless: true })
const report = { at: new Date().toISOString(), base: BASE }

{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
  })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await sleep(1600)
  await page.evaluate(() => window.scrollTo(0, 0))
  await sleep(400)
  await page.screenshot({ path: resolve(OUT, 'pink-desktop-p0.png'), fullPage: false })
  report.desktopPink0 = await pinkSamples(page)

  const maxY = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
  const mid = Math.round(maxY * 0.28)
  const servicesY = await page.locator('#hizmetler').evaluate((el) => {
    return el.getBoundingClientRect().top + window.scrollY - 40
  })

  await smoothScroll(page, mid, 28)
  await sleep(300)
  await page.screenshot({ path: resolve(OUT, 'pink-desktop-approach.png'), fullPage: false })
  report.desktopApproach = await page.evaluate(() => ({
    storyP: getComputedStyle(document.documentElement).getPropertyValue('--story-p').trim(),
    scrollY: window.scrollY,
  }))

  await smoothScroll(page, Math.min(servicesY, maxY), 36)
  await sleep(400)
  await page.screenshot({ path: resolve(OUT, 'pink-desktop-services.png'), fullPage: false })

  await page.locator('#deneyim').scrollIntoViewIfNeeded()
  await sleep(350)
  await page.screenshot({ path: resolve(OUT, 'pink-desktop-experience.png'), fullPage: false })
  await page.locator('#calismalarimiz').scrollIntoViewIfNeeded()
  await sleep(300)
  await page.screenshot({ path: resolve(OUT, 'pink-desktop-works.png'), fullPage: false })
  await page.locator('#iletisim').scrollIntoViewIfNeeded()
  await sleep(300)
  await page.screenshot({ path: resolve(OUT, 'pink-desktop-booking.png'), fullPage: false })

  // Forward then back through hero pin for motion evidence
  await smoothScroll(page, 0, 30)
  await sleep(200)
  await smoothScroll(page, Math.round(maxY * 0.45), 40)
  await sleep(200)
  await smoothScroll(page, 0, 36)
  await sleep(300)

  const videoPath = await page.video().path()
  await context.close()
  const dest = resolve(OUT, 'pink-desktop-scroll.webm')
  try {
    renameSync(videoPath, dest)
  } catch {
    copyFileSync(videoPath, dest)
  }
  report.desktopVideo = dest
}

{
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
  await sleep(1600)
  await page.evaluate(() => window.scrollTo(0, 0))
  await sleep(300)
  await page.screenshot({ path: resolve(OUT, 'pink-mobile-p0.png'), fullPage: false })
  report.mobilePink0 = await pinkSamples(page)

  const maxY = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
  await smoothScroll(page, Math.round(maxY * 0.3), 30)
  await page.screenshot({ path: resolve(OUT, 'pink-mobile-mid.png'), fullPage: false })
  await smoothScroll(page, Math.round(maxY * 0.55), 28)
  await sleep(250)
  await smoothScroll(page, 0, 30)
  await sleep(250)

  const videoPath = await page.video().path()
  await context.close()
  const dest = resolve(OUT, 'pink-mobile-scroll.webm')
  try {
    renameSync(videoPath, dest)
  } catch {
    copyFileSync(videoPath, dest)
  }
  report.mobileVideo = dest
}

writeFileSync(resolve(OUT, 'pink-depth-metrics.json'), JSON.stringify(report, null, 2))
await browser.close()
console.log(JSON.stringify(report, null, 2))
console.log('done')
