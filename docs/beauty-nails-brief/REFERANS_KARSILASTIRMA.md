# Referans düzeltme — pembe/beyaz denge + 3D kaydırma

**Tarih:** 2026-11-01  
**Ortam:** Chromium Playwright emülasyonu, `http://127.0.0.1:4174/`  
**Fiziksel cihaz:** test edilmedi  
**Canlı yayın:** yok

## Kanıt

| | Dosya |
| - | - |
| Desktop ilk kare | `evidence/pink-desktop-p0.png` |
| Derinlik | `evidence/pink-desktop-approach.png` |
| Hizmet / deneyim / randevu | `pink-desktop-services.png`, `pink-desktop-experience.png`, `pink-desktop-booking.png` |
| Mobil | `pink-mobile-p0.png`, `pink-mobile-mid.png` |
| İleri/geri scroll | `pink-desktop-scroll.webm`, `pink-mobile-scroll.webm` |
| Acceptance | `evidence/acceptance-results.json` |

Videolar Playwright `recordVideo` ile alındı.

## Kabul

| ID | Sonuç |
| - | - |
| AC01 | İlk 1440 kare: beyaz header, yumuşak pembe hero, iki satır H1, `özel` / `bir imza` italik, dört kart. Piksel birebir değil. |
| AC02 | Portre arka planı kenardan flood-fill. İç koyu pikseller (göz/saç) silinmedi. Kenar saçak riski duruyor. |
| AC03 | Atlas pano etiketleri arka plandan kaldırıldı. Kart yazısı fotoğrafın altında, ayrı DOM. |
| AC04 | Videoda giriş → başlık geri çekilme / portre yakınlaşma → hizmet sahnesi. |
| AC05 | Acceptance: menü, hizmet kartı, dürüst taslak PASS. |
| AC06 | `npm run build`, `npm run acceptance`, `npm run lint` bu ortamda koştu. Reduced-motion ve WebGL fallback PASS. Lint: `acceptance.mjs` kullanılmayan etiket uyarısı. |

## Kalan farklar

- Cam hâlâ procedural mesh; referans CGI kenar parıltısı ve incelik birebir değil.
- Portre cutout saçağında hafif halo kalabilir.
- Hizmet kaideleri CSS + tek WebGL sahnesi; storyboard 03 kadar kalın cam disk değil.
- Hero yüksekliği ve H1 optik boyutu referans mockup’tan milimetrik sapabilir.
- Fiziksel telefon/masaüstü doğrulanmadı.
