export type JournalArticleId = 'tirnak-sekli' | 'kirpik-ifadesi' | 'erkek-bakimi'

export type JournalArticle = {
  id: JournalArticleId
  category: string
  title: string
  intro: string
  sections: readonly {
    heading: string
    paragraphs: readonly string[]
  }[]
}

export const journalArticles: readonly JournalArticle[] = [
  {
    id: 'tirnak-sekli',
    category: 'Tırnak',
    title: 'Tırnak şeklinizi nasıl seçersiniz?',
    intro: 'Renkten önce siluete bakın. Elinize, günlük hayatınıza ve sevdiğiniz detaylara uyan bir şekil seçmek için birkaç başlangıç noktası.',
    sections: [
      {
        heading: 'Önce günlük hayatınızı düşünün',
        paragraphs: [
          'Telefon ve klavye kullanımı, spor, yaptığınız iş ve sevdiğiniz takılar: tırnak seçimi bunların hepsiyle birlikte düşünülür. Fotoğrafta beğendiğiniz uzun bir model, kendi günlük düzeninizde farklı hissettirebilir. Randevuda yalnızca istediğiniz görünümü değil, ellerinizi nasıl kullandığınızı da anlatın. Kısa ve belirgin bir siluet de en az uzun bir tasarım kadar güçlü bir tercih olabilir.',
        ],
      },
      {
        heading: 'Silueti renk olmadan değerlendirin',
        paragraphs: [
          'Yuvarlak, oval, badem veya köşeli bir uç aynı rengi bambaşka gösterir. Seçenekleri karşılaştırırken önce sade, benzer tonlardaki örneklere bakın. Böylece parlaklığın veya desenin etkisiyle şeklin kendisini karıştırmazsınız. Keskin çizgileri mi, yumuşak geçişleri mi sevdiğinizi fark etmek seçimi kolaylaştırır. Fotoğrafı tek bir parmağa yakınlaştırmak yerine elin bütününe bakmak da iyi bir karşılaştırma sağlar.',
        ],
      },
      {
        heading: 'Bir referans, birkaç net detay',
        paragraphs: [
          'Birbirinden çok farklı onlarca görsel yerine iki ya da üç örnek seçin. Her birinde neyi sevdiğinizi ayırın: birinin boyunu, diğerinin rengini, bir başkasının ince French çizgisini. Bu parçaları konuşmak, fotoğrafın tamamını birebir istemekten daha açık bir tasarım tarifi verir. Kendi elinizdeki duruşu ve uygulanabilecek seçenekleri birlikte değerlendirerek kararı verin. Örneklerin yanında istemediğiniz bir ayrıntıyı da gösterebilirsiniz. Fazla geniş bir French çizgisi veya size uzun gelen bir uç, olumlu tercihleriniz kadar anlaşılır bir ipucudur. Bir tasarımın yalnızca küçük bir bölümünü beğenmeniz de aynı zamanda oldukça geçerli bir başlangıçtır.',
        ],
      },
      {
        heading: 'Son kararı bütüne bakarak verin',
        paragraphs: [
          'Renk, boy, şekil ve desen aynı anda öne çıkmak zorunda değil. Canlı bir fuşyayı sade bir yüzeyle, belirgin bir silueti daha sakin bir tonla eşleştirebilirsiniz. Randevu öncesi notunuza bir renk ailesi, bir uzunluk tercihi ve vazgeçmek istemediğiniz tek bir detay yazın. Hangi konuda kararsız olduğunuzu da ekleyin. Böylece görüşme, size ait bir görünümü birlikte netleştirmek için somut bir başlangıçla ilerler.',
        ],
      },
    ],
  },
  {
    id: 'kirpik-ifadesi',
    category: 'Kirpik',
    title: 'Kirpikte size ait bir ifade',
    intro: 'Daha belirgin, daha sade ya da yalnızca özenli bir görünüm. İstediğiniz ifadeyi randevuda anlatmanın yolları.',
    sections: [
      {
        heading: 'Model isminden önce istediğiniz his',
        paragraphs: [
          'Bir kirpik modelinin adını bilmek zorunda değilsiniz. Günlük makyajınızın ne kadar belirgin olduğunu, aynada hangi ifadeyi sevdiğinizi ve hangi görünümden uzak durmak istediğinizi anlatmak daha iyi bir başlangıç olabilir. “Gözlerim öne çıksın ama makyajımın tamamından daha baskın görünmesin” gibi bir cümle, seçtiğiniz fotoğraf kadar açıklayıcıdır. Görüşmeye bu kişisel tercihle başlayın.',
        ],
      },
      {
        heading: 'Referans fotoğrafı birlikte okuyun',
        paragraphs: [
          'Bir fotoğraftaki etki yalnızca kirpiklerden oluşmaz; ışık, çekim açısı ve göz makyajı da görüntünün parçasıdır. Bu yüzden örneği gösterirken hangi ayrıntıyı sevdiğinizi belirtin. Dış köşedeki vurgu mu, uçların daha yumuşak görünmesi mi, yoksa genel sadelik mi? Aynı fotoğrafın her kişide aynı sonucu vermesini beklemek yerine, beğendiğiniz ayrıntıyı konuşmanın başlangıcı olarak kullanın.',
        ],
      },
      {
        heading: 'Günlük görünümünüzü de hesaba katın',
        paragraphs: [
          'Çoğunlukla makyajsızsanız bunu söyleyin. Belirgin eyeliner kullanıyor, gözlük takıyor veya özel bir davet için hazırlanıyorsanız bu ayrıntıları da paylaşın. Gün içinde sevdiğiniz görünüm ile yalnızca fotoğrafta beğendiğiniz görünüm farklı olabilir. Tercihinizi gündüz ışığındaki sade örneklerle de karşılaştırın. Daha önce denediğiniz bir görünüm varsa sevdiğiniz ve değiştirmek istediğiniz tarafları ayrı ayrı not edin. Kendi fotoğraflarınız bu noktada işe yarayabilir. Kendinizi iyi hissettiğiniz bir kareyi ve size fazla belirgin gelen bir başka örneği birlikte göstermek, aradaki farkı kişisel örneklerinizle konuşmanızı kolaylaştırır. Fotoğrafları nasıl seçtiğiniz de kişisel zevkinizin bir parçasıdır.',
        ],
      },
      {
        heading: 'Görüşmeden net bir tasarım tarifiyle çıkın',
        paragraphs: [
          'Uygulama öncesinde hangi seçeneklerin size uygun olduğunu uzmanla değerlendirin. Yoğunluk, uzunluk ve vurgunun nerede toplanacağı hakkında aynı şeyi anladığınızdan emin olun. Birbirine benzeyen ifadeler farklı beklentilere karşılık gelebilir; örneğin “doğal” kelimesinin sizin için ne anlama geldiğini örnekle açıklayın. Kararsız kaldığınız noktaları sormak için model adlarını öğrenmeyi beklemeyin. İyi bir tasarım görüşmesinin amacı çok sayıda seçeneği ezberlemek değil, istediğiniz görünümü anlaşılır hale getirmektir.',
        ],
      },
    ],
  },
  {
    id: 'erkek-bakimi',
    category: 'Erkek bakımı',
    title: 'Sade görünüm, özenli detaylar',
    intro: 'Erkek manikür ve pediküründe görünümü belirleyen küçük kararlar: uzunluk, şekil ve bitiş tercihi.',
    sections: [
      {
        heading: 'Bakımlı görünümün tek bir tarifi yok',
        paragraphs: [
          'Belirgin bir parlaklık istemeden de özenli bir görünüm tercih edebilirsiniz. Randevuda doğal, sade veya daha belirgin bir bitiş istediğinizi açıkça söyleyin. “Hiç işlem yapılmamış gibi dursun” ile “düzenli ve net görünsün” farklı beklentiler olabilir. Elinizde nasıl bir görünüm görmek istediğinizi birlikte tarif etmek, görüşmenin en pratik başlangıcıdır. Daha önce manikür yaptırmamış olmanız da bu konuşmayı zorlaştırmaz.',
        ],
      },
      {
        heading: 'Uzunluğu günlük kullanımınıza göre konuşun',
        paragraphs: [
          'Masa başında çalışmak, enstrüman çalmak, spor yapmak veya ellerinizi sık kullandığınız bir işle uğraşmak tercihlerinizi etkileyebilir. Alışık olduğunuz tırnak uzunluğunu ve size rahatsız hissettiren şekilleri belirtin. Çok kısa bir görünümü sevip sevmediğinizi varsaymak yerine bunu görüşmede netleştirin. El ve ayak bakımında farklı tercihleriniz varsa ikisini ayrı değerlendirin; her ikisi için de tek bir estetik karara bağlı kalmanız gerekmez.',
        ],
      },
      {
        heading: 'Bitişi göstererek seçin',
        paragraphs: [
          'Mat, doğal veya parlak gibi kelimeler herkes için aynı görüntüyü çağrıştırmayabilir. Mümkünse bitiş örneklerine bakın ve size en yakın olanı gösterin. Bir fotoğraf getiriyorsanız elin tamamının göründüğü sade bir kare seçin. Işığın yarattığı yansımayı işlem tercihiyle karıştırmamak için fotoğrafta hangi ayrıntıyı beğendiğinizi açıklayın. Renkli ya da renksiz seçeneklerle ilgili beklentinizi de uygulama başlamadan önce konuşun. Seçim yaparken işte, günlük hayatta veya bir davette nasıl görünmek istediğinizi düşünün. Sevdiğiniz kıyafetler ve kullandığınız aksesuarlar da bu kişisel tercihi tarif etmenize yardımcı olabilir.',
        ],
      },
      {
        heading: 'İlk randevu için kısa bir not',
        paragraphs: [
          'Randevu talebinize el bakımı, ayak bakımı veya her ikisini istediğinizi ekleyin. Tercih ettiğiniz uzunluğu, bitişi ve özellikle sormak istediğiniz bir konuyu yazmanız yeterli. Bütün ayrıntılara önceden karar vermiş olmanız gerekmez; kararsız olduğunuz noktaları görüşmede değerlendirebilirsiniz. Önemli olan, size sunulan seçenekleri anlamanız ve sonunda kendi tarzınızla rahat ettiğiniz bir görünüm seçmenizdir. Sade bir sonuç isteyen biri için de bu küçük tasarım kararları dikkate değerdir.',
        ],
      },
    ],
  },
]
