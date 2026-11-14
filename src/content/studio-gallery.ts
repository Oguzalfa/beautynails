export type PhotoStyle = 'French' | 'Sade' | 'Desenli'

const photos: readonly [string, string, PhotoStyle][] = [
  ['16', 'Kırmızı puantiyeli French', 'French'],
  ['04', 'İnci krom', 'Sade'],
  ['20', 'Mavi çini', 'Desenli'],
  ['01', 'Leopar French', 'French'],
  ['23', 'Pembe badem', 'Sade'],
  ['17', 'Üç boyutlu çiçekler', 'Desenli'],
  ['08', 'Siyah French', 'French'],
  ['05', 'Sedef beyazı', 'Sade'],
  ['02', 'Kahve ve leopar', 'Desenli'],
  ['03', 'Gece laciverti', 'Sade'],
  ['06', 'Renkli taşlar', 'Desenli'],
  ['09', 'Kırmızı fiyonk', 'Desenli'],
  ['14', 'Sarı ve pembe', 'Desenli'],
  ['12', 'Mermer desen', 'Desenli'],
  ['21', 'Meyve desenleri', 'Desenli'],
  ['19', 'Vizon tonları', 'Sade'],
  ['10', 'Leopar ve fiyonk', 'Desenli'],
  ['15', 'Pastel geçişler', 'Desenli'],
  ['13', 'Siyah puantiye', 'Desenli'],
  ['07', 'Taşlı badem', 'Desenli'],
  ['18', 'Süt beyazı ve desen', 'Desenli'],
  ['22', 'Beyaz ve bordo', 'Desenli'],
  ['11', 'Kırmızı detaylı leopar', 'Desenli'],
  ['24', 'Beyaz puantiye', 'Desenli'],
]

const directory = '/images/studio/'

export const studioPhotos = photos.map(([number, title, style]) => ({
  key: 'nail-' + number,
  title,
  style,
  thumbnail: directory + 'nail-' + number + '-360.webp',
  image: directory + 'nail-' + number + '-900.webp',
  width: 900,
  height: 1200,
}))

export const studioClips = ['Pembe French', 'Kırmızı leopar', 'Kırmızı kedi gözü', 'Koyu kedi gözü'].map((title, index) => {
  const key = 'clip-0' + (index + 1)
  const poster = directory + key + '.webp'
  return { key, title, thumbnail: poster, image: poster, video: directory + key + '.mp4', width: 432, height: 768 }
})
