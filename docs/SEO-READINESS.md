# BeautyNails — Google ve Search Console hazırlığı

Tarih: **6 Kasım 2026**. Bu belge `Oguzalfa/beautynails` projesine aittir. İşletme adı **BeautyNails**; başka salonların adı, adresi veya sosyal hesabı bu siteye aktarılmaz.

## Tercih edilen alan adı

Ana adres `https://www.beautynails.com.tr/` olarak belirlenmiştir. 6 Kasım 2026 canlı kontrolünde www adresi HTTPS üzerinden 200, kök `https://beautynails.com.tr/` ise www adresine 308 yönlendirmesi döndürdü. Bu, önceki DNS sorununun bu kontrolde görülmediğini gösterir; Search Console mülkiyet doğrulaması veya Google dizin durumu anlamına gelmez.

Canonical adresleri, sitemap ve sosyal paylaşım URL'leri aynı www alan adını kullanır. Vercel alt alan adları `X-Robots-Tag: noindex, follow` ile dizin dışında tutulur. Bu kural özel alan adına uygulanmaz. Özel alan adında sayfa HTML'i `index, follow` yönergesi taşır.

## Uygulama kapsamı

- Ana sayfa, dört hizmet sayfası, üç makale ve iki içerik dizini olmak üzere **10 URL** için ilk HTTP yanıtında gerçek metin içeren statik HTML hazırlanır. Kullanıcılar ve tarayıcılar aynı içeriği alır; yalnız botlara farklı sayfa sunulmaz.
- Her sayfanın tek H1'i, özgün başlığı ve açıklaması, kendi absolute canonical adresi, Open Graph ve Twitter paylaşım bilgisi vardır.
- Hizmetler ve yazılar gerçek `<a href>` bağlantılarıyla keşfedilir. Makale metni okumak için bir pencereye tıklamak veya JavaScript çalıştırmak gerekmez.
- `sitemap.xml` yalnız tercih edilen 10 URL'yi içerir; `robots.txt` taramaya izin verir ve sitemap adresini bildirir. Uydurma güncelleme tarihleri kullanılmaz.
- Bulunmayan adresler için ayrı 404 HTML'i hazırlanır; `noindex` taşır ve canonical içermez. Üretimde bilinmeyen adresin gerçek HTTP 404 dönmesi ayrıca doğrulanmalıdır.
- JSON-LD: Organization, WebSite, WebPage/CollectionPage, Service, Article, BreadcrumbList ve ilgili içerik listeleri kullanılır. Yapılandırılmış veri görünen içerikle aynı işletmeyi ve sayfayı tarif eder.

## Doğrulanmış ve eksik işletme bilgileri

Doğrulanmış telefon: **0532 242 23 03**. WhatsApp ve arama hedefleri aynı yapılandırmayı kullanır. Tam adres, ilçe/şehir ve çalışma saatleri henüz verilmedi. Bu nedenle yerel işletme/harita uygunluğunu varmış gibi göstermek yerine **Organization** kullanılır. Uydurma adres, koordinat, yorum, puan, fiyat aralığı, yazar kişi veya yayın tarihi eklenmez. Bu bilgiler işletme tarafından doğrulanınca görünür içeriğe ve uygun yapılandırılmış verilere birlikte eklenmelidir.

## Search Console bağlantısı

Gerçek Google hesabındaki mülk durumu bu kaynak değişikliğiyle doğrulanmış sayılmaz. Token verilmedi; örnek veya rastgele doğrulama kodu yayımlanmaz.

**Alan adı mülkü (önerilen):**

1. Search Console'da `beautynails.com.tr` için Alan adı mülkü eklenir.
2. Google'ın o hesap ve mülk için verdiği `google-site-verification=...` değeri alan adının yetkili DNS sağlayıcısına TXT kaydı olarak eklenir. Mevcut mail/MX kayıtları korunur.
3. Kaydın dışarıdan görünmesi beklendikten sonra Google'da doğrulama tamamlanır. Kayıt daha sonra silinmez.

**URL ön eki ile alternatif:** `https://www.beautynails.com.tr/` mülkünde HTML etiketi yöntemi seçilebilir. Google'ın verdiği yalnız token değeri Vercel'in Production ortamındaki `GOOGLE_SITE_VERIFICATION` değişkenine eklenir ve site yeniden derlenir/yayımlanır. Derleme gerçek token varsa etiketi üretir; değer yoksa etiket üretilmez. Bu etiket Domain mülkünün DNS doğrulamasının yerine geçmez.

Doğrulama tamamlandıktan sonra sitemap adresi `https://www.beautynails.com.tr/sitemap.xml` olarak gönderilir. URL Denetimi ile ana sayfa, bir hizmet ve bir yazı canlı test edilir; Google'ın seçtiği canonical ve dizin raporları izlenir. Sitemap göndermek, doğrulamayı tamamlamak veya indeks isteği vermek tek başına Google'ın sayfayı dizine aldığını kanıtlamaz.

## Teknik kabul ve yayın sonrası kontrol

Yerel kabul komutları:

```sh
npm run build
npm run check:seo
```

Kabul betiği renderer fonksiyonlarını tekrar kullanmak yerine `dist` içindeki gerçek HTML ve dosyaları inceler: 10 sayfa, tek H1, özgün metadata, canonical, JSON-LD türleri ve doğru işletme, tam makale metinleri, bağlantı üzerinden keşif, yerel görseller/fontlar/bundle dosyaları, sitemap, robots ve noindex 404 kontrol edilir. Bu bir sıralama puanı veya Google tarafından verilmiş sertifika değildir.

Yayın sonrasında özel alan adında 10 sayfanın 200, rastgele bulunmayan bir adresin 404, kök alan adının www'ye 308 döndüğü; www'de noindex başlığı olmadığı ve Vercel adresinde olduğu gerçek HTTP yanıtlarından kontrol edilmelidir. Tarayıcıda hydration hataları, yeni sayfaların mobil yerleşimi ve randevu akışı da doğrulanmalıdır. Kaynak denetimi tek başına bu canlı kontrollerin yerine geçmez.

## SEO ve GEO'nun sınırları

Google'ın AI özellikleri için ayrı bir AI şeması, AI metin dosyası veya özel bir "GEO puanı" gerekmiyor. Taranabilir sayfalar, açık ve doğru metinler, gerçek işletme bilgileri, iç bağlantılar ve kullanıcı deneyimi ortak temeldir. Google'ın tarama, dizine alma, sıralama veya AI yanıtlarında kaynak olarak gösterme kararları garanti edilemez. Yerel aramalarda gelişim için doğrulanmış işletme adresi ve tutarlı Google Business Profile bilgileri ayrıca gereklidir.

Resmî kaynaklar:

- [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Taranabilir bağlantılar](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Canonical adresleri](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Sitemap oluşturma ve gönderme](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [AI özellikleri ve web siteleri](https://developers.google.com/search/docs/appearance/ai-features)
- [Yerel işletme yapılandırılmış verisi](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Search Console sahiplik doğrulaması](https://support.google.com/webmasters/answer/9008080?hl=tr)
