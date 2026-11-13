import HomePageClient, {
  type HomeBiography,
  type HomeNews,
  type HomeWork,
} from './components/HomePageClient'
import { getBiography, getHomepage, getPublishedNews } from '@/lib/content'
import { getPublishedWorks } from '@/lib/works'
import type { Media, Work } from '@/payload-types'

function serializeMedia(value: number | string | Media | null | undefined) {
  if (!value || typeof value !== 'object' || !value.url) return null

  return {
    alt: value.alt,
    url: value.url,
  }
}

export default async function HomePage() {
  const [works, homepage, biography, publishedNews] = await Promise.all([
    getPublishedWorks(),
    getHomepage(),
    getBiography(),
    getPublishedNews(),
  ])
  const selectedFilm =
    homepage.featuredFilm && typeof homepage.featuredFilm === 'object'
      ? (homepage.featuredFilm as Work)
      : null
  const featured = selectedFilm ?? works.find((work) => work.featured) ?? works[0]
  const portrait = serializeMedia(biography.portrait)
  const featuredVideo = serializeMedia(homepage.featuredVideo)?.url
  const heroImages =
    homepage.heroImages
      ?.map((item) => serializeMedia(item.image)?.url)
      .filter((url): url is string => Boolean(url)) ?? []

  const featuredWork: HomeWork | null = featured
    ? {
        awards: featured.awards,
        credits: featured.credits,
        description: homepage.supportingText || featured.description,
        duration: featured.duration,
        poster: serializeMedia(featured.poster),
        slug: featured.slug,
        status: featured.status,
        synopsis: featured.synopsis,
        title: featured.title,
        type: featured.type,
        year: featured.year,
      }
    : null

  const biographyData: HomeBiography = {
    fullBiography: biography.fullBiography || '',
    portrait,
    portraitPosition: biography.portraitPosition || 'center',
    roles: biography.roles || 'Filmmaker · Poet · Performance Artist · Actor · Writer',
    shortBiography:
      biography.shortBiography ||
      'An international multilingual creative, with a background in film production, theatre, the healing arts, for the people and the natural world.',
  }

  const news: HomeNews[] = publishedNews.slice(0, 3).map((post) => ({
    body: post.summary || post.body || '',
    date: new Intl.DateTimeFormat('en-GB', { year: 'numeric' }).format(
      new Date(post.date || post.createdAt),
    ),
    href: `/news/${post.slug}`,
    title: post.headline,
  }))

  return (
    <HomePageClient
      biography={biographyData}
      featuredVideo={featuredVideo}
      featuredWork={featuredWork}
      heroImages={heroImages}
      news={news}
    />
  )
}
