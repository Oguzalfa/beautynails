import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import { siteConfig } from '../src/config/site.ts'

const origin = 'https://www.sazibeauty.com'
const articles = JSON.parse(await readFile('src/content/journal.json','utf8'))
const images = JSON.parse(await readFile('src/content/editorial-images.json','utf8'))
const styles = await readFile('src/styles/editorial.css','utf8')
const stylesheet = `/assets/editorial-${createHash('sha256').update(styles).digest('hex').slice(0,10)}.css`
await writeFile(resolve('dist', '.'+stylesheet),styles)
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))
const url = slug => `/bakim-rehberi/${slug}/`
const image = (key,width=1200) => `/images/editorial/${key}-${width}.webp`
const srcset = key => images.find(item=>item.key===key).variants.map(item=>`/images/editorial/${item.file} ${item.width}w`).join(', ')
const brand = `<a class="sz-reading-brand" href="/">${escape(siteConfig.wordmark)}<small>${escape(siteConfig.tagline)}</small></a>`
const header = `<header class="sz-content"><div class="sz-reading-header">${brand}<a class="sz-pill-link" href="/">Stüdyoya dön <span aria-hidden="true">↗</span></a></div></header>`
const footer = `<footer class="sz-reading-footer"><div class="sz-content">${brand}<a href="/#makaleler">Tüm makaleler</a><a href="/#iletisim">Randevu Al ↗</a><a href="${escape(siteConfig.instagramUrl)}" target="_blank" rel="noopener noreferrer">Instagram</a><small>© 2026 ${escape(siteConfig.brand)}</small></div></footer>`
function document({title,description,path,cover,content,schema}) {
  return `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#fad3e1"><title>${escape(title)} | ${escape(siteConfig.brand)}</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${origin}${path}"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preload" as="font" href="/fonts/Inter-Variable.ttf" type="font/ttf" crossorigin><link rel="preload" as="font" href="/fonts/BodoniModa-Italic-Variable.ttf" type="font/ttf" crossorigin><link rel="stylesheet" href="${stylesheet}"><meta property="og:type" content="article"><meta property="og:locale" content="tr_TR"><meta property="og:site_name" content="${escape(siteConfig.brand)}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${origin}${path}"><meta property="og:image" content="${origin}${cover}"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script></head><body class="sz-theme sz-article-page">${header}${content}${footer}</body></html>`
}
function card(article,index) {
  return `<a class="sz-article-card" href="${url(article.slug)}"><div class="sz-article-image"><img src="${image(article.image,480)}" srcset="${srcset(article.image)}" sizes="(max-width:767px) 90vw,30vw" width="1200" height="1000" alt="${escape(article.alt)}" loading="lazy" decoding="async"><span class="sz-article-number">${String(index+1).padStart(2,'0')}</span></div><div class="sz-article-card-copy"><p class="sz-article-meta"><span>${escape(article.category)}</span><span>${article.readTime} okuma</span></p><h3>${escape(article.title)}</h3><p class="sz-article-excerpt">${escape(article.excerpt)}</p><span class="sz-article-read">Yazıyı oku <span class="sz-round-arrow" aria-hidden="true">↗</span></span></div></a>`
}

for (const article of articles) {
  if (!/^[a-z0-9-]+$/.test(article.slug) || !images.some(item=>item.key===article.image)) throw new Error('Invalid editorial metadata')
  const related = articles.filter(item => item.slug !== article.slug)
  const content = `<main><article class="sz-content">
  <div class="sz-reading-hero"><div><ol class="sz-breadcrumbs" aria-label="Sayfa yolu"><li><a href="/">Şazi Beauty</a></li><li aria-hidden="true">/</li><li><a href="/bakim-rehberi/">Bakım notları</a></li></ol><p class="sz-article-meta"><span>${escape(article.category)}</span><span>${article.readTime} okuma</span></p><h1>${escape(article.title)}</h1><p class="sz-reading-deck">${escape(article.excerpt)}</p></div><figure class="sz-reading-cover"><img src="${image(article.image)}" srcset="${srcset(article.image)}" sizes="(min-width:768px) 45vw,90vw" width="1200" height="1000" alt="${escape(article.alt)}" fetchpriority="high"><span>ŞAZİ JOURNAL <span aria-hidden="true">✦</span></span></figure></div>
  <div class="sz-reading-body"><p class="sz-reading-intro">${escape(article.intro)}</p><nav class="sz-reading-toc" aria-label="Bu yazıda"><strong>Bu yazıda</strong><ol>${article.sections.map((section,index)=>`<li><a href="#not-${index+1}">${escape(section.title)}</a></li>`).join('')}</ol></nav>${article.sections.map((section,index)=>`<section aria-labelledby="not-${index+1}"><h2 id="not-${index+1}">${escape(section.title)}</h2>${section.paragraphs.map(paragraph=>`<p>${escape(paragraph)}</p>`).join('')}</section>${index===0?`<blockquote class="sz-reading-quote">${escape(article.quote)}</blockquote>`:''}`).join('')}<aside class="sz-reading-cta"><p>Size özel bir dokunuş.<br />Birlikte planlayalım.</p><a class="sz-pill-link" href="/#iletisim">Randevu Al <span aria-hidden="true">↗</span></a></aside></div>
  </article><section class="sz-content sz-related" aria-labelledby="related-title"><h2 id="related-title">Biraz daha ilham.</h2><div class="sz-related-grid">${related.map(item=>`<a class="sz-related-link" href="${url(item.slug)}"><img src="${image(item.image,480)}" width="112" height="112" alt="${escape(item.alt)}" loading="lazy"><span><small>${escape(item.category)}</small><strong>${escape(item.title)}</strong></span></a>`).join('')}</div></section></main>`
  const schema = [
    {'@context':'https://schema.org','@type':'BlogPosting',headline:article.title,description:article.excerpt,image:origin+image(article.image),datePublished:article.date,dateModified:article.date,inLanguage:'tr-TR',author:{'@type':'Organization',name:siteConfig.brand,url:origin},publisher:{'@type':'Organization',name:siteConfig.brand,url:origin},mainEntityOfPage:origin+url(article.slug)},
    {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:siteConfig.brand,item:origin+'/'},{'@type':'ListItem',position:2,name:'Bakım notları',item:origin+'/bakim-rehberi/'},{'@type':'ListItem',position:3,name:article.title,item:origin+url(article.slug)}]},
  ]
  const output = resolve('dist/bakim-rehberi',article.slug)
  await mkdir(output,{recursive:true})
  await writeFile(resolve(output,'index.html'),document({title:article.title,description:article.excerpt,path:url(article.slug),cover:image(article.image),content,schema}))
}
const listing = `<main class="sz-content"><div class="sz-index-hero"><p class="sz-eyebrow">ŞAZİ JOURNAL / MAKALELER</p><h1>Güzelliğin <em>ince notları.</em></h1><p class="sz-reading-deck">Biraz ilham, biraz stil. Kendinize ayırdığınız zamana eşlik etsin.</p></div><div class="sz-journal-grid sz-index-grid">${articles.map(card).join('')}</div></main>`
await mkdir('dist/bakim-rehberi',{recursive:true})
await writeFile('dist/bakim-rehberi/index.html',document({title:'Bakım notları',description:'Şazi Beauty’den tırnak stili, bakış ve renk uyumu üzerine küçük fikirler.',path:'/bakim-rehberi/',cover:image('fuchsia-french'),content:listing,schema:{'@context':'https://schema.org','@type':'CollectionPage',name:'Şazi Beauty bakım notları',url:origin+'/bakim-rehberi/'}}))
const paths = ['/','/bakim-rehberi/',...articles.map(article=>url(article.slug))]
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path=>`<url><loc>${origin}${path}</loc></url>`).join('')}</urlset>`)
console.log(`Built ${articles.length} articles, the journal index and sitemap.`)
