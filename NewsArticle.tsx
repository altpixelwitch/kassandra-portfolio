import Image from 'next/image'
import type { Media, News, Work } from '@/payload-types'

function asMedia(value: number | string | Media | null | undefined) {
  return value && typeof value === 'object' && value.url ? value : null
}

function asFilm(value: number | string | Work | null | undefined) {
  return value && typeof value === 'object' ? value : null
}

export default function NewsArticle({ post }: { post: News }) {
  const image = asMedia(post.mainImage)
  const film = asFilm(post.relatedFilm)

  return (
    <article className="news-detail">
      <header>
        <time dateTime={post.date || post.createdAt}>
          {new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(new Date(post.date || post.createdAt))}
        </time>
        <h1>{post.headline}</h1>
        {post.summary && <p>{post.summary}</p>}
      </header>
      {image && (
        <div className="news-detail__image">
          <Image alt={image.alt} fill preload sizes="100vw" src={image.url!} />
        </div>
      )}
      {post.body && (
        <div className="news-detail__body">
          {post.body.split(/\n+/).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}
      {film?.slug && (
        <a className="works-card__trailer" href={`/films/${film.slug}`}>
          View related film
        </a>
      )}
    </article>
  )
}
