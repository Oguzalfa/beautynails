const collectionImage = (name: string, alt: string, height: number) => ({
  src: `/images/satin/collection/${name}-960.webp`,
  srcSet: `/images/satin/collection/${name}-480.webp 480w, /images/satin/collection/${name}-960.webp 960w`,
  sizes: '(min-width: 1024px) 300px, 46vw',
  width: 960,
  height,
  alt,
})

export const libraryGallery = [
  { id: 'heart-french', ...collectionImage('heart-french', 'Kırmızı kalp detaylı pembe French tırnaklar', 1707) },
  { id: 'pearl-almond', ...collectionImage('pearl-almond', 'Sedef yansımalı açık pembe badem tırnaklar', 1280) },
  { id: 'blush-glitter', ...collectionImage('blush-glitter', 'Gümüş ışıltı detaylı nude pembe manikür', 1280) },
  { id: 'noir-waves', ...collectionImage('noir-waves', 'Siyah ve nude tonlarda dalga desenli tırnaklar', 720) },
] as const

export const journalImages = {
  'tirnak-sekli': {
    ...collectionImage('pearl-almond', 'Sedef tonlarında badem tırnak formu', 1280),
    sizes: '(min-width: 1024px) 650px, 92vw',
  },
  'kirpik-ifadesi': {
    ...collectionImage('lash-detail', 'Kapalı gözde zarif kirpik kıvrımının yakın planı', 640),
    sizes: '(min-width: 1024px) 300px, (min-width: 600px) 40vw, 110px',
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
