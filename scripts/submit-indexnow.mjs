import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'
import { request } from 'playwright'
import { validateKey } from './build-indexnow.mjs'

export const origin = 'https://www.sazibeauty.com'
export const endpoint = 'https://api.indexnow.org/indexnow'

export function sitemapUrls(xml) {
  if (/<!DOCTYPE|<!ENTITY|<sitemapindex\b/i.test(xml)) throw new Error('Use a plain URL sitemap without external entities.')
  const urls = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(match => match[1].trim().replaceAll('&amp;', '&'))
  if (!urls.length || urls.length > 10000 || new Set(urls).size !== urls.length) throw new Error('Sitemap must contain 1–10000 unique URLs.')
  for (const value of urls) {
    const url = new URL(value)
    if (url.origin !== origin || url.username || url.password || url.search || url.hash || url.href !== value) {
      throw new Error('Only canonical HTTPS www.sazibeauty.com URLs without queries or fragments can be submitted.')
    }
  }
  return urls
}

export function payloadFor(xml, value) {
  const key = validateKey(value)
  return { host:new URL(origin).host, key, keyLocation:`${origin}/${key}.txt`, urlList:sitemapUrls(xml) }
}

export async function submitIndexNow({ xml, key, client, submit = false, urls }) {
  const payload = payloadFor(xml, key)
  const localSitemapUrls = payload.urlList
  if (urls !== undefined) {
    if (!Array.isArray(urls) || !urls.length || new Set(urls).size !== urls.length) {
      throw new Error('Select at least one URL and specify each URL only once.')
    }
    const canonicalUrls = new Set(localSitemapUrls)
    if (Array.from(urls).some(url => !canonicalUrls.has(url))) {
      throw new Error('Every selected URL must be an exact canonical address in the local sitemap.')
    }
    payload.urlList = [...urls]
  }
  const receipt = { host:payload.host, endpoint, urlCount:payload.urlList.length, urls:payload.urlList, submittedAt:null, httpStatus:null, status:'dry-run', indexed:null, indexingStatus:'not-checked' }
  if (!submit) return receipt

  const proof = await client.get(payload.keyLocation, { maxRedirects:0 })
  if (proof.status() !== 200 || !/^text\/plain\b/i.test(proof.headers()['content-type'] || '') || (await proof.text()).trim() !== payload.key) {
    throw new Error('Live IndexNow ownership file is missing, redirected or mismatched. No submission made.')
  }
  const sitemap = await client.get(origin + '/sitemap.xml', { maxRedirects:0 })
  if (sitemap.status() !== 200 || JSON.stringify(sitemapUrls(await sitemap.text())) !== JSON.stringify(localSitemapUrls)) {
    throw new Error('Live sitemap does not match this build. No submission made.')
  }
  for (const url of payload.urlList) {
    const page = await client.get(url, { maxRedirects:0 })
    const html = await page.text()
    const tags = [...html.matchAll(/<(link|meta)\b[^>]*>/gi)].map(match => ({
      tag:match[1].toLowerCase(),
      ...Object.fromEntries([...match[0].matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(attribute => [attribute[1].toLowerCase(), attribute[2] ?? attribute[3]])),
    }))
    const canonical = tags.find(tag => tag.tag === 'link' && tag.rel?.toLowerCase() === 'canonical')?.href
    const noindex = tags.some(tag => tag.tag === 'meta' && tag.name?.toLowerCase() === 'robots' && /\bnoindex\b/i.test(tag.content || ''))
    if (page.status() !== 200 || canonical !== url || /noindex/i.test(page.headers()['x-robots-tag'] || '') || noindex) {
      throw new Error(`A sitemap page is not indexable or canonical: ${url}. No submission made.`)
    }
  }

  // One batch, one endpoint, no retries: participating engines share the notification.
  receipt.submittedAt = new Date().toISOString()
  let response
  try {
    response = await client.post(endpoint, { data:payload, headers:{ 'Content-Type':'application/json; charset=utf-8' }, maxRedirects:0 })
  } catch {
    receipt.status = 'delivery-unknown'
    return receipt
  }
  receipt.httpStatus = response.status()
  receipt.status = response.status() === 200 ? 'received' : response.status() === 202 ? 'received-key-validation-pending' : 'rejected'
  if (response.headers()['retry-after']) receipt.retryAfter = response.headers()['retry-after']
  return receipt
}

async function localKey() {
  if (process.env.INDEXNOW_KEY) return validateKey(process.env.INDEXNOW_KEY)
  const file = await readFile('.env.indexnow.local', 'utf8').catch(() => '')
  return validateKey(file.match(/^INDEXNOW_KEY=([A-Za-z0-9-]+)\s*$/m)?.[1])
}

async function main() {
  const { values: { submit, url: urls } } = parseArgs({
    options: {
      submit: { type:'boolean' },
      url: { type:'string', multiple:true },
    },
  })
  const key = await localKey()
  const xml = await readFile('dist/sitemap.xml', 'utf8')
  let client
  try {
    if (submit) {
      const server = process.env.HTTPS_PROXY || process.env.HTTP_PROXY
      client = await request.newContext({ timeout:30000, ...(server ? { proxy:{server} } : {}) })
    }
    const receipt = await submitIndexNow({ xml, key, client, submit, urls })
    if (submit) {
      const directory = resolve('../.sazi-indexnow-qa')
      await mkdir(directory, {recursive:true})
      await writeFile(resolve(directory, 'receipt.json'), JSON.stringify(receipt, null, 2))
    }
    console.log(JSON.stringify(receipt, null, 2))
    if (receipt.status === 'rejected' || receipt.status === 'delivery-unknown') process.exitCode = 1
  } catch (error) {
    // Key location appears in network error logs; keep it out of console output.
    throw new Error(String(error.message).replaceAll(key, '[redacted]'))
  } finally {
    await client?.dispose()
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1 })
}
