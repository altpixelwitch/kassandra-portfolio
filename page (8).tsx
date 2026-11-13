import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NewsArticle from '../../components/NewsArticle'
import PortfolioHeader from '../../components/PortfolioHeader'
import { getPublishedNews, getPublishedNewsBySlug } from '@/lib/content'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const posts = await getPublishedNews()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedNewsBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.headline} | Kassandra Stanley Shostle`,
    description: post.summary || post.body || 'News from Kassandra Stanley Shostle.',
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPublishedNewsBySlug(slug)
  if (!post) notFound()

  return (
    <main className="works-page inner-page">
      <PortfolioHeader />
      <NewsArticle post={post} />
    </main>
  )
}
