import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PortfolioHeader from '../components/PortfolioHeader'
import { getPublishedAwards } from '@/lib/content'
import type { Media, Work } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Festivals & Awards | Kassandra Stanley Shostle',
  description: 'Festival selections, awards, nominations, and professional recognition.',
}

function asMedia(value: number | string | Media | null | undefined) {
  return value && typeof value === 'object' && value.url ? value : null
}

function asFilm(value: number | string | Work | null | undefined) {
  return value && typeof value === 'object' ? value : null
}

export default async function AwardsPage() {
  const awards = await getPublishedAwards()

  return (
    <main className="works-page inner-page awards-page">
      <PortfolioHeader />
      <section className="works-page__intro">
        <p>Recognition</p>
        <h1>Festivals &amp; Awards</h1>
        <span>Selections · Nominations · Awards</span>
      </section>
      {awards.length > 0 ? (
        <div className="awards-page__grid">
          {awards.map((award) => {
            const laurel = asMedia(award.laurel)
            const film = asFilm(award.film)
            return (
              <article className="award-card" key={award.id}>
                {laurel && (
                  <div className="award-card__laurel">
                    <Image
                      alt={laurel.alt}
                      fill
                      sizes="(min-width: 800px) 18vw, 40vw"
                      src={laurel.url!}
                    />
                  </div>
                )}
                <p>{award.year || 'Recognition'}</p>
                <h2>{award.festivalName}</h2>
                <h3>
                  {award.customRecognition || award.recognition?.replaceAll('-', ' ')}
                  {award.awardName ? ` · ${award.awardName}` : ''}
                </h3>
                {award.location && <span>{award.location}</span>}
                {award.result && <p className="award-card__result">{award.result}</p>}
                {film?.slug && (
                  <Link className="notranslate" href={`/films/${film.slug}`} translate="no">
                    {film.title}
                  </Link>
                )}
              </article>
            )
          })}
        </div>
      ) : (
        <div className="works-page__empty">
          <p>Festival news will appear here.</p>
          <span>No awards or selections have been published yet.</span>
        </div>
      )}
    </main>
  )
}
