import type { Metadata } from 'next'
import FilmPresentation from '../components/FilmPresentation'
import PortfolioHeader from '../components/PortfolioHeader'
import { getPublishedWorks } from '@/lib/works'

export const metadata: Metadata = {
  title: 'Films | Kassandra Stanley Shostle',
  description: 'Films written, directed, and performed by Kassandra Stanley Shostle.',
}

export default async function FilmsPage() {
  const films = await getPublishedWorks()

  return (
    <main className="works-page">
      <PortfolioHeader />

      <section className="works-page__intro">
        <p>Filmography</p>
        <h1>Films</h1>
        <span>Filmmaker · Poet · Performance Artist · Actor · Writer</span>
      </section>

      {films.length > 0 ? (
        <div className="works-grid">
          {films.map((film, index) => (
            <FilmPresentation film={film} key={film.id} linkTitle priority={index < 2} />
          ))}
        </div>
      ) : (
        <div className="works-page__empty">
          <p>No films have been published yet.</p>
          <span>New projects will appear here as they are added.</span>
        </div>
      )}
    </main>
  )
}
