import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PortfolioHeader from '../components/PortfolioHeader'
import { getPublishedNews } from '@/lib/content'
import type { Media } from '@/payload-types'

export const metadata: Metadata = {
  title: 'News | Kassandra Stanley Shostle',
  description: 'Latest news and announcements from Kassandra Stanley Shostle.',
}

function asMedia(value: number | string | Media | null | undefined) {
  return value && typeof value === 'object' && value.url ? value : null
}

export default async function NewsPage() {
  const posts = await getPublishedNews()

  return (
    <main className="works-page inner-page">
      <PortfolioHeader />
      <section className="works-page__intro">
        <p>Journal</p>
        <h1>News</h1>
        <span>Films · Writing · Performance</span>
      </section>
      {posts.length > 0 ? (
        <div className="news-page__grid">
          {posts.map((post) => {
            const image = asMedia(post.mainImage)
            return (
              <article className="news-card" key={post.id}>
                {image && (
                  <Link className="news-card__image" href={`/news/${post.slug}`}>
                    <Image
                      alt={image.alt}
                      fill
                      sizes="(min-width: 900px) 45vw, 100vw"
                      src={image.url!}
                    />
                  </Link>
                )}
                <div>
                  <time dateTime={post.date || post.createdAt}>
                    {new Intl.DateTimeFormat('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }).format(new Date(post.date || post.createdAt))}
                  </time>
                  <h2>
                    <Link href={`/news/${post.slug}`}>{post.headline}</Link>
                  </h2>
                  {post.summary && <p>{post.summary}</p>}
                  <Link className="works-card__trailer" href={`/news/${post.slug}`}>
                    Read update
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="works-page__empty">
          <p>News will appear here.</p>
          <span>No updates have been published yet.</span>
        </div>
      )}
    </main>
  )
}
