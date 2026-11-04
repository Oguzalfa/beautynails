# Erkek bakım yerleşimi ve metin düzeltmesi

Tarih: 4 Kasım 2026. Başlangıç: `3d762b1ba9b71aa6acdf3c3c3e6a6807472599c6`.

Erkek bakım bandı 768 px altında fotoğraf üstte, başlık ve düğme altta olacak şekilde düzenlendi. Tablet ve masaüstünde görsel ile metin eşit yükseklikte iki sütundur. Görselin kendi kapsayıcısı, tutarlı kadrajı ve taşma sınırı vardır. Başlık iki satıra ayrılır; randevu düğmesi görünür metin ve ok içerir, en az 48 px yüksekliğindedir.

Erkek bölümünün düğmesi mevcut randevu panelini `Erkek Manikür & Pedikür` seçili açar. Genel randevu girişleri önceki seçimi taşımadan açılır. Panel kapatılınca odak açan kontrole geri döner.

Son kullanıcı düzeltmesi: erkek bakım fotoğrafında yalnız bir el bulunur. Kullanıcının son referansındaki yakın tek el kadrajı esas alındı. Yeni `men-care-reference.webp`, `men-care-reference-960.webp`, `men-care-reference-480.webp` varlıkları kullanılır. Eski iki elli dosyalar aktif erkek bölümünde çağrılmaz.

WhatsApp'ın eksik çizilmiş simgesi ayrı `public/icons/whatsapp-mark.svg` dosyasındaki Simple Icons marka geometrisiyle değiştirildi. ViewBox `0 0 24 24`, mobil ölçü 28×28 px, masaüstü 40×40 px; ikon esnemez ve şekli bozulmaz. İşletmenin güncel WhatsApp hedefi kullanıcı tarafından verilen `https://wa.me/905322422303` adresidir. Görünen telefon `0532 242 23 03`, arama bağlantısı `tel:+905322422303` olarak tek yapılandırma kaynağından alınır. Kaynak/lisans: `docs/licenses/simple-icons-CC0.md`.

`THE BEAUTY EDIT / 01` dekoratif üst etiketi, `Detaylarda fark yaratın` sloganı ve galeri açıklamalarındaki `Stüdyo örneğidir` metinleri kaldırıldı. Galeri başlığı `Tırnak tasarımları`, menü bağlantıları `Galeri` oldu. Mevcut `#ornekler` bağlantı hedefi korundu. Mevcut marka, gerçek iletişim hedefleri, fuşya tasarım, hizmet kartları ve animasyon yasağı korundu. Fotoğraflar yeni bir gerçek müşteri portföyü iddiasıyla etiketlenmedi.

## Doğrulama

- `npm run build`: TypeScript ve üretim derlemesi geçti.
- `git diff --check`: geçti.
- Üretim çıktısı desteklenen yerel HTTP önizlemesinde Cloud Chrome ile denetlendi. Aşağıdaki boyutlar iframe viewportlarıdır; fiziksel cihaz testi değildir.

| Ekran | Erkek bölümünün düzeni | Yatay taşma | Başlık/düğme çakışması | Animasyon |
|---|---|---|---|---|
| 320×740 | Alt alta | Yok | Yok | Yok |
| 360×800 | Alt alta | Yok | Yok | Yok |
| 390×844 | Alt alta | Yok | Yok | Yok |
| 430×932 | Alt alta | Yok | Yok | Yok |
| 768×1024 | Eşit yükseklikte iki sütun | Yok | Yok | Yok |
| 1024×768 | Eşit yükseklikte iki sütun | Yok | Yok | Yok |
| 1440×900 | Eşit yükseklikte iki sütun | Yok | Yok | Yok |

Görsel her boyutta kendi kapsayıcısını doldurdu. Düğme yüksekliği tüm boyutlarda 48 px idi. Computed animation-name none, transition-duration 0s kaldı. Kaldırılan metinler görünür DOM'da bulunmadı.

390×844 üretim önizlemesinde şu beş etkileşim geçti:

1. Erkek düğmesi yalnız erkek bakım hizmetini seçili açtı.
2. Escape paneli kapattı, kaydırmayı ve açan düğmeye odağı geri verdi.
3. Genel randevu düğmesi erkek seçimini taşımadan açıldı.
4. Galeri doğru French fotoğrafı ve açıklamayla açıldı.
5. Galeri Escape ile kapandı ve odağı açan görsele geri verdi.

Form gönderilmedi, WhatsApp mesajı gönderilmedi. Fiziksel iOS/Android, Lighthouse, tam ekran okuyucu/kontrast ve 200% yazı denetimi bu değişiklikte çalıştırılmadı. Eski `npm run acceptance` betiği artık kullanılmayan 3D hero/özel randevu seçicilerini hedeflediğinden bu düzeltmenin kabul kanıtı olarak kullanılmadı. Güncel üretim DOM'u yukarıdaki kontrollerle denetlendi.

Bu rapor kaynak ve yerel üretim önizlemesi içindir; canlı yayın kanıtı değildir.

## Tek el ve WhatsApp son kontrolü

Görsel/ikon düzeltmesinden sonra üretim derlemesi yeniden geçti. Aynı yedi viewportta yeni tek el dosyasının kullanıldığı, erkek bölümünün yerleşiminin korunduğu, yatay taşma olmadığı ve animasyonların kapalı kaldığı kontrol edildi. WhatsApp SVG'si 320–768 px aralığında 28×28 px, 1024 ve 1440 px'te 40×40 px ölçüldü; viewBox tüm boyutlarda `0 0 24 24` idi. Mobil 390 px ve masaüstü 1024 px görüntülerinde tek el fotoğrafı ve düzeltilmiş ikon görsel olarak incelendi; görselin yüklendiği doğrulandı.

## Güncel numara ve üst etiket

Kullanıcının güncel numarası bütün etkin randevu/WhatsApp akışlarında kullanılır; eski numara etkin kaynaklardan kaldırıldı. Üstteki THE BEAUTY EDIT, ince çizgi ve 01 DOM katmanı kaldırılmıştır. Etkin mobil ve masaüstü hero fotoğrafları ayrıca incelendi; bu etiket fotoğraflara gömülü değildir.

## Son iletişim kontrolü

0532 242 23 03 numarası alt bilgide görünür, arama ve WhatsApp hedefleri tek yapılandırmadan gelir. Randevu penceresinde de bu numara doğrulandı. Son üretim çıktısı yedi viewportta tekrar denetlendi: yeni referans el varlığı, yüklenmiş kare WhatsApp SVG görseli, doğru telefon/WhatsApp hedefi, taşmayan telefon satırı ve kaldırılmış üst etiket kontrolü geçti. Eski numara etkin kaynaklarda bulunmadı.
