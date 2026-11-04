# Galeri ve Bakım Notları

5 Kasım 2026. Başlangıç: `11dfaddd65448acdcb8ce9d50996906bb23c483b`.

Mevcut iki fuşya galeri görseline dört mevcut fotoğraf eklendi. Mobilde iki sütun; masaüstünde iki geniş kapak ve dört küçük fotoğraf düzeni kullanılır. Görseller aynı galeri büyütme penceresinde açılır. Bunlar yeni bir müşteri portföyü veya sonuç iddiasıyla sunulmaz; açıklamalar yalnızca görünen tasarımı tarif eder.

## Görsel kaynakları

Kullanıcının mevcut görselleri seçip yayımlama talebi kapsamında alındı. Kaynak dosyalar değiştirilmedi; site için yön bilgisi uygulanarak 480 ve 960 px genişliklerde WebP kopyaları hazırlandı. Renkler, oje desenleri veya eller yeniden üretilmedi.

| Dosya | Library kimliği | Sitedeki anahtar |
|---|---|---|
| IMG_9079.jpg | libfile_18181f4773f88191b622690f91a0ef0f | noir-waves |
| IMG_4842.jpg | libfile_33eb2315e82481919a5c9db0e420398b | blush-glitter |
| IMG_8976.jpg | libfile_56faa9bee5048191a78129fa534fe4a0 | heart-french |
| IMG_3158.jpg | libfile_705216b64eb48191b5d1c1b888eaec87 | pearl-almond |
| Zarif kirpik kıvrımı.png | libfile_efb1155612448191a16f31fb48af61ea | lash-detail |

İlk dört dosya mevcut fotoğraflardır. Kirpik kapağı daha önce üretilmiş mevcut görseldir. Erkek bakım yazısında sitenin onaylanmış tek el görseli yeniden kullanılır. Yeni on WebP dosyasının toplamı yaklaşık 316 kB'dır; tam dosya yerine ekran genişliğine uygun varyant seçilir.

## Yazılar

Galeri ile erkek bakım bandı arasına aynı fuşya saten zemin üzerinde `#yazilar` bölümü eklendi. Bir büyük kapak ve iki yardımcı kart, serif başlıklar, ince çizgiler ve açık renk metinler mevcut görsel dili sürdürür. Başlık: “Bakım notları.” Menü ve alt bilgiye “Yazılar” eklendi.

- Tırnak şeklinizi nasıl seçersiniz?
- Kirpikte size ait bir ifade
- Sade görünüm, özenli detaylar

Her yazının tam metni yerel HTML dialog içinde açılır; bunlar bağımsız SEO sayfaları değildir. İçerik stil ve tercih görüşmesine odaklanır. Uydurma yazar, tarih, fiyat, işlem süresi veya sağlık vaadi eklenmez. Mobilde bir büyük kapak ve iki yatay küçük kart; masaüstünde solda büyük, sağda iki kart vardır.

## Kontrol

TypeScript ve Vite üretim derlemesi geçti. Chrome'da 320×740, 360×800, 390×844, 430×932, 768×1024, 1024×768, 1440×900 iframe ölçülerinde galeri sayısı 6, yazı sayısı 3, yatay taşma yok; başlıklar kendi kutularına sığıyor; okuma düğmeleri en az 44 px. Önceki erkek başlık/düğme hizası, numara, WhatsApp ve animasyon yasağı korunur.

Üç yazı da açıldı; mobil 320/390 ve masaüstü okuma pencerelerinde taşma olmadığı, tam metinlerin kaydırılarak okunabildiği doğrulandı. Escape ve kapatma düğmesi, odak dönüşü, gövde kaydırma kilidinin kalkması ve Tab odağı döngüsü kontrol edildi. Yeni kalpli French görseli doğru açıklama ile büyütüldü. Fiziksel Safari/Android ve tam ekran okuyucu denetimi yapılmadı. Kontroller kaynak ve yerel üretim önizlemesine aittir; yayın sonrası canlı içerik ayrıca doğrulanır.
