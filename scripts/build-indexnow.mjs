import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export function validateKey(value) {
  const key = String(value || '').trim()
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error('INDEXNOW_KEY must contain 8–128 letters, digits or hyphens.')
  return key
}

export async function buildIndexNow(value = process.env.INDEXNOW_KEY) {
  if (!value) {
    console.log('IndexNow ownership file skipped: no build key configured.')
    return
  }
  const key = validateKey(value)
  await writeFile(resolve('dist', `${key}.txt`), key + '\n', 'utf8')
  console.log('IndexNow ownership file built. No URLs submitted during build.')
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await buildIndexNow()
