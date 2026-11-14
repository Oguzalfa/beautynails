import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { resolve, extname } from 'node:path'
import { chromium, webkit } from 'playwright'

const dist = resolve('dist')
const output = resolve(process.env.QA_OUT || '../.sazi-gallery-qa')
await mkdir(output,{recursive:true})
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.mp4':'video/mp4','.ttf':'font/ttf','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain'}
const server=createServer(async(req,res)=>{
  try {
    const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname)
    const file=resolve(dist,'.'+(path.endsWith('/')?path+'index.html':path))
    if(!file.startsWith(dist+'/')&&!file.startsWith(dist+'\\'))throw new Error('Invalid path')
    const data=await readFile(file)
    const contentType=types[extname(file)]||'application/octet-stream'
    const range=extname(file)==='.mp4' && /^bytes=(\d+)-(\d*)$/.exec(req.headers.range||'')
    if(range){
      const start=Number(range[1])
      const end=Math.min(range[2]?Number(range[2]):data.length-1,data.length-1)
      if(start>end){res.writeHead(416,{'Content-Range':`bytes */${data.length}`});res.end();return}
      const chunk=data.subarray(start,end+1)
      res.writeHead(206,{'Content-Type':contentType,'Accept-Ranges':'bytes','Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':chunk.length});res.end(chunk);return
    }
    res.writeHead(200,{'Content-Type':contentType,'Content-Length':data.length});res.end(data)
  }catch{res.writeHead(404);res.end('Not found')}
})
await new Promise(r=>server.listen(0,'127.0.0.1',r))
const base=process.env.QA_URL||`http://127.0.0.1:${server.address().port}`
const engine=process.env.QA_ENGINE||'chromium'
const browser=await(engine==='webkit'?webkit:chromium).launch({headless:true})
const articles=JSON.parse(await readFile('src/content/journal.json','utf8'))
const articlePaths=articles.map(article=>`/bakim-rehberi/${article.slug}/`)
const reports=[]
const label=process.env.QA_LABEL||engine
try{
  assert.equal(articles.length,6,'Six articles in the full journal')
  for(const width of(process.env.QA_WIDTHS||'320,390,430,768,1024,1440').split(',').map(Number)){
    const height=Number(process.env.QA_HEIGHT)||(width<768?844:1000)
    const context=await browser.newContext({locale:'tr-TR',viewport:{width,height},isMobile:width<768,hasTouch:width<768,deviceScaleFactor:1,reducedMotion:'reduce'})
    const page=await context.newPage()
    const errors=[],failed=[]
    page.on('pageerror',e=>errors.push(e.message))
    page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`)})
    async function ready(){
      await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>null)}))})
    }
    async function bounds(){
      return page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,broken:[...document.images].filter(i=>i.getClientRects().length&&(!i.complete||!i.naturalWidth)).map(i=>i.src),clipped:[...document.querySelectorAll('h1,h2,h3,.sz-section-intro,.sz-article-card-copy,.sz-shot-caption,.sz-reading-brand,.sz-pill-link,.sz-related-link,.sz-filters')].filter(e=>{const r=e.getBoundingClientRect();return !e.matches('.bn-sr,.sr-only')&&r.width>0&&(e.scrollWidth>e.clientWidth+1||r.right>innerWidth+1||r.left<-.5)}).map(e=>({tag:e.tagName,class:e.className,text:e.textContent.slice(0,80)}))}))
    }
    await page.goto(base,{waitUntil:'load'})
    await page.locator('.bn-header').waitFor({state:'attached'})
    await ready()
    const home=await bounds()
    assert.equal(home.scroll,width,'Homepage overflow')
    assert.deepEqual(home.broken,[],'Homepage images')
    assert.deepEqual(home.clipped,[],'Homepage clipped text')
    await page.screenshot({path:resolve(output,`${label}-${width}-hero.png`)})
    const variant=width<768?'mobile':'desktop'
    const gallery=page.locator(`.sz-gallery.sz-only-${variant}`)
    const journal=page.locator(`.sz-journal.sz-only-${variant}`)
    assert.equal(await gallery.locator('.sz-shot').count(),8,'Eight featured photos')
    assert.equal(await gallery.locator('video').count(),0,'Video resources are absent before playback')
    const homepageArticles=await journal.locator('a.sz-article-card').evaluateAll(cards=>cards.map(card=>card.getAttribute('href')))
    assert.deepEqual(homepageArticles,articlePaths.slice(0,3),'Three current articles on the homepage')
    assert.ok(await journal.locator('a.sz-pill-link[href="/bakim-rehberi/"]').isVisible(),'Visible link to the complete journal')
    await gallery.screenshot({path:resolve(output,`${label}-${width}-gallery.png`)})
    await journal.screenshot({path:resolve(output,`${label}-${width}-journal.png`)})
    for(const [category,count] of[['French',3],['Sade',5],['Desenli',16],['Videolar',4],['İlham',6],['Tümü',8]]){
      await gallery.getByRole('button',{name:category,exact:true}).click()
      assert.equal(await gallery.locator('.sz-shot').count(),count,category+' filter')
    }
    await gallery.getByRole('button',{name:'Tüm fotoğrafları göster',exact:true}).click()
    assert.equal(await gallery.locator('.sz-shot').count(),24,'Complete studio photo collection')
    await gallery.getByRole('button',{name:'Seçkiyi göster',exact:true}).click()
    assert.equal(await gallery.locator('.sz-shot').count(),8,'Returns to the featured photos')
    const opener=gallery.locator('.sz-shot').first()
    await opener.click()
    const dialog=page.locator('.sz-lightbox[open]')
    await dialog.waitFor()
    await dialog.locator('img').evaluate(i=>i.decode())
    const first=await dialog.locator('img').getAttribute('src')
    await dialog.getByRole('button',{name:'Sonraki',exact:true}).click()
    const second=await dialog.locator('img').getAttribute('src')
    assert.notEqual(first,second,'Lightbox next image')
    await page.keyboard.press('ArrowLeft')
    assert.equal(await dialog.locator('img').getAttribute('src'),first,'Lightbox keyboard previous')
    await page.keyboard.press('Escape')
    assert.equal(await page.locator('.sz-lightbox[open]').count(),0,'Lightbox closes')
    assert.equal(await opener.evaluate(e=>e===document.activeElement),true,'Lightbox restores focus')
    await gallery.getByRole('button',{name:'Videolar',exact:true}).click()
    assert.equal(await gallery.locator('video').count(),0,'Video poster thumbnails do not create players')
    const videoOpener=gallery.getByRole('button',{name:'Pembe French · Videoyu oynat',exact:true})
    await videoOpener.click()
    const player=dialog.locator('video')
    await player.waitFor()
    assert.equal(await player.getAttribute('src'),'/images/studio/clip-01.mp4','Selected video opens')
    assert.equal(await player.evaluate(video=>video.controls&&video.playsInline&&video.muted),true,'Video controls, inline and muted playback')
    await page.waitForFunction(()=>document.querySelector('.sz-lightbox[open] video')?.readyState>=2)
    await dialog.getByRole('button',{name:'Sonraki',exact:true}).click()
    assert.equal(await player.getAttribute('src'),'/images/studio/clip-02.mp4','Video navigation replaces the player')
    await page.keyboard.press('Escape')
    assert.equal(await gallery.locator('video').count(),0,'Closing stops and removes the video')
    assert.equal(await videoOpener.evaluate(e=>e===document.activeElement),true,'Video dialog restores focus')
    await page.goto(base+'/#calismalarimiz')
    await page.locator('.bn-header').waitFor({state:'attached'})
    await ready()
    await page.waitForTimeout(100)
    const galleryPosition=await page.locator(`.sz-gallery.sz-only-${variant}`).boundingBox()
    assert.ok(galleryPosition.y>=60&&galleryPosition.y<=110,'Direct gallery link')
    await page.goto(base+'/#makaleler')
    await page.locator('.bn-header').waitFor({state:'attached'})
    await ready()
    await page.waitForTimeout(100)
    const journalPosition=await page.locator(`.sz-journal.sz-only-${variant}`).boundingBox()
    assert.ok(journalPosition.y>=60&&journalPosition.y<=110,'Direct journal link')
    const firstArticle=page.locator(`.sz-journal.sz-only-${variant} .sz-article-card`).first()
    await firstArticle.click()
    await page.waitForURL(base+articlePaths[0])
    assert.equal(await page.locator('h1').count(),1,'Article opens through card')
    assert.equal(await page.locator('h1').innerText(),articles[0].title,'Lead card opens the current lead article')
    for(const article of articles){
      const response=await page.goto(base+`/bakim-rehberi/${article.slug}/`,{waitUntil:'load'})
      assert.equal(response.status(),200,'Article direct URL')
      await ready()
      const checks=await bounds()
      assert.equal(checks.scroll,width,'Article overflow: '+article.slug)
      assert.deepEqual(checks.broken,[],'Article images')
      assert.deepEqual(checks.clipped,[],'Article clipped text: '+article.slug)
      assert.equal(await page.locator('h1').count(),1,'One article H1')
      assert.equal(await page.locator('.sz-reading-body h2').count(),article.sections.length,'Complete article body')
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://www.sazibeauty.com/bakim-rehberi/'+article.slug+'/','Article canonical')
      const schema=await page.locator('script[type="application/ld+json"]').textContent()
      assert.equal(JSON.parse(schema)['@graph'].find(item=>item['@type']==='BlogPosting')?.['@type'],'BlogPosting','Article structured data')
      assert.equal(await page.locator('.sz-reading-cta a').getAttribute('href'),'/#iletisim','Original booking path')
      await page.screenshot({path:resolve(output,`${label}-${width}-${article.slug}.png`),fullPage:width===390})
    }
    const listingResponse=await page.goto(base+'/bakim-rehberi/',{waitUntil:'load'})
    assert.equal(listingResponse.status(),200,'Journal index direct URL')
    const listedArticles=await page.locator('.sz-index-grid a.sz-article-card').evaluateAll(cards=>cards.map(card=>card.getAttribute('href')))
    assert.deepEqual(listedArticles,articlePaths,'All articles appear on the journal index in order')
    for(const path of['/robots.txt','/sitemap.xml']){
      const response=await context.request.get(base+path)
      assert.equal(response.status(),200,path)
    }
    assert.deepEqual(errors,[],'Browser errors')
    assert.deepEqual(failed,[],'Network errors')
    reports.push({width,height,engine,gallery:24,videos:4,articles:articles.length,homepageArticleCards:3,listingLink:true,filters:true,lightbox:true,hashes:true,articleRoutes:true,overflow:false,result:'PASS'})
    console.log(`PASS ${engine} ${width}x${height}: 24 photos, 4 video posters with on-demand player, 3 homepage cards, ${articles.length} complete articles, no overflow/errors`)
    await context.close()
  }
}finally{
  await writeFile(resolve(output,`${label}-report.json`),JSON.stringify(reports,null,2))
  await browser.close();server.close()
}
