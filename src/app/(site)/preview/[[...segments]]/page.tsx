import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import BiographyPresentation from '../../components/BiographyPresentation'
import FilmPresentation from '../../components/FilmPresentation'
import HomePageClient, {
  type HomeBiography,
  type HomeNews,
  type HomeWork,
} from '../../components/HomePageClient'
import NewsArticle from '../../components/NewsArticle'
import WritingArticle from '../../components/WritingArticle'
import PortfolioHeader from '../../components/PortfolioHeader'
import ContactPresentation from '../../contact/ContactPresentation'
import { getPayloadClient } from '@/lib/payload'
import type { Media, Work } from '@/payload-types'
import type { Writing } from '@/lib/writings'

export const dynamic = 'force-dynamic'

function serializeMedia(value: number | string | Media | null | undefined) {
  if (!value || typeof value !== 'object' || !value.url) return null
  return { alt: value.alt, url: value.url }
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ segments?: string[] }>
}) {
  const { segments = [] } = await params
  const [kind, id] = segments
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })

  if (user?.collection !== 'admins') notFound()

  if (kind === 'home') {
    const [homepage, biography, worksResult, newsResult] = await Promise.all([
      payload.findGlobal({
        slug: 'homepage',
        depth: 2,
        draft: true,
        overrideAccess: false,
        user,
      }),
      payload.findGlobal({
        slug: 'biography',
        depth: 2,
        draft: true,
        overrideAccess: false,
        user,
      }),
      payload.find({
        collection: 'works',
        depth: 2,
        draft: false,
        limit: 100,
        overrideAccess: false,
        user,
        where: { archived: { not_equals: true } },
      }),
      payload.find({
        collection: 'news',
        depth: 1,
        draft: false,
        limit: 3,
        overrideAccess: false,
        sort: '-date',
        user,
      }),
    ])
    const selected =
      homepage.featuredFilm && typeof homepage.featuredFilm === 'object'
        ? (homepage.featuredFilm as Work)
        : null
    const featured =
      selected ?? worksResult.docs.find((work) => work.featured) ?? worksResult.docs[0]
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
      portrait: serializeMedia(biography.portrait),
      portraitPosition: biography.portraitPosition || 'center',
      roles: biography.roles || 'Filmmaker · Screenwriter · Actor · Poet · Model',
      shortBiography:
        biography.shortBiography ||
        'An international multilingual creative, with a background in film production, theatre, the healing arts, for the people and the natural world.',
    }
    const news: HomeNews[] = newsResult.docs.map((post) => ({
      body: post.summary || post.body || '',
      date: new Date(post.date || post.createdAt).getFullYear().toString(),
      href: `/news/${post.slug}`,
      title: post.headline,
    }))
    const heroImages =
      homepage.heroImages
        ?.map((item) => serializeMedia(item.image)?.url)
        .filter((url): url is string => Boolean(url)) ?? []

    return (
      <>
        <p className="preview-banner preview-banner--fixed">Private draft preview</p>
        <HomePageClient
          biography={biographyData}
          featuredVideo={serializeMedia(homepage.featuredVideo)?.url}
          featuredWork={featuredWork}
          heroImages={heroImages}
          news={news}
          skipEntrance
        />
      </>
    )
  }

  if (kind === 'film' && id) {
    const film = await payload.findByID({
      collection: 'works',
      depth: 2,
      draft: true,
      id,
      overrideAccess: false,
      user,
    })
    return (
      <main className="works-page inner-page">
        <PortfolioHeader backHref="/admin/collections/works" backLabel="Back to editing" />
        <p className="preview-banner">Private draft preview</p>
        <FilmPresentation film={film} priority />
      </main>
    )
  }

  if (kind === 'news' && id) {
    const post = await payload.findByID({
      collection: 'news',
      depth: 2,
      draft: true,
      id,
      overrideAccess: false,
      user,
    })
    return (
      <main className="works-page inner-page">
        <PortfolioHeader backHref="/admin/collections/news" backLabel="Back to editing" />
        <p className="preview-banner">Private draft preview</p>
        <NewsArticle post={post} />
      </main>
    )
  }

  if (kind === 'writing' && id) {
    // The latest saved version, draft or published, exactly as visitors will see it
    const writing = (await payload.findByID({
      // The generated Config type picks up this new collection after Payload reloads.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collection: 'writings' as any,
      depth: 1,
      draft: true,
      id,
      overrideAccess: false,
      user,
    })) as unknown as Writing
    return (
      <main className="works-page inner-page writing-page">
        <PortfolioHeader backHref="/admin/collections/writings" backLabel="Back to editing" />
        <p className="preview-banner">Private draft preview</p>
        <WritingArticle writing={writing} />
      </main>
    )
  }

  if (kind === 'about') {
    const biography = await payload.findGlobal({
      slug: 'biography',
      depth: 2,
      draft: true,
      overrideAccess: false,
      user,
    })
    return (
      <main className="works-page inner-page">
        <PortfolioHeader backHref="/admin/globals/biography" backLabel="Back to editing" />
        <p className="preview-banner">Private draft preview</p>
        <BiographyPresentation biography={biography} />
      </main>
    )
  }

  if (kind === 'contact') {
    const settings = await payload.findGlobal({
      slug: 'contact-settings',
      depth: 1,
      draft: true,
      overrideAccess: false,
      user,
    })
    return (
      <main className="works-page inner-page">
        <PortfolioHeader backHref="/admin/globals/contact-settings" backLabel="Back to editing" />
        <p className="preview-banner">Private draft preview</p>
        <section className="works-page__intro">
          <p>Enquiries</p>
          <h1>Contact</h1>
          <span>Film · Writing · Performance · Collaboration</span>
        </section>
        <ContactPresentation preview settings={settings} />
      </main>
    )
  }

  notFound()
}
