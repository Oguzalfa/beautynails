import { build } from 'vite'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { pathToFileURL } from 'node:url'

await build({ build: { outDir: 'dist', emptyOutDir: true } })
await build({ publicDir: false, build: { ssr: 'src/entry-server.tsx', outDir: 'dist-ssr', emptyOutDir: true } })
const { render, contentPages, getSeo, siteConfig } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)
const template = await readFile('dist/index.html', 'utf8')
const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const verification = process.env.GOOGLE_SITE_VERIFICATION?.trim()
if (verification && !/^[a-zA-Z0-9_-]+$/.test(verification)) throw new Error('Invalid Google verification token')
const paths = ['/', ...contentPages.map((p) => p.path)]
for (const path of [...paths, '/not-found/']) {
  const seo = getSeo(path)
  const head = [
    `<title>${escape(seo.title)}</title>`,
    `<meta name="description" content="${escape(seo.description)}">`,
    `<meta name="robots" content="${seo.valid ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' : 'noindex, follow'}">`,
    ...(seo.canonical ? [`<link rel="canonical" href="${escape(seo.canonical)}">`] : []),
    `<meta property="og:site_name" content="BeautyNails">`, `<meta property="og:locale" content="tr_TR">`,
    `<meta property="og:type" content="${seo.type}">`, `<meta property="og:title" content="${escape(seo.title)}">`,
    `<meta property="og:description" content="${escape(seo.description)}">`,
    ...(seo.canonical ? [`<meta property="og:url" content="${escape(seo.canonical)}">`] : []),
    `<meta property="og:image" content="${escape(seo.image)}">`,
    `<meta property="og:image:alt" content="BeautyNails tırnak ve güzellik stüdyosu">`,
    `<meta name="twitter:card" content="summary_large_image">`, `<meta name="twitter:title" content="${escape(seo.title)}">`,
    `<meta name="twitter:description" content="${escape(seo.description)}">`, `<meta name="twitter:image" content="${escape(seo.image)}">`,
    ...(verification ? [`<meta name="google-site-verification" content="${escape(verification)}">`] : []),
    ...(seo.jsonLd ? [`<script type="application/ld+json">${JSON.stringify(seo.jsonLd).replaceAll('<', '\\u003c')}</script>`] : []),
  ].join('\n')
  let html = template.replace(/<title>[\s\S]*?<\/title>/, '').replace(/<meta\s+name="description"[\s\S]*?>/, '')
  if (path !== '/') html = html.replace(/<link[^>]+rel="preload"[^>]+as="image"[^>]*>/g, '')
  html = html.replace('</head>', `${head}\n</head>`).replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${render(path)}</div>`)
  const dest = path === '/not-found/' ? 'dist/404.html' : path === '/' ? 'dist/index.html' : `dist${path}index.html`
  await mkdir(dirname(dest), { recursive: true }); await writeFile(dest, html)
}
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${escape(siteConfig.url + path)}</loc></url>`).join('\n')}\n</urlset>\n`)
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${siteConfig.url}/sitemap.xml\n`)
console.log(`Generated ${paths.length} indexable static pages, sitemap, robots and 404.`)
