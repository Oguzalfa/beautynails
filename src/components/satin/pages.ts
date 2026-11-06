import { journalImages } from './collection'
import { journalArticles } from './journal'

export type ContentImage = {
  src: string
  srcSet?: string
  sizes?: string
  width: number
  height: number
  alt: string
}

export type ContentPageData = {
  path: string
  title: string
  description: string
  kind: 'service' | 'article' | 'journal-index' | 'service-index'
  heading: string
  intro: string
  category: string
  sections: readonly { heading: string; paragraphs: readonly string[] }[]
  image?: ContentImage
  serviceId?: string
}

const servicePages: readonly ContentPageData[] = [
  {
    path: '/hizmetler/tirnak-sanati/',
    title: 'Tırnak Sanatı ve Manikür | BeautyNails',
    description: 'BeautyNails tırnak sanatı: tırnak şekli, renk, French ve desen tercihlerinizi birlikte değerlendirin. Bilgi ve randevu için iletişime geçin.',
    kind: 'service',
    serviceId: 'tirnak-sanati',
    category: 'Tırnak',
    heading: 'Tırnak Sanatı',
    intro: 'Renk, şekil ve küçük bir detay. Ellerinize ve günlük hayatınıza uyan görünümü birlikte netleştirelim.',
    image: { src: '/images/satin/service-nails-960.webp', width: 1122, height: 1402, alt: 'Fuşya badem tırnak tasarımının yakın planı' },
    sections: [
      {
        heading: 'Tırnak tasarımında nereden başlanır?',
        paragraphs: ['Tırnak tasarımını seçerken yalnızca renge değil, uzunluğa ve uç şekline de bakın. Yuvarlak, oval, badem veya daha köşeli bir siluet aynı oje rengini farklı gösterebilir. Kendi elinizde sevdiğiniz duruşu, günlük kullanımınızı ve istediğiniz görünümü görüşmede paylaşmanız seçimi kolaylaştırır.'],
      },
      {
        heading: 'Sade bir renk mi, belirgin bir desen mi?',
        paragraphs: ['Nude tonlar, French çizgileri, sedef yansımalar veya daha belirgin nail art detayları farklı estetik tercihlere karşılık gelir. Galeride birden fazla örneği karşılaştırabilir, bir fotoğrafın rengini ve başka bir fotoğrafın şeklini referans olarak seçebilirsiniz. Beğendiğiniz noktaları ayrı ayrı tarif etmek daha anlaşılır bir tasarım başlangıcı sağlar.'],
      },
      {
        heading: 'Randevu öncesi ne paylaşabilirsiniz?',
        paragraphs: ['Tercih ettiğiniz uzunluğu, sevdiğiniz renk ailesini ve özellikle istemediğiniz bir ayrıntıyı not edin. Klavye kullanımı, spor veya ellerinizi sık kullandığınız işler gibi günlük alışkanlıklarınızdan söz edebilirsiniz. Aklınızdaki modelin uygulanabilir seçenekleri ve ihtiyaç duyduğunuz işlem randevu görüşmesinde netleşir.'],
      },
      {
        heading: 'Bilgi ve randevu',
        paragraphs: ['Tırnak sanatı için randevu talebi oluştururken varsa seçtiğiniz referans görselleri ve sorularınızı paylaşın. İşlem kapsamı, uygun zaman ve güncel ücret hakkında doğrudan bilgi alabilirsiniz. Sitedeki randevu formu WhatsApp mesaj taslağı hazırlar; mesajı siz gönderirsiniz. Randevunuzun ayrıntılarını işletmeyle görüşerek kesinleştirin.'],
      },
    ],
  },
  {
    path: '/hizmetler/ipek-kirpik/',
    title: 'İpek Kirpik | BeautyNails',
    description: 'BeautyNails ipek kirpik hizmetinde uzunluk, yoğunluk ve istediğiniz ifadeyi birlikte değerlendirin. Bilgi ve randevu seçeneklerini öğrenin.',
    kind: 'service',
    serviceId: 'ipek-kirpik',
    category: 'Kirpik',
    heading: 'İpek Kirpik',
    intro: 'İstediğiniz bakışı tarif edin. Uzunluğu, yoğunluğu ve vurguyu kişisel tercihlerinizle birlikte konuşalım.',
    image: { ...journalImages['kirpik-ifadesi'], sizes: '(min-width: 1024px) 480px, 90vw' },
    sections: [
      {
        heading: 'İstediğiniz ifadeyi birlikte belirleyin',
        paragraphs: ['İpek kirpik için bir model adı bilmek zorunda değilsiniz. Daha sade bir görünüm mü, belirgin bir vurgu mu istediğinizi söylemeniz görüşmeye başlamak için yeterlidir. Günlük makyajınız ve sevdiğiniz örnekler üzerinden nasıl bir ifade aradığınızı anlatabilirsiniz.'],
      },
      {
        heading: 'Uzunluk ve yoğunluk tercihleri',
        paragraphs: ['Bir fotoğrafta beğendiğiniz etki, ışık ve makyajla birlikte oluşur. Bu yüzden örneği gösterirken yalnızca fotoğrafı değil, sevdiğiniz ayrıntıyı da tarif edin. Dış köşedeki vurgu, daha yumuşak bir siluet veya genel yoğunluk tercihiniz olabilir. Uygulanabilecek seçenekleri görüşmede birlikte değerlendirin.'],
      },
      {
        heading: 'Görüşmeye nasıl hazırlanabilirsiniz?',
        paragraphs: ['Daha önce denediğiniz görünümde sevdiğiniz ve değiştirmek istediğiniz noktaları not edin. Gözlük kullanımı ve günlük makyaj tercihi gibi ayrıntıları paylaşabilirsiniz. Uygulamanın kapsamı, size uygun seçenekler ve uygulama sonrası dikkat edilecek konular hakkında işlem öncesinde bilgi isteyin.'],
      },
      {
        heading: 'İpek kirpik randevusu',
        paragraphs: ['Randevu formunda İpek Kirpik seçeneğini kullanarak sorularınızı ve uygun olduğunuz zamanı iletebilirsiniz. Formun hazırladığı WhatsApp taslağını göndermek size aittir. İşletmeden alacağınız yanıtla işlem ayrıntılarını, uygun zamanı ve güncel ücret bilgisini netleştirin.'],
      },
    ],
  },
  {
    path: '/hizmetler/kalici-makyaj/',
    title: 'Kalıcı Makyaj | BeautyNails',
    description: 'BeautyNails kalıcı makyaj hizmeti: renk, şekil ve görünüm beklentinizi görüşmede netleştirin. İşlem kapsamı ve randevu için bilgi alın.',
    kind: 'service',
    serviceId: 'kalici-makyaj',
    category: 'Makyaj',
    heading: 'Kalıcı Makyaj',
    intro: 'Sevdiğiniz renkleri ve görünümü tarif edin. Uygulama seçeneklerini, beklentinizi ve sorularınızı işlem öncesinde değerlendirelim.',
    image: { src: '/images/satin/service-lips.webp', width: 1122, height: 1402, alt: 'Gül pembesi dudak renginin yakın planı' },
    sections: [
      {
        heading: 'Görünüm beklentinizi anlatın',
        paragraphs: ['Kalıcı makyaj görüşmesine, günlük makyajınızda sevdiğiniz renkleri ve çizgileri anlatarak başlayabilirsiniz. Daha belirgin bir görünüm mü, daha yumuşak bir vurgu mu istediğinizi örneklerle açıklayın. Beğendiğiniz bir fotoğrafı birebir sonuç vaadi olarak değil, beklentinizi anlatan bir başlangıç noktası olarak değerlendirin.'],
      },
      {
        heading: 'Renk ve şekli birlikte düşünün',
        paragraphs: ['Bir rengin fotoğraftaki duruşunu ışık, ekran ve makyajın geri kalanı etkileyebilir. Bu nedenle renk ailesini ve istediğiniz belirginlik düzeyini görüşmede netleştirmek önemlidir. Sevdiğiniz görünümün yanında istemediğiniz bir renk veya çizgi de varsa bunu paylaşın.'],
      },
      {
        heading: 'İşlem öncesinde sorulacak konular',
        paragraphs: ['Hangi uygulamaların sunulduğunu, işlemin kapsamını ve size uygun seçeneklerin nasıl değerlendirildiğini doğrudan sorun. Hazırlık, işlem sonrası süreç ve takip konularında işletmeden ayrıntılı bilgi alın. İşlemle ilgili kişisel durumlarınızı ve sorularınızı görüşme sırasında paylaşın; yalnızca bir görsele bakarak karar vermek zorunda değilsiniz.'],
      },
      {
        heading: 'Bilgi almak için iletişime geçin',
        paragraphs: ['Randevu talebinde Kalıcı Makyaj seçeneğini işaretleyip hangi görünümle ilgilendiğinizi not alanına yazabilirsiniz. WhatsApp üzerinden işlem kapsamını, uygun zamanı ve güncel ücret bilgisini öğrenebilirsiniz. Site formu bir mesaj taslağı oluşturur; talebinizin iletilmesi için mesajı sizin göndermeniz gerekir.'],
      },
    ],
  },
  {
    path: '/hizmetler/erkek-manikur-pedikur/',
    title: 'Erkek Manikür ve Pedikür | BeautyNails',
    description: 'BeautyNails erkek manikür ve pedikür hizmeti. El ve ayak bakımında uzunluk, şekil ve doğal bitiş tercihlerinizi görüşün; randevu bilgisi alın.',
    kind: 'service',
    serviceId: 'erkek-manikur-pedikur',
    category: 'Erkek bakımı',
    heading: 'Erkek Manikür & Pedikür',
    intro: 'Özenli bir görünüm için el ve ayak bakımını, günlük hayatınıza uyan uzunluk ve bitiş tercihleriyle birlikte değerlendirelim.',
    image: { ...journalImages['erkek-bakimi'], sizes: '(min-width: 1024px) 480px, 90vw' },
    sections: [
      {
        heading: 'El ve ayak bakımını ayrı değerlendirin',
        paragraphs: ['Erkek manikür ve pediküründe tek bir görünüm tercihi yoktur. El bakımında istediğiniz uzunluk ile ayak bakımındaki tercihiniz farklı olabilir. Randevu talebinde yalnızca manikür, yalnızca pedikür veya her ikisiyle ilgilendiğinizi belirtmek görüşmenin kapsamını netleştirir.'],
      },
      {
        heading: 'Doğal görünüm sizin için ne demek?',
        paragraphs: ['Bazı kişiler daha mat ve sade bir bitişi, bazıları daha belirgin bir görünümü tercih eder. Doğal, kısa veya bakımlı gibi kelimelerin sizin için ne ifade ettiğini örnekle anlatabilirsiniz. Alışık olduğunuz tırnak uzunluğunu ve özellikle istemediğiniz bir görünüm varsa onu da paylaşın.'],
      },
      {
        heading: 'Günlük hayatınıza uygun tercihler',
        paragraphs: ['İşiniz, enstrüman kullanımı, spor ve ellerinizi nasıl kullandığınız uzunluk veya şekil tercihinizi etkileyebilir. Görüşmede bu ayrıntılardan söz edebilirsiniz. Daha önce bakım yaptırmamış olmanız halinde de seçenekleri sormak ve işlem kapsamı hakkında bilgi istemek için önceden bütün ayrıntıları bilmeniz gerekmez.'],
      },
      {
        heading: 'Erkek bakım randevusu',
        paragraphs: ['Bu sayfadaki Randevu Al düğmesi erkek manikür ve pedikür seçeneğini hazır getirir. Not alanında el, ayak veya her ikisini istediğinizi ve sorularınızı yazabilirsiniz. Mesaj taslağını WhatsApp üzerinden siz gönderirsiniz; uygun zaman, güncel ücret ve işlem ayrıntıları işletmeyle görüşülerek kesinleştirilir.'],
      },
    ],
  },
]

const articlePages: readonly ContentPageData[] = journalArticles.map((article) => ({
  path: `/yazilar/${article.id}/`,
  title: `${article.title} | BeautyNails`,
  description: article.intro,
  kind: 'article',
  heading: article.title,
  intro: article.intro,
  category: article.category,
  sections: article.sections,
  image: { ...journalImages[article.id], sizes: '(min-width: 1024px) 480px, 90vw' },
}))

export const contentPages: readonly ContentPageData[] = [
  ...servicePages,
  ...articlePages,
  {
    path: '/hizmetler/',
    title: 'Tırnak, Kirpik, Kalıcı Makyaj ve Erkek Bakımı | BeautyNails',
    description: 'BeautyNails hizmetleri: tırnak sanatı, ipek kirpik, kalıcı makyaj ve erkek manikür-pedikür. Hizmet ayrıntılarını inceleyin, randevu için bilgi alın.',
    kind: 'service-index',
    heading: 'Size özel bakım.',
    intro: 'Tırnak, kirpik, makyaj ve erkek bakımında tercihlerinizi birlikte netleştirelim. İlgilendiğiniz hizmetin ayrıntılarını inceleyebilirsiniz.',
    category: 'Hizmetler',
    sections: [],
  },
  {
    path: '/yazilar/',
    title: 'Bakım Notları: Tırnak, Kirpik ve Erkek Bakımı | BeautyNails',
    description: 'BeautyNails bakım notları: tırnak şekli seçimi, kirpikte kişisel ifade ve erkek manikür-pedikür tercihleri üzerine yazılar.',
    kind: 'journal-index',
    heading: 'Bakım notları.',
    intro: 'Tırnak, kirpik ve erkek bakımında stilinizi seçerken size eşlik edecek notlar.',
    category: 'Güzellik & bakım',
    sections: [],
  },
]

export function normalizeContentPath(pathname: string): string {
  const path = pathname.split(/[?#]/, 1)[0] || '/'
  return path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`
}

export function getContentPage(pathname: string): ContentPageData | null {
  const path = normalizeContentPath(pathname)
  return contentPages.find((page) => page.path === path) ?? null
}
