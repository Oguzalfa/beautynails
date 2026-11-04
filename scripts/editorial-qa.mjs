import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { resolve, extname } from 'node:path'
import { chromium, webkit } from 'playwright'

const dist = resolve('dist')
const output = resolve(process.env.QA_OUT || '../.sazi-gallery-qa')
await mkdir(output,{recursive:true})
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.ttf':'font/ttf','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain'}
const server=createServer(async(req,res)=>{
  try {
    const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname)
    const file=resolve(dist,'.'+(path.endsWith('/')?path+'index.html':path))
    if(!file.startsWith(dist+'/')&&!file.startsWith(dist+'\\'))throw new Error('Invalid path')
    res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(await readFile(file))
  }catch{res.writeHead(404);res.end('Not found')}
})
await new Promise(r=>server.listen(0,'127.0.0.1',r))
const base=process.env.QA_URL||`http://127.0.0.1:${server.address().port}`
const engine=process.env.QA_ENGINE||'chromium'
const browser=await(engine==='webkit'?webkit:chromium).launch({headless:true})
const articles=JSON.parse(await readFile('src/content/journal.json','utf8'))
const reports=[]
const label=process.env.QA_LABEL||engine
try{
  for(const width of(process.env.QA_WIDTHS||'320,390,430,768,1024,1440').split(',').map(Number)){
    const height=Number(process.env.QA_HEIGHT)||(width<768?844:1000)
    const context=await browser.newContext({viewport:{width,height},isMobile:width<768,hasTouch:width<768,deviceScaleFactor:1,reducedMotion:'reduce'})
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
    assert.equal(await gallery.locator('.sz-shot').count(),6,'Six curated images')
    assert.equal(await journal.locator('.sz-article-card').count(),3,'Three articles')
    await gallery.screenshot({path:resolve(output,`${label}-${width}-gallery.png`)})
    await journal.screenshot({path:resolve(output,`${label}-${width}-journal.png`)})
    for(const [category,count] of[['Tırnak',3],['Kirpik',1],['Makyaj',2],['Tümü',6]]){
      await gallery.getByRole('button',{name:category,exact:true}).click()
      assert.equal(await gallery.locator('.sz-shot').count(),count,category+' filter')
    }
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
    await page.waitForURL('**/bakim-rehberi/tirnak-formu-ve-kisisel-stil/')
    assert.equal(await page.locator('h1').count(),1,'Article opens through card')
    for(const article of articles){
      const response=await page.goto(base+`/bakim-rehberi/${article.slug}/`,{waitUntil:'load'})
      assert.equal(response.status(),200,'Article direct URL')
      await ready()
      const checks=await bounds()
      assert.equal(checks.scroll,width,'Article overflow: '+article.slug)
      assert.deepEqual(checks.broken,[],'Article images')
      assert.deepEqual(checks.clipped,[],'Article clipped text: '+article.slug)
      assert.equal(await page.locator('h1').count(),1,'One article H1')
      assert.equal(await page.locator('.sz-reading-body h2').count(),4,'Complete article body')
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://www.sazibeauty.com/bakim-rehberi/'+article.slug+'/','Article canonical')
      const schema=await page.locator('script[type="application/ld+json"]').textContent()
      assert.equal(JSON.parse(schema)[0]['@type'],'BlogPosting','Article structured data')
      assert.equal(await page.locator('.sz-reading-cta a').getAttribute('href'),'/#iletisim','Original booking path')
      await page.screenshot({path:resolve(output,`${label}-${width}-${article.slug}.png`),fullPage:width===390})
    }
    await page.goto(base+'/bakim-rehberi/',{waitUntil:'load'})
    assert.equal(await page.locator('.sz-article-card').count(),3,'Article index')
    for(const path of['/robots.txt','/sitemap.xml']){
      const response=await context.request.get(base+path)
      assert.equal(response.status(),200,path)
    }
    assert.deepEqual(errors,[],'Browser errors')
    assert.deepEqual(failed,[],'Network errors')
    reports.push({width,height,engine,gallery:6,articles:3,filters:true,lightbox:true,hashes:true,articleRoutes:true,overflow:false,result:'PASS'})
    console.log(`PASS ${engine} ${width}x${height}: 6 images, filters + lightbox, 3 complete articles, direct URLs, no overflow/errors`)
    await context.close()
  }
}finally{
  await writeFile(resolve(output,`${label}-report.json`),JSON.stringify(reports,null,2))
  await browser.close();server.close()
}
