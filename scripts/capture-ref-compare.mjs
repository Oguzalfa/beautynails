import { chromium, devices } from 'playwright'
import { mkdirSync, renameSync, copyFileSync, existsSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const BASE = process.env.ACCEPTANCE_URL || 'http://127.0.0.1:4174/'
const OUT = resolve('docs/beauty-nails-brief/evidence')
mkdirSync(OUT, { recursive: true })

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms))
}

async function smoothScroll(page, toY, steps = 24) {
  const start = await page.evaluate(() => window.scrollY)
  for (let i = 1; i <= steps; i++) {
    const y = start + ((toY - start) * i) / steps
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await sleep(40)
  }
}

const browser = await chromium.launch({ headless: true })

// Desktop
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
  })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await sleep(700)
  await page.evaluate(() => {
    window.scrollTo(0, 30)
  })
  await sleep(900)
  await page.evaluate(() => window.scrollTo(0, 0))
  await sleep(400)
  await page.screenshot({ path: resolve(OUT, 'compose-desktop-1440.png'), fullPage: false })

  const metrics = await page.evaluate(() => {
    const hero = document.querySelector('.hero-stage')?.getBoundingClientRect()
    const strip = document.querySelector('.category-strip')?.getBoundingClientRect()
    const services = document.querySelector('#hizmetler')?.getBoundingClientRect()
    const portrait = document.querySelector('.hero-portrait img')?.getBoundingClientRect()
    const cards = [...document.querySelectorAll('.service-card')].map((el) =>
      el.getBoundingClientRect(),
    )
    const header = document.querySelector('.site-header')?.getBoundingClientRect()
    const h1 = document.querySelector('h1')
    const h1Style = h1 ? getComputedStyle(h1) : null
    const cardsFullyInView = cards.length === 4 && cards.every((r) => r.bottom <= innerHeight + 8 && r.top >= 0)
    const cardsMostlyInView =
      cards.length === 4 && cards.every((r) => r.top < innerHeight - 24 && r.bottom > 0)
    return {
      headerH: header?.height ?? null,
      heroH: hero?.height ?? null,
      stripH: strip?.height ?? null,
      stripInView: !!strip && strip.top < innerHeight && strip.bottom > 0,
      servicesTop: services?.top ?? null,
      servicesStartsInFirstScreen: !!services && services.top < innerHeight + 40,
      cardsFullyInView,
      cardsMostlyInView,
      cardHeights: cards.map((r) => Math.round(r.height)),
      portraitW: portrait?.width ?? null,
      portraitH: portrait?.height ?? null,
      h1FontSize: h1Style?.fontSize ?? null,
      h1FontFamily: h1Style?.fontFamily ?? null,
      h1Lines: h1 ? h1.querySelectorAll('.hero-line').length : 0,
      canvas: !!document.querySelector('canvas.hero-canvas'),
    }
  })

  const hizmetY = await page.locator('#hizmetler').evaluate((el) => {
    return el.getBoundingClientRect().top + window.scrollY - 60
  })
  await smoothScroll(page, Math.round(hizmetY * 0.45), 20)
  await page.screenshot({ path: resolve(OUT, 'compose-desktop-mid.png'), fullPage: false })
  await smoothScroll(page, hizmetY, 22)
  await page.screenshot({ path: resolve(OUT, 'compose-desktop-services.png'), fullPage: false })
  await smoothScroll(page, 0, 20)

  const videoPath = await page.video().path()
  await context.close()
  const dest = resolve(OUT, 'compose-desktop-scroll.webm')
  try {
    renameSync(videoPath, dest)
  } catch {
    copyFileSync(videoPath, dest)
  }

  writeFileSync(
    resolve(OUT, 'compose-metrics.json'),
    JSON.stringify({ desktop: metrics, video: dest, at: new Date().toISOString() }, null, 2),
  )
  console.log('desktop', metrics)
}

// Mobile
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
  await sleep(700)
  await page.evaluate(() => window.scrollTo(0, 20))
  await sleep(800)
  await page.evaluate(() => window.scrollTo(0, 0))
  await sleep(300)
  await page.screenshot({ path: resolve(OUT, 'compose-mobile-390.png'), fullPage: false })

  const mobile = await page.evaluate(() => {
    const copy = document.querySelector('.hero-copy')?.getBoundingClientRect()
    const visual = document.querySelector('.hero-visual')?.getBoundingClientRect()
    const bar = document.querySelector('.mobile-bar')
    return {
      textAbove: !!(copy && visual && copy.top < visual.top),
      bar: !!bar && getComputedStyle(bar).display !== 'none',
      overflowX: document.documentElement.scrollWidth > innerWidth + 2,
    }
  })

  const hizmetY = await page.locator('#hizmetler').evaluate((el) => {
    return el.getBoundingClientRect().top + window.scrollY - 70
  })
  await smoothScroll(page, Math.round(hizmetY * 0.5), 18)
  await page.screenshot({ path: resolve(OUT, 'compose-mobile-mid.png'), fullPage: false })
  await smoothScroll(page, hizmetY, 20)
  await smoothScroll(page, 0, 18)

  const videoPath = await page.video().path()
  await context.close()
  const dest = resolve(OUT, 'compose-mobile-scroll.webm')
  try {
    renameSync(videoPath, dest)
  } catch {
    copyFileSync(videoPath, dest)
  }

  const prev = existsSync(resolve(OUT, 'compose-metrics.json'))
    ? JSON.parse(await import('fs').then((fs) => fs.readFileSync(resolve(OUT, 'compose-metrics.json'), 'utf8')))
    : {}
  writeFileSync(
    resolve(OUT, 'compose-metrics.json'),
    JSON.stringify({ ...prev, mobile, mobileVideo: dest }, null, 2),
  )
  console.log('mobile', mobile)
}

await browser.close()
console.log('done')
