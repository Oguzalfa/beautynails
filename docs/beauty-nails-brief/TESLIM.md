# Beauty Nails — teslim raporu (kabul / düzeltme)

**Durum: Kısmen tamamlandı**  
Masaüstü/mobil emülasyonda scroll videosu, reduced-motion, WebGL fallback, breakpoint ve Lighthouse ölçüldü. Fiziksel cihaz testi yapılmadı. Referans 02/03 dosyaları depoda yok.

## 1. Sonuç ve kullanıcı davranışı

Mevcut uygulama korundu (yeni proje kurulmadı). Düzeltmeler:

- Cam kemer geometrisi referansa daha yakın portal/extrude mesh
- Hero taşma / pin-spacer clip, portre kadrajı, hizmet kartı oranı
- `prefers-reduced-motion` çalışma zamanı geçişinde pin cleanup
- WebGL context kaybında tek seferlik fallback (yeniden oluşturma döngüsü yok)
- WebGL yükü ilk boya sonrası / scroll’a ertelendi (LCP/TBT iyileşti)
- Playwright ile gerçek tarayıcı scroll videoları

Randevu: yerel dürüst taslak; iletişim alanları `null` (uydurulmadı). Canlı yayın / gerçek mesaj yok.

## 2. Repo / koruma

| Madde | Değer |
| - | - |
| Yol | `c:\Users\Oğuzhan\Desktop\beautynails` |
| AGENTS.md | Yok |
| Git | Yok (commit yok) |
| Önizleme | `npm run build` → `npm run preview` → `http://127.0.0.1:4174/` (`--strictPort`) |
| K01 | Kullanıcı verisi/secret yoktu; mevcut kaynaklar üzerine düzeltme |

## 3. Referans uyumu

| Referans | Depoda | Sonuç |
| - | - | - |
| `referanslar/01_Onayli_Canli_Pembe_Desktop_Mobil.jpg` | Var — açıldı ve `accept-desktop-p0.png` / `accept-mobile-p0.png` ile karşılaştırıldı | Pembe `#EF2C83`, H1 + italik `özel`, portre+panel+kemer, 4 kart: uyumlu |
| `02_Desktop_3D_Sahne_ve_Gecisler.png` | **Yok** | Görmüş gibi raporlanmadı |
| `03_Mobil_3D_Kaydirma_Asamalari.png` | **Yok** | Görmüş gibi raporlanmadı |

Belirgin farklar (01’e göre) giderildi/azaltıldı: cam portal kemer, hero gradyanı, kart medya oranı, overflow clip. Logo sans (brief Manrope); referanstaki serif logo stili bilinçli olarak brief’e uydu.

## 4. AC01–AC22

| AC | Sonuç | Ortam | Kanıt |
| - | - | - | - |
| AC01 | **Geçti** | Chromium 1440×900, preview 4174 | `evidence/accept-identity-1440.png`, `acceptance-results.json` → pink `#ef2c83` |
| AC02 | **Geçti** | 1440×900 | 4 kart; `accept-desktop-services.png` |
| AC03 | **Geçti** | 390×844 emülasyon | metin üstte / portre altta / alt bar; `accept-mobile-p0.png` |
| AC04 | **Geçti** | 320/360/390/768/1024(+yön)/1440 | `breakpoint-*.png`; overflow/yüz/bar örtüşmesi yok |
| AC05 | **Geçti** | dosya + DOM | `public/images/hero-portrait-cutout.webp` + atlas crops |
| AC06 | **Geçti** | Playwright + sahne | mesh açı değişimi scroll videolarında; context loss sonrası fallback |
| AC07 | **Geçti** | Playwright recordVideo 1440×900 | `evidence/desktop-scroll.webm` (~25.6 MB) — ekran görüntüsünden üretilmedi |
| AC08 | **Geçti** | Playwright iPhone-like 390×844 | `evidence/mobile-scroll.webm` (~2.98 MB) |
| AC09 | **Geçti** | video sırasında | mid-scroll Özel Randevu / mobil Randevu Al + Escape |
| AC10 | **Geçti** | preview | `#hizmetler` anchorY=1985; `goBack` sonrası scrollY=773; pin çıkışı videoda |
| AC11 | **Geçti** | kod + UI | hizmet detay dialog (`ServiceDetail`) — ayrı video karesi yok; DOM erişimi acceptance akışında |
| AC12 | **Geçti** | 390 viewport | `booking-draft.png` — “gönderilmedi / taslak” |
| AC13 | **Geçti** | form | boş submit → 3 alan hatası |
| AC14 | **Geçti** | config | WhatsApp/telefon `null`; uydurma yok |
| AC15 | **Geçti** | `reducedMotion: reduce` + runtime flip | `reduced-motion-on.png`, `reduced-motion-runtime.png`; pin yok, CTA açık |
| AC16 | **Geçti** | WebGL getContext=null + loseContext | `webgl-fallback.png`, `webgl-context-lost.png`; siyah hero yok |
| AC17 | **Kısmen** | kod | visibility/dispose mevcut; RAF profiler kaydı **çalıştırılmadı** |
| AC18 | **Geçti** | reload + hash gezinme | spacer/canvas ≤1 (`acceptance-results.json`) |
| AC19 | **Kısmen** | Lighthouse + chunk split | H1/CTA Three beklemiyor; yavaş-ağ emülasyonu **çalıştırılmadı** |
| AC20 | **Geçti** | mobil menü | Escape + odak dönüşü `menu-toggle` |
| AC21 | **Geçti (ölçüldü)** | Lighthouse desktop form-factor, 1440×900, preview | aşağı §6 |
| AC22 | **Yok / N/A** | — | Önceki otomatik test suite yoktu; yeni acceptance script eklendi |

Ham sonuç: `docs/beauty-nails-brief/evidence/acceptance-results.json`

## 5. K01–K08

| K | Sonuç | Not |
| - | - | - |
| K01 | **Geçti** | Reset/stash yok; mevcut uygulama üzerine düzeltme |
| K02 | **Yok** | Önceki SEO/rota seti yoktu |
| K03 | **Geçti (yerel)** | Booking provider yok; taslak korundu |
| K04 | **Geçti** | Secret/schema yok |
| K05 | **Yok** | Analytics/consent yoktu |
| K06 | **Geçti** | Pin çıkışı + anchor + back (AC10) |
| K07 | **Geçti** | Menü/panel Escape + odak (AC20) |
| K08 | **Kısmen** | Yalnız referans 01 ile karşılaştırıldı; 02/03 dosya yok |

## 6. Performans (AC21)

Üretim: `npm run build` (geçti). Önizleme: `http://127.0.0.1:4174/`.

| Koşu | Dosya | Perf | A11y | LCP | CLS | TBT | FCP |
| - | - | - | - | - | - | - | - |
| Önce | `lighthouse-summary.json` | 0.32 | 0.96 | 6.9 s | 0.001 | 1830 ms | 2.0 s |
| Ara | `lighthouse-after-summary.json` | 0.42 | 0.96 | 5.9 s | 0.002 | 1100 ms | 0.8 s |
| **Son** | `lighthouse-final-summary.json` | **0.82** | **0.96** | **2.8 s** | **0.002** | **20 ms** | **0.8 s** |

- Ortam: HeadlessChrome/156, `form-factor=desktop`, benchmarkIndex ≈ 3565  
- HTML rapor: `evidence/lighthouse-final.report.html`  
- Hedef LCP ≤2.5 s: **kaçırıldı (2.8 s)** — abartısız kaydedildi  
- FPS: **ölçülmedi** (tahmini yazılmadı)  
- Düzeltmeler: font async, LCP image preload/`fetchPriority`, Three.js scroll/idle erteleme

## 7. Hareket kanıtı

| Dosya | İçerik |
| - | - |
| `evidence/desktop-scroll.webm` | Yukarıdan hizmetlere + geri; mid Özel Randevu; gerçek Playwright kaydı |
| `evidence/mobile-scroll.webm` | Touch scroll derinlik + menü/randevu mid-sahne |

Fiziksel iPhone/Android: **yapılmadı** → emülasyon sonuçlarıyla eşitlenmez; ayrıca belirtildi.

## 8. Komutlar

```text
npm run build          # geçti
npm run preview        # 127.0.0.1:4174 strictPort
npm run acceptance     # Playwright video + AC kontrolleri
npm run lighthouse     # desktop LH → evidence/lighthouse*
npm run lint           # oxlint uyarıları olabilir; hata hedefi değil
```

## 9. Dış sistem / eksikler / geri alma

- İletişim/WhatsApp/booking URL: `src/config/site.ts` → `null`
- Referans 02/03: depoda yok
- Fiziksel cihaz + FPS: yok
- Geri alma: ilgili `src/**`, `index.html`, `scripts/acceptance.mjs`, evidence dosyaları; git olmadığı için manuel

## 10. Durum özeti

**Kısmen tamamlandı** — emülasyon kabul kanıtı ve performans ölçümü tamam; fiziksel cihaz ve eksik referans PNG’leri açık bırakıldı. Yeni moda/modül eklenmedi.
