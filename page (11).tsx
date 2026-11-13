import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PortfolioHeader from '../../components/PortfolioHeader'
import WritingArticle from '../../components/WritingArticle'
import { getPublishedWritingBySlug, getPublishedWritings } from '@/lib/writings'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const writings = await getPublishedWritings()
  return writings.filter((writing) => writing.slug).map((writing) => ({ slug: writing.slug! }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const writing = await getPublishedWritingBySlug(slug)
  if (!writing) return {}
  return {
    title: `${writing.title} | Kassandra Stanley Shostle`,
    description: writing.subtitle || `Writing by ${writing.author || 'Kassandra Stanley Shostle'}.`,
  }
}

export default async function WritingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // Only published writing is returned; drafts and unpublished pieces show
  // the site's "not found" page
  const writing = await getPublishedWritingBySlug(slug)
  if (!writing) notFound()

  return (
    <main className="works-page inner-page writing-page">
      <PortfolioHeader />
      <WritingArticle writing={writing} />
    </main>
  )
}
