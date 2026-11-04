import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { siteConfig } from '../src/config/site.ts'

const seo=JSON.parse(await readFile('src/config/seo.json','utf8'))
const services=JSON.parse(await readFile('src/content/services-seo.json','utf8'))
const articles=JSON.parse(await readFile('src/content/journal.json','utf8'))
const origin=seo.origin
if(origin!=='https://www.sazibeauty.com')throw new Error('Wrong production SEO origin')
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const json=value=>JSON.stringify(value).replace(/</g,'\\u003c')
const absolute=path=>new URL(path,origin).href
const orgId=origin+'/#organization',siteId=origin+'/#website'
const organization={'@type':'Organization','@id':orgId,name:siteConfig.brand,url:origin+'/',description:seo.description,logo:absolute('/favicon.svg'),image:absolute(seo.socialImage),telephone:'+'+siteConfig.whatsappNumber,sameAs:[siteConfig.instagramUrl],contactPoint:[{'@type':'ContactPoint',telephone:'+'+siteConfig.whatsappNumber,contactType:'customer service',availableLanguage:['tr']}]}
const website={'@type':'WebSite','@id':siteId,url:origin+'/',name:siteConfig.brand,inLanguage:'tr-TR',publisher:{'@id':orgId}}
const verification=String(process.env.GOOGLE_SITE_VERIFICATION||seo.googleSiteVerification||'').trim()
if(verification&&!/^[A-Za-z0-9_-]{10,200}$/.test(verification))throw new Error('Invalid Google verification token: use the content value, not HTML')
function metadata(html,{path,title,description,type='website',image=seo.socialImage,graph=[]}){
  const url=absolute(path)
  html=html.replace(/<title>[\s\S]*?<\/title>/gi,'')
    .replace(/<meta\b(?=[^>]*(?:name=["'](?:description|robots|google-site-verification|twitter:[^"']*)["']|property=["']og:[^"']*["']))[^>]*>/gi,'')
    .replace(/<link\b(?=[^>]*rel=["']canonical["'])[^>]*>/gi,'')
    .replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,'')
  const webpage={'@type':type==='article'?'WebPage':path==='/iletisim/'?'ContactPage':'WebPage','@id':url+'#webpage',url,name:title,description,inLanguage:'tr-TR',isPartOf:{'@id':siteId},about:{'@id':orgId}}
  const head=`<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${url}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><meta property="og:type" content="${type}"><meta property="og:locale" content="tr_TR"><meta property="og:site_name" content="${esc(siteConfig.brand)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${absolute(image)}"><meta property="og:image:alt" content="${esc(siteConfig.brand+' güzellik ve bakım seçkisi')}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${absolute(image)}">${path==='/'&&verification?`<meta name="google-site-verification" content="${esc(verification)}">`:''}<script type="application/ld+json">${json({'@context':'https://schema.org','@graph':[organization,website,webpage,...graph]})}</script>`
  return html.replace('</head>',head+'</head>')
}

const ssrDir=resolve('node_modules/.cache/sazi-ssr')
const ssrEntry=(await readdir(ssrDir)).find(name=>/^entry-server\.(m?js)$/.test(name))
if(!ssrEntry)throw new Error('Missing homepage prerender bundle')
const {render}=await import(pathToFileURL(resolve(ssrDir,ssrEntry)).href)
let home=await readFile('dist/index.html','utf8')
if(!home.includes('<div id="root"></div>'))throw new Error('Unexpected homepage mount point')
home=home.replace('<div id="root"></div>',()=>`<div id="root">${render()}</div>`)
const serviceGraph=services.map(s=>({'@type':'Service','@id':absolute(`/hizmetler/${s.slug}/`)+'#service',name:s.title,serviceType:s.title,description:s.description,url:absolute(`/hizmetler/${s.slug}/`),provider:{'@id':orgId}}))
await writeFile('dist/index.html',metadata(home,{path:'/',title:seo.title,description:seo.description,graph:serviceGraph}))

const stylesheet=(await readdir('dist/assets')).find(name=>/^editorial-[0-9a-f]+\.css$/.test(name))
if(!stylesheet)throw new Error('Missing shared reading stylesheet')
const brand=`<a class="sz-reading-brand" href="/">${esc(siteConfig.wordmark)}<small>${esc(siteConfig.tagline)}</small></a>`
const footer=`<footer class="sz-reading-footer"><div class="sz-content">${brand}<a href="/bakim-rehberi/">Bakım notları</a><a href="/iletisim/">İletişim</a><a href="/#iletisim">Randevu Al ↗</a></div></footer>`
const shell=body=>`<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/${stylesheet}"><meta name="theme-color" content="#fad3e1"></head><body class="sz-theme sz-article-page"><header class="sz-content"><div class="sz-reading-header">${brand}<a class="sz-pill-link" href="/">Stüdyoya dön ↗</a></div></header>${body}${footer}</body></html>`
const breadcrumb=(title,path)=>({'@type':'BreadcrumbList','@id':absolute(path)+'#breadcrumb',itemListElement:[{'@type':'ListItem',position:1,name:siteConfig.brand,item:origin+'/'},{'@type':'ListItem',position:2,name:title,item:absolute(path)}]})
const serviceLinks=`<nav class="sz-related-grid" aria-label="Diğer hizmetler">${services.map(s=>`<a class="sz-related-link" href="/hizmetler/${s.slug}/"><span><small>HİZMET REHBERİ</small><strong>${esc(s.title)}</strong></span></a>`).join('')}</nav>`
for(const service of services){
  const path=`/hizmetler/${service.slug}/`
  const related=articles.find(a=>a.slug===service.relatedArticle)
  const body=`<main class="sz-content"><div class="sz-reading-hero"><div><ol class="sz-breadcrumbs" aria-label="Sayfa yolu"><li><a href="/">Şazi Beauty</a></li><li>/</li><li><a href="/#hizmetler">Hizmetler</a></li></ol><p class="sz-eyebrow">HİZMET REHBERİ</p><h1>${esc(service.title)}</h1><p class="sz-reading-deck">${esc(service.description)}</p></div><figure class="sz-reading-cover"><img src="${esc(service.image)}" alt="${esc(service.title)} için güzellik seçkisi" width="1200" height="900" fetchpriority="high"></figure></div><article class="sz-reading-body"><p class="sz-reading-intro">${esc(service.intro)}</p>${service.sections.map(section=>`<section><h2>${esc(section.title)}</h2>${section.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</section>`).join('')}<section><h2>Sık sorulan sorular</h2>${service.questions.map(q=>`<details><summary>${esc(q.question)}</summary><p>${esc(q.answer)}</p></details>`).join('')}</section>${related?`<a class="sz-under-link" href="/bakim-rehberi/${related.slug}/">${esc(related.title)} ↗</a>`:''}<aside class="sz-reading-cta"><p>Size uygun bakımı<br />birlikte planlayalım.</p><a class="sz-pill-link" href="/#iletisim">Randevu Al ↗</a></aside></article><section class="sz-related"><h2>Diğer bakım seçenekleri</h2>${serviceLinks}</section></main>`
  const file=resolve('dist',path.slice(1),'index.html');await mkdir(resolve(file,'..'),{recursive:true})
  await writeFile(file,metadata(shell(body),{path,title:service.title+' | '+siteConfig.brand,description:service.description,graph:[serviceGraph.find(s=>s.url===absolute(path)),breadcrumb(service.title,path)]}))
}
const contactDescription='Şazi Beauty randevu ve hizmet bilgileri: 0501 128 18 08. Telefon, WhatsApp ve Instagram üzerinden iletişime geçin; bakım seçeneklerini birlikte planlayalım.'
await mkdir('dist/iletisim',{recursive:true})
await writeFile('dist/iletisim/index.html',metadata(shell(`<main class="sz-content"><div class="sz-index-hero"><p class="sz-eyebrow">ŞAZİ BEAUTY / İLETİŞİM</p><h1>Size özel bir <em>dokunuş.</em></h1><p class="sz-reading-deck">Bakım seçenekleri ve randevu için bize ulaşın.</p></div><div class="sz-reading-body"><h2>Şazi Beauty ile iletişim</h2><p>Telefon: <a href="tel:+${siteConfig.whatsappNumber}">${esc(siteConfig.phone)}</a></p><p><a class="sz-pill-link" href="https://wa.me/${siteConfig.whatsappNumber}" target="_blank" rel="noopener noreferrer">WhatsApp ile iletişim ↗</a></p><p><a href="${esc(siteConfig.instagramUrl)}" target="_blank" rel="noopener noreferrer">Instagram: @sazibeauty</a></p><p>İlgilendiğiniz hizmeti, uygun olduğunuz zaman aralığını ve varsa stil notlarınızı paylaşabilirsiniz. Randevu talebiniz ve hizmet ayrıntıları görüşmede netleştirilir.</p><a class="sz-pill-link" href="/#iletisim">Randevu formunu aç ↗</a></div><section class="sz-related">${serviceLinks}</section></main>`),{path:'/iletisim/',title:'İletişim ve Randevu | '+siteConfig.brand,description:contactDescription,graph:[breadcrumb('İletişim','/iletisim/')]}))

for(const path of['/bakim-rehberi/',...articles.map(a=>`/bakim-rehberi/${a.slug}/`)]){
  const file=resolve('dist',path.slice(1),'index.html');let html=await readFile(file,'utf8')
  const existing=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
  const article=articles.find(a=>path===`/bakim-rehberi/${a.slug}/`)
  const graph=(Array.isArray(existing)?existing:[existing]).map(item=>{
    delete item['@context']
    if(item['@type']==='BlogPosting'){item['@id']=absolute(path)+'#article';item.author={'@id':orgId};item.publisher={'@id':orgId};item.mainEntityOfPage={'@id':absolute(path)+'#webpage'}}
    return item
  })
  await writeFile(file,metadata(html,{path,title:article?article.title+' | '+siteConfig.brand:'Bakım Notları ve Stil Rehberi | '+siteConfig.brand,description:article?.excerpt||'Şazi Beauty’den tırnak stili, kirpik görünümü ve renk uyumu üzerine özgün bakım ve stil notları.',type:article?'article':'website',graph}))
}
const paths=['/',...services.map(s=>`/hizmetler/${s.slug}/`),'/iletisim/','/bakim-rehberi/',...articles.map(a=>`/bakim-rehberi/${a.slug}/`)]
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path=>`<url><loc>${absolute(path)}</loc></url>`).join('')}</urlset>`)
await writeFile('dist/404.html',shell('<main class="sz-content sz-index-hero"><h1>Bu sayfa bulunamadı.</h1><a class="sz-pill-link" href="/">Ana sayfaya dön ↗</a></main>').replace('</head>','<title>Sayfa bulunamadı | Şazi Beauty</title><meta name="robots" content="noindex,follow"></head>'))
console.log(`SEO build: homepage prerendered; ${paths.length} canonical pages; verified business fields only; Search Console token ${verification?'configured':'not supplied'}.`)
