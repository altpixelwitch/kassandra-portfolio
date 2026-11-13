import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import FilmPresentation from '../../components/FilmPresentation'
import PortfolioHeader from '../../components/PortfolioHeader'
import { getAwardsForFilm } from '@/lib/content'
import { getPublishedWorkBySlug, getPublishedWorks } from '@/lib/works'

export async function generateStaticParams() {
  const films = await getPublishedWorks()

  return films.flatMap((film) => (film.slug ? [{ slug: film.slug }] : []))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const film = await getPublishedWorkBySlug(slug)

  if (!film) return {}

  return {
    title: `${film.title} | Kassandra Stanley Shostle`,
    description: film.synopsis || film.description || `A film by Kassandra Stanley Shostle.`,
  }
}

export default async function FilmPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const film = await getPublishedWorkBySlug(slug)

  if (!film) notFound()
  const awards = await getAwardsForFilm(film.id)

  return (
    <main className="works-page">
      <PortfolioHeader />

      <section className="works-page__intro works-page__intro--detail">
        <p>
          A film by{' '}
          <span className="notranslate" translate="no">
            Kassandra Stanley Shostle
          </span>
        </p>
        <h1 className="notranslate" translate="no">
          {film.title}
        </h1>
        <span>{[film.year, film.type, film.duration].filter(Boolean).join(' · ')}</span>
      </section>

      <FilmPresentation film={film} priority relatedAwards={awards} />
    </main>
  )
}
