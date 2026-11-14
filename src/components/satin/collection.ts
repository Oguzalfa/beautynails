const collectionImage = (name: string, height: number) => ({
  src: `/images/satin/collection/${name}-960.webp`,
  srcSet: `/images/satin/collection/${name}-480.webp 480w, /images/satin/collection/${name}-960.webp 960w`,
  sizes: '(min-width: 1024px) 300px, 46vw',
  width: 960,
  height,
})

export const libraryGallery = [
  { id: 'heart-french', ...collectionImage('heart-french', 1707) },
  { id: 'pearl-almond', ...collectionImage('pearl-almond', 1280) },
  { id: 'blush-glitter', ...collectionImage('blush-glitter', 1280) },
  { id: 'noir-waves', ...collectionImage('noir-waves', 720) },
] as const

const nailPhotoNumbers = [
  16, 20, 4, 1, 23, 17,
  8, 5, 2, 3, 6, 7, 9, 10, 11, 12, 13, 14, 15, 18, 19, 21, 22, 24,
] as const

export type NailPhotoNumber = (typeof nailPhotoNumbers)[number]

export const nailPhotoGallery = nailPhotoNumbers.map((id, index) => ({
  ...collectionImage(`nail-${String(id).padStart(2, '0')}`, 1280),
  id,
  sizes: index < 2
    ? '(min-width: 1480px) 630px, (min-width: 1024px) 45vw, 46vw'
    : '(min-width: 1480px) 305px, (min-width: 1024px) 22vw, 46vw',
}))

export const journalImages = {
  'tirnak-sekli': {
    ...collectionImage('pearl-almond', 1280),
    sizes: '(min-width: 1024px) 650px, 92vw',
    alt: 'Sedef tonlarında badem tırnak formu',
  },
  'kirpik-ifadesi': {
    ...collectionImage('lash-detail', 640),
    sizes: '(min-width: 1024px) 300px, (min-width: 600px) 40vw, 110px',
    alt: 'Kapalı gözde zarif kirpik kıvrımının yakın planı',
  },
  'erkek-bakimi': {
    src: '/images/satin/men-care-reference-960.webp',
    srcSet: '/images/satin/men-care-reference-480.webp 480w, /images/satin/men-care-reference-960.webp 960w',
    sizes: '(min-width: 1024px) 300px, (min-width: 600px) 40vw, 110px',
    width: 1774,
    height: 887,
    alt: 'Koyu kumaş üzerinde doğal ve bakımlı erkek eli',
  },
}
