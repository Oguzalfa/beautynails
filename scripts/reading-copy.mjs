import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { siteConfig } from '../src/config/site.ts'
import seo from '../src/config/seo.json' with { type: 'json' }
import { languageLabel, languageNames, localeDir, locales, localeTags, ogLocales, pageHref } from '../src/i18n/routes.mjs'
import uz from './reading-copy-uz.mjs'
import tk from './reading-copy-tk.mjs'

export const readingCopy = {
  uz,
  tk,
  tr: {
    homeTitle: seo.title,
    homeDescription: seo.description,
    socialAlt: 'Şazi Beauty güzellik ve bakım seçkisi',
    back: 'Stüdyoya dön', journal: 'Bakım notları', contact: 'İletişim', book: 'Randevu Al',
    breadcrumb: 'Sayfa yolu', services: 'Hizmetler', serviceGuide: 'Hizmet rehberi',
    faq: 'Sık sorulan sorular', relatedServices: 'Diğer bakım seçenekleri',
    serviceImage: title => title + ' için güzellik seçkisi',
    serviceCta: ['Size uygun bakımı', 'birlikte planlayalım.'],
    articleCta: ['Size özel bir dokunuş.', 'Birlikte planlayalım.'],
    journalLabel: 'ŞAZİ JOURNAL', journalEyebrow: 'ŞAZİ JOURNAL / MAKALELER',
    journalTitle: 'Bakım Notları ve Stil Rehberi',
    journalDescription: 'Şazi Beauty’den tırnak stili, kirpik görünümü ve renk uyumu üzerine özgün bakım ve stil notları.',
    journalHeading: ['Güzelliğin', 'ince notları.'],
    journalIntro: 'Biraz ilham, biraz stil. Kendinize ayırdığınız zamana eşlik etsin.',
    readArticle: 'Yazıyı oku', readTime: time => time + ' okuma',
    inArticle: 'Bu yazıda', relatedArticles: 'Biraz daha ilham.',
    contactEyebrow: 'ŞAZİ BEAUTY / İLETİŞİM',
    contactTitle: 'İletişim ve Randevu',
    contactDescription: 'Şazi Beauty randevu ve hizmet bilgileri: 0501 128 18 08. Telefon, WhatsApp ve Instagram üzerinden iletişime geçin; bakım seçeneklerini birlikte planlayalım.',
    contactHeading: ['İletişim ve', 'randevu.'],
    contactIntro: 'Manikür, pedikür, ipek kirpik ve kalıcı makyaj hakkında bilgi almak veya randevu talebi göndermek için Şazi Beauty’ye ulaşın.',
    contactSection: 'Şazi Beauty ile iletişim',
    phone: 'Telefon', whatsapp: 'WhatsApp ile iletişim', form: 'Randevu formunu aç',
    contactNotes: 'İlgilendiğiniz hizmeti, uygun olduğunuz zaman aralığını ve varsa stil notlarınızı paylaşabilirsiniz. Randevu talebiniz ve hizmet ayrıntıları görüşmede netleştirilir.',
    missing: 'Bu sayfa bulunamadı.', home: 'Ana sayfaya dön',
  },
  en: {
    homeTitle: 'Şazi Beauty | Nail Art, Lash Extensions & Permanent Makeup',
    homeDescription: 'Explore nail art, manicures and pedicures, lash extensions, permanent makeup and brow care at Şazi Beauty. Plan your appointment on WhatsApp.',
    socialAlt: 'Beauty and care selection by Şazi Beauty',
    back: 'Back to the studio', journal: 'Beauty journal', contact: 'Contact', book: 'Book an appointment',
    breadcrumb: 'Breadcrumb', services: 'Services', serviceGuide: 'Service guide',
    faq: 'Frequently asked questions', relatedServices: 'Other beauty services',
    serviceImage: title => title + ' inspiration',
    serviceCta: ['Find the right treatment for you.', 'Let’s plan it together.'],
    articleCta: ['A personal touch.', 'Let’s plan it together.'],
    journalLabel: 'ŞAZİ JOURNAL', journalEyebrow: 'ŞAZİ JOURNAL / ARTICLES',
    journalTitle: 'Beauty Journal and Style Guide',
    journalDescription: 'Original beauty and style notes from Şazi Beauty on nail styling, lash looks and finding colors that suit you.',
    journalHeading: ['The finer notes', 'of beauty.'],
    journalIntro: 'A little inspiration, a little style, and a moment for yourself.',
    readArticle: 'Read the article', readTime: time => time,
    inArticle: 'In this article', relatedArticles: 'A little more inspiration.',
    contactEyebrow: 'ŞAZİ BEAUTY / CONTACT',
    contactTitle: 'Contact and Appointments',
    contactDescription: 'Contact Şazi Beauty at 0501 128 18 08 or reach us on WhatsApp and Instagram for information about services and appointments.',
    contactHeading: ['A personal', 'touch.'],
    contactIntro: 'Get in touch to discuss our services or request an appointment.',
    contactSection: 'Contact Şazi Beauty',
    phone: 'Phone', whatsapp: 'Contact us on WhatsApp', form: 'Open the appointment form',
    contactNotes: 'Tell us which service you’re interested in, when you’re available and any style preferences. We’ll confirm the appointment request and service details with you.',
    missing: 'This page was not found.', home: 'Back to the homepage',
  },
  de: {
    homeTitle: 'Şazi Beauty | Nageldesign, Wimpernverlängerung und Permanent Make-up',
    homeDescription: 'Entdecken Sie Nageldesign, Maniküre, Pediküre, Wimpernverlängerung, Permanent Make-up und Brauenpflege bei Şazi Beauty. Fragen Sie Ihren Termin per WhatsApp an.',
    socialAlt: 'Ausgewählte Beauty-Inspirationen von Şazi Beauty',
    back: 'Zurück zum Studio', journal: 'Beauty-Journal', contact: 'Kontakt', book: 'Termin anfragen',
    breadcrumb: 'Navigationspfad', services: 'Leistungen', serviceGuide: 'Leistungsübersicht',
    faq: 'Häufig gestellte Fragen', relatedServices: 'Weitere Behandlungen',
    serviceImage: title => 'Inspiration für ' + title,
    serviceCta: ['Die passende Pflege für Sie.', 'Planen wir sie gemeinsam.'],
    articleCta: ['Eine persönliche Note.', 'Planen wir sie gemeinsam.'],
    journalLabel: 'ŞAZİ JOURNAL', journalEyebrow: 'ŞAZİ JOURNAL / ARTIKEL',
    journalTitle: 'Beauty-Journal und Stilratgeber',
    journalDescription: 'Beauty- und Stilnotizen von Şazi Beauty zu Nageldesign, Wimpern-Looks und harmonischen Farbtönen.',
    journalHeading: ['Kleine Notizen', 'zur Schönheit.'],
    journalIntro: 'Ein wenig Inspiration, ein wenig Stil und ein Moment für Sie.',
    readArticle: 'Artikel lesen', readTime: time => time,
    inArticle: 'In diesem Artikel', relatedArticles: 'Noch mehr Inspiration.',
    contactEyebrow: 'ŞAZİ BEAUTY / KONTAKT',
    contactTitle: 'Kontakt und Termine',
    contactDescription: 'Erreichen Sie Şazi Beauty unter 0501 128 18 08 oder über WhatsApp und Instagram. Wir beantworten Fragen zu Leistungen und Terminen.',
    contactHeading: ['Eine persönliche', 'Note.'],
    contactIntro: 'Kontaktieren Sie uns bei Fragen zu Behandlungen oder für eine Terminanfrage.',
    contactSection: 'Kontakt zu Şazi Beauty',
    phone: 'Telefon', whatsapp: 'Kontakt per WhatsApp', form: 'Terminformular öffnen',
    contactNotes: 'Teilen Sie uns die gewünschte Leistung, Ihre verfügbaren Zeiten und Ihre Stilwünsche mit. Die Terminanfrage und die Details klären wir gemeinsam.',
    missing: 'Diese Seite wurde nicht gefunden.', home: 'Zurück zur Startseite',
  },
  ar: {
    homeTitle: 'Şazi Beauty | فن الأظافر وتركيب الرموش والمكياج الدائم',
    homeDescription: 'تعرّفوا على فن الأظافر والعناية بأظافر اليدين والقدمين وتركيب الرموش والمكياج الدائم والعناية بالحواجب لدى Şazi Beauty. اطلبوا موعدًا عبر واتساب.',
    socialAlt: 'مختارات الجمال والعناية من Şazi Beauty',
    back: 'العودة إلى الاستوديو', journal: 'مجلة العناية', contact: 'التواصل', book: 'طلب موعد',
    breadcrumb: 'مسار التنقل', services: 'الخدمات', serviceGuide: 'دليل الخدمات',
    faq: 'الأسئلة الشائعة', relatedServices: 'خدمات عناية أخرى',
    serviceImage: title => 'أفكار حول ' + title,
    serviceCta: ['عناية تناسبكم.', 'لنخطط لها معًا.'],
    articleCta: ['لمسة تخصّكم.', 'لنخطط لها معًا.'],
    journalLabel: 'مجلة ŞAZİ', journalEyebrow: 'مجلة ŞAZİ / مقالات',
    journalTitle: 'مجلة العناية ودليل الأناقة',
    journalDescription: 'مقالات من Şazi Beauty عن تصاميم الأظافر ومظهر الرموش وتنسيق الألوان بما يناسبكم.',
    journalHeading: ['ملاحظات صغيرة', 'عن الجمال.'],
    journalIntro: 'أفكار ملهمة ولمسات أنيقة، في وقت تخصّصونه لأنفسكم.',
    readArticle: 'قراءة المقال', readTime: time => time,
    inArticle: 'في هذا المقال', relatedArticles: 'المزيد من الأفكار.',
    contactEyebrow: 'ŞAZİ BEAUTY / التواصل',
    contactTitle: 'التواصل والمواعيد',
    contactDescription: 'تواصلوا مع Şazi Beauty على الرقم 0501 128 18 08 أو عبر واتساب وإنستغرام للاستفسار عن الخدمات وطلب موعد.',
    contactHeading: ['لمسة', 'تخصّكم.'],
    contactIntro: 'تواصلوا معنا للاستفسار عن خدمات العناية أو طلب موعد.',
    contactSection: 'التواصل مع Şazi Beauty',
    phone: 'الهاتف', whatsapp: 'التواصل عبر واتساب', form: 'فتح نموذج طلب الموعد',
    contactNotes: 'أخبرونا بالخدمة التي تهمّكم والوقت المناسب لكم وأي تفضيلات في الأسلوب. نؤكد معكم طلب الموعد وتفاصيل الخدمة.',
    missing: 'لم يتم العثور على هذه الصفحة.', home: 'العودة إلى الصفحة الرئيسية',
  },
  ru: {
    homeTitle: 'Şazi Beauty | Маникюр, педикюр и наращивание ресниц',
    homeDescription: 'Маникюр, педикюр, наращивание ресниц, перманентный макияж и уход за бровями в Şazi Beauty. Уточните детали услуги и запросите запись в WhatsApp.',
    socialAlt: 'Подборка образов и идей по уходу от Şazi Beauty',
    back: 'Вернуться в студию', journal: 'Журнал об уходе', contact: 'Контакты', book: 'Запросить запись',
    breadcrumb: 'Путь по сайту', services: 'Услуги', serviceGuide: 'Гид по услугам',
    faq: 'Частые вопросы', relatedServices: 'Другие услуги',
    serviceImage: title => 'Идеи и вдохновение: ' + title,
    serviceCta: ['Подберём уход, который подходит вам.', 'Обсудим детали вместе.'],
    articleCta: ['Индивидуальный подход.', 'Обсудим детали вместе.'],
    journalLabel: 'ЖУРНАЛ ŞAZİ', journalEyebrow: 'ЖУРНАЛ ŞAZİ / СТАТЬИ',
    journalTitle: 'Журнал об уходе и стиле',
    journalDescription: 'Статьи Şazi Beauty о дизайне ногтей, выразительности ресниц и сочетании оттенков.',
    journalHeading: ['Небольшие заметки', 'о красоте.'],
    journalIntro: 'Немного вдохновения, немного стиля и время для себя.',
    readArticle: 'Читать статью', readTime: time => time,
    inArticle: 'В этой статье', relatedArticles: 'Ещё немного вдохновения.',
    contactEyebrow: 'ŞAZİ BEAUTY / КОНТАКТЫ',
    contactTitle: 'Запись в WhatsApp и контакты',
    contactDescription: 'Запросите запись в Şazi Beauty через WhatsApp. Уточните свободное время, стоимость услуги и актуальный адрес перед визитом из Малтепе.',
    contactHeading: ['Контакты и', 'запись.'],
    contactIntro: 'Напишите в WhatsApp, чтобы обсудить маникюр, педикюр, наращивание ресниц или перманентный макияж и запросить запись.',
    contactSection: 'Связаться с Şazi Beauty',
    phone: 'Телефон', whatsapp: 'Написать в WhatsApp', form: 'Открыть форму записи',
    contactNotes: 'Укажите услугу, удобный день и время. Попросите подтвердить стоимость, длительность и актуальный адрес. Если едете из Малтепе, запросите ссылку на карту перед выездом. Запись согласовывается в переписке.',
    missing: 'Страница не найдена.', home: 'Вернуться на главную',
  },
}

export const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]))
export const origin = seo.origin
if (origin !== 'https://www.sazibeauty.com') throw new Error('Wrong production SEO origin')
export const absolute = path => new URL(path, origin).href
export const organizationId = absolute('/#organization')
const verification = String(process.env.GOOGLE_SITE_VERIFICATION || seo.googleSiteVerification || '').trim()
if (verification && !/^[A-Za-z0-9_-]{10,200}$/.test(verification)) {
  throw new Error('Invalid Google verification token: use the content value, not HTML')
}

export function alternateLinks(turkishPath) {
  return [
    ...locales.map(locale => ({ lang: localeTags[locale], url: absolute(pageHref(locale, turkishPath)) })),
    { lang: 'x-default', url: absolute(turkishPath) },
  ]
}

export const arrow = locale => `<span aria-hidden="true">${localeDir(locale) === 'rtl' ? '↖' : '↗'}</span>`

export function breadcrumb(locale, turkishPath, crumbs) {
  return {
    '@type': 'BreadcrumbList',
    '@id': absolute(pageHref(locale, turkishPath)) + '#breadcrumb',
    itemListElement: [[siteConfig.brand, '/'], ...crumbs].map(([name, path], index) => ({
      '@type': 'ListItem', position: index + 1, name, item: absolute(pageHref(locale, path)),
    })),
  }
}

function languagePicker(locale, turkishPath) {
  return `<details class="sz-language"><summary class="sz-language__trigger" aria-label="${escape(languageLabel[locale])}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg><bdi>${locale.toUpperCase()}</bdi></summary><ul class="sz-language__options">${locales.map(language => `<li><a href="${escape(pageHref(language, turkishPath))}" lang="${language}" dir="${localeDir(language)}" hreflang="${localeTags[language]}" data-site-language="${language}"${language === locale ? ' aria-current="page"' : ''}>${escape(languageNames[language])}</a></li>`).join('')}</ul></details>`
}

export function readingShell({ locale, turkishPath, stylesheet, body }) {
  const copy = readingCopy[locale]
  const home = pageHref(locale)
  const brand = `<a class="sz-reading-brand" href="${escape(home)}" lang="tr" dir="ltr">${escape(siteConfig.wordmark)}<small lang="en">${escape(siteConfig.tagline)}</small></a>`
  const header = `<header class="sz-content"><div class="sz-reading-header">${brand}<div class="sz-reading-actions"><a class="sz-pill-link" href="${escape(home)}">${escape(copy.back)} ${arrow(locale)}</a>${languagePicker(locale, turkishPath)}</div></div></header>`
  const footer = `<footer class="sz-reading-footer"><div class="sz-content">${brand}<a href="${escape(pageHref(locale, '/bakim-rehberi/'))}">${escape(copy.journal)}</a><a href="${escape(pageHref(locale, '/iletisim/'))}">${escape(copy.contact)}</a><a href="${escape(pageHref(locale, '/#iletisim'))}">${escape(copy.book)} ${arrow(locale)}</a><a href="${escape(siteConfig.instagramUrl)}" target="_blank" rel="noopener noreferrer" lang="en">Instagram</a></div></footer>`
  return `<!doctype html>
<html lang="${locale}" dir="${localeDir(locale)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#fad3e1"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${escape(stylesheet)}"><link rel="stylesheet" href="/language-picker.css"><script src="/language-preference.js" defer></script></head><body class="sz-theme sz-article-page">${header}${body}${footer}</body></html>`
}

export function metadata(html, { locale, turkishPath, title, description, type = 'website', pageType = 'WebPage', image = seo.socialImage, imageAlt = readingCopy[locale].socialAlt, graph = [] }) {
  const url = absolute(pageHref(locale, turkishPath))
  const homeUrl = absolute(pageHref(locale))
  const siteId = homeUrl + '#website'
  const organization = {
    '@type': 'Organization', '@id': organizationId, name: siteConfig.brand, url: absolute('/'),
    description: readingCopy[locale].homeDescription, logo: absolute('/favicon.svg'), image: absolute(seo.socialImage),
    telephone: '+' + siteConfig.whatsappNumber, sameAs: [siteConfig.instagramUrl],
    contactPoint: [{
      '@type': 'ContactPoint', telephone: '+' + siteConfig.whatsappNumber,
      contactType: 'customer service', availableLanguage: ['tr'],
    }],
  }
  const website = {
    '@type': 'WebSite', '@id': siteId, url: homeUrl, name: siteConfig.brand,
    inLanguage: localeTags[locale], publisher: { '@id': organizationId },
  }
  const webpage = {
    '@type': pageType, '@id': url + '#webpage', url, name: title, description,
    inLanguage: localeTags[locale], isPartOf: { '@id': siteId }, about: { '@id': organizationId },
  }
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': [organization, website, webpage, ...graph] }).replace(/</g, '\\u003c')
  const alternates = alternateLinks(turkishPath).map(({ lang, url }) => `<link rel="alternate" hreflang="${lang}" href="${escape(url)}">`).join('')
  const ogAlternates = locales.filter(language => language !== locale).map(language => `<meta property="og:locale:alternate" content="${ogLocales[language]}">`).join('')
  const head = `<title>${escape(title)}</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${escape(url)}">${alternates}<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><meta property="og:type" content="${type}"><meta property="og:locale" content="${ogLocales[locale]}">${ogAlternates}<meta property="og:site_name" content="${escape(siteConfig.brand)}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${escape(url)}"><meta property="og:image" content="${escape(absolute(image))}"><meta property="og:image:alt" content="${escape(imageAlt)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${escape(absolute(image))}"><meta name="twitter:image:alt" content="${escape(imageAlt)}">${locale === 'tr' && turkishPath === '/' && verification ? `<meta name="google-site-verification" content="${escape(verification)}">` : ''}<script type="application/ld+json">${ld}</script>`
  return html.replace(/<html\b([^>]*)>/i, (_, attrs) => `<html${attrs.replace(/\s(?:lang|dir)=["'][^"']*["']/gi, '')} lang="${locale}" dir="${localeDir(locale)}">`)
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\b(?=[^>]*(?:name=["'](?:description|robots|google-site-verification|twitter:[^"']*)["']|property=["']og:[^"']*["']))[^>]*>/gi, '')
    .replace(/<link\b(?=[^>]*(?:rel=["']canonical["']|hreflang=))[^>]*>/gi, '')
    .replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<\/head>/i, () => head + '</head>')
}

export async function writePage(locale, turkishPath, html) {
  const path = pageHref(locale, turkishPath)
  if (!path.startsWith('/') || !path.endsWith('/') || path.includes('//') || path.split('/').some(segment => segment === '..' || segment === '.')) {
    throw new Error('Invalid output path: ' + path)
  }
  const file = resolve('dist', '.' + path, 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, html, 'utf8')
}
