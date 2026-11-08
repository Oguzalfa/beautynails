import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, normalizePath, type Plugin } from 'vite'

type ServiceRoute = { slug: string; localizedSlug?: string }
type JournalCard = ServiceRoute & {
  category: string
  title: string
  excerpt: string
  image: string
  alt: string
  readTime: string
}

function serviceRoute({ slug, localizedSlug }: ServiceRoute) {
  return { slug, localizedSlug }
}

function journalCard({ slug, localizedSlug, category, title, excerpt, image, alt, readTime }: JournalCard) {
  return { slug, localizedSlug, category, title, excerpt, image, alt, readTime }
}

function homepageContent(): Plugin {
  const contentId = (path: string) => normalizePath(fileURLToPath(new URL(`./src/content/${path}`, import.meta.url)))
  const servicesId = contentId('services-seo.json')
  const journalId = contentId('journal.json')
  const localeIds = new Set(['en', 'de', 'ar', 'ru', 'uz', 'tk'].map(locale => contentId(`localized/${locale}.json`)))

  return {
    name: 'sazi-homepage-content',
    enforce: 'pre',
    transform(source, id) {
      // Keep route and card data in the app. The standalone page builder reads the full JSON directly.
      if (id === servicesId) return JSON.stringify((JSON.parse(source) as ServiceRoute[]).map(serviceRoute))
      if (id === journalId) return JSON.stringify((JSON.parse(source) as JournalCard[]).map(journalCard))
      if (!localeIds.has(id)) return

      const { services, journal } = JSON.parse(source) as { services: ServiceRoute[]; journal: JournalCard[] }
      return JSON.stringify({ services: services.map(serviceRoute), journal: journal.map(journalCard) })
    },
  }
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [homepageContent(), react()],
  build: { copyPublicDir: !isSsrBuild },
}))
