import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateKey } from './build-indexnow.mjs'
import { origin, endpoint, sitemapUrls, submitIndexNow } from './submit-indexnow.mjs'

const key = 'test-only-indexnow-key-12345678'
const urls = [origin+'/', origin+'/iletisim/']
const xml = `<urlset>${urls.map(url=>`<url><loc>${url}</loc></url>`).join('')}</urlset>`
const response = (status, text = '', headers = {}) => ({ status:()=>status, text:async()=>text, headers:()=>headers })

function clientFor({ proofStatus=200, proof=key, contentType='text/plain; charset=utf-8', liveXml=xml, pageStatus=200, noindex=false, metaNoindex=false, postStatus=200 } = {}) {
  const calls = []
  return { calls,
    get:async url => {
      calls.push({method:'GET',url})
      if (url.endsWith('.txt')) return response(proofStatus,proof,{'content-type':contentType})
      if (url.endsWith('sitemap.xml')) return response(200,liveXml)
      return response(pageStatus,`<link href="${url}" rel="canonical">${metaNoindex?'<meta content="noindex,follow" name="robots">':''}`,noindex?{'x-robots-tag':'noindex'}:{})
    },
    post:async(url, options)=> {calls.push({method:'POST',url,options});return response(postStatus,'',postStatus===429?{'retry-after':'600'}:{})},
  }
}

test('key validation blocks empty, short and file-path values', () => {
  for (const value of ['', 'short', '../secret-value', 'space invalid key', 'x'.repeat(129)]) assert.throws(()=>validateKey(value))
})

test('sitemap rejects duplicate, preview, foreign, query, fragment and credential URLs', () => {
  for (const list of [[urls[0],urls[0]], ['https://preview.vercel.app/'],['https://example.org/'],[origin+'/?x=1'],[origin+'/#x'],['https://user:password@www.sazibeauty.com/']]) {
    assert.throws(()=>sitemapUrls(`<urlset>${list.map(url=>`<url><loc>${url}</loc></url>`).join('')}</urlset>`))
  }
  assert.deepEqual(sitemapUrls(xml),urls)
})

test('dry run makes no requests', async () => {
  const client=clientFor()
  const result=await submitIndexNow({xml,key,client})
  assert.equal(result.status,'dry-run')
  assert.equal(result.submittedAt,null)
  assert.deepEqual(client.calls,[])
})

test('selected URL dry run reports only the requested sitemap URLs', async () => {
  const client=clientFor()
  const selection=[urls[1]]
  const result=await submitIndexNow({xml,key,client,urls:selection})
  assert.equal(result.status,'dry-run')
  assert.equal(result.urlCount,1)
  assert.deepEqual(result.urls,selection)
  assert.deepEqual(client.calls,[])
})

test('empty, duplicate and unknown URL selections fail before network requests', async () => {
  for (const [selection,error] of [
    [[],/at least one URL/],
    [[urls[0],urls[0]],/only once/],
    [[urls[1],origin+'/outside-sitemap/'],/in the local sitemap/],
  ]) {
    const client=clientFor()
    await assert.rejects(submitIndexNow({xml,key,client,urls:selection,submit:true}),error)
    assert.deepEqual(client.calls,[])
  }
})

test('missing, redirected, HTML and mismatched proof cannot send a notification', async () => {
  for (const options of [{proofStatus:404},{proofStatus:308},{contentType:'text/html'},{proof:'not-the-key'}]) {
    const client=clientFor(options)
    await assert.rejects(submitIndexNow({xml,key,client,submit:true}))
    assert.ok(client.calls.every(call=>call.method==='GET'))
  }
})

test('stale sitemap, unavailable page and noindex page stop before POST', async () => {
  for (const options of [{liveXml:xml.replace('/iletisim/','/other/')},{pageStatus:404},{noindex:true},{metaNoindex:true}]) {
    const client=clientFor(options)
    await assert.rejects(submitIndexNow({xml,key,client,submit:true}))
    assert.ok(client.calls.every(call=>call.method==='GET'))
  }
})

test('one successful batch has canonical host/URLs and does not claim indexing', async () => {
  const client=clientFor()
  const result=await submitIndexNow({xml,key,client,submit:true})
  const posts=client.calls.filter(call=>call.method==='POST')
  assert.equal(posts.length,1)
  assert.equal(posts[0].url,endpoint)
  assert.deepEqual(posts[0].options.data,{host:'www.sazibeauty.com',key,keyLocation:`${origin}/${key}.txt`,urlList:urls})
  assert.equal(result.status,'received')
  assert.equal(result.indexed,null)
  assert.equal(result.indexingStatus,'not-checked')
})

test('selected submission validates the full live sitemap and checks only selected pages', async () => {
  const client=clientFor()
  const selection=[urls[1]]
  const result=await submitIndexNow({xml,key,client,urls:selection,submit:true})
  assert.equal(result.status,'received')
  assert.equal(result.urlCount,1)
  assert.deepEqual(result.urls,selection)
  assert.deepEqual(client.calls.filter(call=>call.method==='GET').map(call=>call.url),[
    `${origin}/${key}.txt`,origin+'/sitemap.xml',...selection,
  ])
  const posts=client.calls.filter(call=>call.method==='POST')
  assert.equal(posts.length,1)
  assert.deepEqual(posts[0].options.data.urlList,selection)

  const staleClient=clientFor({liveXml:xml.replace(`<url><loc>${urls[0]}</loc></url>`,'')})
  await assert.rejects(submitIndexNow({xml,key,client:staleClient,urls:selection,submit:true}),/Live sitemap does not match/)
  assert.deepEqual(staleClient.calls.map(call=>[call.method,call.url]),[
    ['GET',`${origin}/${key}.txt`],['GET',origin+'/sitemap.xml'],
  ])
})

test('Yandex mode targets its official endpoint after the same preflight checks', async () => {
  const client = clientFor()
  const selection = [urls[1]]
  const options = { xml, key, client, urls:selection, yandex:true }
  const yandexEndpoint = 'https://yandex.com/indexnow'

  const dryRun = await submitIndexNow(options)
  assert.equal(dryRun.endpoint, yandexEndpoint)
  assert.equal(dryRun.status, 'dry-run')
  assert.deepEqual(client.calls, [])

  const result = await submitIndexNow({ ...options, submit:true })
  assert.equal(result.endpoint, yandexEndpoint)
  assert.equal(result.status, 'received')
  assert.deepEqual(client.calls.map(({ method, url }) => [method, url]), [
    ['GET', `${origin}/${key}.txt`],
    ['GET', origin+'/sitemap.xml'],
    ['GET', selection[0]],
    ['POST', yandexEndpoint],
  ])
  assert.deepEqual(client.calls.at(-1).options, {
    data: { host:'www.sazibeauty.com', key, keyLocation:`${origin}/${key}.txt`, urlList:selection },
    headers: { 'Content-Type':'application/json; charset=utf-8' },
    maxRedirects: 0,
  })
})

test('202 stays pending; rejected/rate-limited responses do not retry', async () => {
  for (const postStatus of [202,403,422,429]) {
    const client=clientFor({postStatus})
    const result=await submitIndexNow({xml,key,client,submit:true})
    assert.equal(result.status,postStatus===202?'received-key-validation-pending':'rejected')
    assert.equal(result.indexed,null)
    assert.equal(client.calls.filter(call=>call.method==='POST').length,1)
    if(postStatus===429) assert.equal(result.retryAfter,'600')
  }
})

test('a lost response records unknown delivery without retry or indexing claims', async () => {
  const client=clientFor()
  let attempts=0
  client.post=async()=>{attempts++;throw new Error('Network timeout')}
  const result=await submitIndexNow({xml,key,client,submit:true})
  assert.equal(attempts,1)
  assert.equal(result.status,'delivery-unknown')
  assert.equal(result.httpStatus,null)
  assert.equal(result.indexed,null)
  assert.ok(result.submittedAt)
})
