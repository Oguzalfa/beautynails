# Referans / uygulama karşılaştırması

**Tarih:** 2026-11-01 (görsel düzeltme turu)  
**Referans:** hedef JPG (onaylı canlı pembe)  
**Ortam:** Chromium Playwright, preview `http://127.0.0.1:4174/`  
**Fiziksel cihaz:** yok (emülasyon)

## Kanıt dosyaları

| Tür | Dosya |
| - | - |
| Desktop 1440×900 | `evidence/compose-desktop-1440.png` |
| Desktop mid-scroll | `evidence/compose-desktop-mid.png` |
| Desktop hizmetler | `evidence/compose-desktop-services.png` |
| Desktop scroll video | `evidence/compose-desktop-scroll.webm` (+ `desktop-scroll.webm`) |
| Mobil 390×844 | `evidence/compose-mobile-390.png` |
| Mobil mid | `evidence/compose-mobile-mid.png` |
| Mobil scroll video | `evidence/compose-mobile-scroll.webm` |
| Ölçüm | `evidence/compose-metrics.json` |
| Acceptance | `evidence/acceptance-results.json` |

Videolar ekran görüntüsünden üretilmedi; Playwright `recordVideo` ile kaydedildi.

## Ölçülen kompozisyon (1440×900, p≈0)

| Metrik | Sonuç |
| - | - |
| Header | 76px |
| Hero | 410px |
| Kategori şeridi | 48px, ilk ekranda |
| H1 | ~85px Manrope, 2 satır |
| Portre kutusu | ~714×361 (yüz/çene/el/omuz) |
| 4 hizmet kartı ilk ekranda | **evet** (tam görünür, yükseklik 210px) |
| WebGL canvas | var |
| Pin spacer | yok (`pin: false`) |

## Referans ↔ uygulama — kalan farklar

| Bölge | Durum | Kalan fark |
| - | - | - |
| Manrope logo / H1 / bölüm başlıkları | Yaklaştı | Referans mockup’taki harf optiği birebir değil |
| Serif italik yalnız `özel` / `bir imza` | Evet | — |
| Kompakt hero + strip + 4 kart ilk viewport | Evet | Kart cam kaide/hover pedestalları referans 03 kadar 3D değil |
| Portre kadrajı (yakınlaşma yalnız scroll) | Yaklaştı | Cutout alpha kenarı stüdyo CGI kadar temiz değil |
| Cam kemer şeffaflık / yansıma | İyileşti | Procedural mesh; referans CGI transmission/highlight kadar zengin değil |
| Manikür paneli ince pembe kenar | Yaklaştı | Cam kenar kalınlığı / gölge referanstan hafif farklı |
| Yatay 2.5:1 hizmet fotoğrafları | Evet | Kadrajlar cover crop; kaynak kare kırpma referans zoom’undan sapabilir |
| Alt bölüm tipografi / kompakt randevu | Evet | — |

## Korunan davranışlar

Scroll derinlik (pin’siz scrub), menü, randevu taslağı, reduced-motion, WebGL fallback / context-lost: acceptance PASS.

## Durum

**Referansla aynı değil.** Ölçek, tipografi, ilk ekran kartları ve yatay hizmet kadrajı hedefe yaklaştı; cam CGI kalitesi ve cutout kenarı başlıca kalan görsel farklar.
