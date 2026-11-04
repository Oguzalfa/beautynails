import sharp from 'sharp'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'

const source = resolve(process.env.EDITORIAL_SOURCE || '../sazi-gallery-inputs')
const output = resolve('public/images/editorial')
await mkdir(output, { recursive:true })
const files = [
  ['fuchsia-french','Fuşya French uçlu zarif el.png','libfile_98b863182240819187793811d667d6f8'],
  ['crystal-french','Kristaller Üzerinde Zarif Fransız Manikürü.png','libfile_64942ca10d4c81919a521e94acc196c2'],
  ['crystal-eye','Kahverengi gözler ve pembe kristal.png','libfile_73aaa99266c88191bf55bb9246012367'],
  ['rose-lips','Doğal parlak gül pembesi dudaklar.png','libfile_c4aa4657580c81918f40536cd9b73002'],
  ['rose-gloss','Gül pembesi rujla doğal zarafet.png','libfile_911ef143c4988191b8609560377e4d82'],
  ['satin-nails','Fuşya saten üzerinde zarif tırnak sanatı.png','libfile_010d7940bbe08191aeb5005687234d9f'],
]
const provenance = []
for (const [key, filename, libraryId] of files) {
  const data = await readFile(resolve(source, filename))
  const meta = await sharp(data).metadata()
  const variants = []
  for (const width of [480,768,1200]) {
    const file = `${key}-${width}.webp`
    const info = await sharp(data).resize({width,withoutEnlargement:true}).webp({quality:85,effort:5}).toFile(resolve(output,file))
    variants.push({file,width:info.width,height:info.height,bytes:info.size})
  }
  provenance.push({key,filename,library_file_id:libraryId,source_sha256:createHash('sha256').update(data).digest('hex'),width:meta.width,height:meta.height,generated:true,variants})
}
await writeFile('src/content/editorial-images.json',JSON.stringify(provenance,null,2)+'\n')
console.log(JSON.stringify(provenance.map(p=>({key:p.key,variants:p.variants})),null,2))
