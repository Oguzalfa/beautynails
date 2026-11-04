export type GalleryCategory = 'Tırnak' | 'Kirpik' | 'Makyaj'
export type GalleryPhoto = {
  key: string
  title: string
  category: GalleryCategory
  alt: string
  position: string
}

export const galleryPhotos: GalleryPhoto[] = [
  {key:'fuchsia-french',title:'French, fuşya bir dokunuşla.',category:'Tırnak',alt:'Fuşya saten üzerinde pembe French uçlu badem tırnaklar',position:'50% 60%'},
  {key:'crystal-eye',title:'Bakışlarda ince bir imza.',category:'Kirpik',alt:'Pembe kristallerin yanında kahverengi göz ve kirpik yakın planı',position:'38% 45%'},
  {key:'rose-lips',title:'Gül pembesinin yumuşak tonu.',category:'Makyaj',alt:'Doğal gül pembesi dudak görünümü',position:'50% 56%'},
  {key:'satin-nails',title:'Saten kadar parlak.',category:'Tırnak',alt:'Parlak fuşya saten üzerinde düz fuşya renkli badem tırnaklar',position:'50% 52%'},
  {key:'rose-gloss',title:'Işığı yakalayan detaylar.',category:'Makyaj',alt:'Pembe kristallerle parlak gül pembesi dudak yakın planı',position:'57% 52%'},
  {key:'crystal-french',title:'Klasik çizgi, zarif ışıltı.',category:'Tırnak',alt:'Pembe kristaller üzerinde beyaz French uçlu tırnaklar',position:'50% 52%'},
]

export function editorialImage(key: string, width: 480 | 768 | 1200 = 1200) {
  return `/images/editorial/${key}-${width}.webp`
}

export function editorialSrcSet(key: string) {
  const fullWidth = key === 'rose-lips' || key === 'satin-nails' ? 1122 : 1200
  return `${editorialImage(key,480)} 480w, ${editorialImage(key,768)} 768w, ${editorialImage(key)} ${fullWidth}w`
}
