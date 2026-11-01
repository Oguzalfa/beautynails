import { readFileSync, writeFileSync } from 'fs'

const [,, inPath, outPath] = process.argv
const raw = JSON.parse(readFileSync(inPath, 'utf8'))
const b64 = raw.result?.data || raw.data
if (!b64) {
  console.error('No screenshot data', Object.keys(raw), Object.keys(raw.result || {}))
  process.exit(1)
}
writeFileSync(outPath, Buffer.from(b64, 'base64'))
console.log('wrote', outPath, Buffer.from(b64, 'base64').length)
