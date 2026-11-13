import Image from 'next/image'
import Link from 'next/link'
import type { Award, Media, Work } from '@/payload-types'

function asMedia(value: number | string | Media | null | undefined) {
  return value && typeof value === 'object' && value.url ? value : null
}

export default function FilmPresentation({
  film,
  priority = false,
  linkTitle = false,
  relatedAwards = [],
}: {
  film: Work
  priority?: boolean
  linkTitle?: boolean
  relatedAwards?: Award[]
}) {
  const poster = asMedia(film.poster)
  const galleryImages =
    film.gallery
      ?.map((item) => ({
        caption: item.caption,
        image: asMedia(item.image),
      }))
      .filter((item) => item.image) ?? []
  const filmHref = film.slug ? `/films/${film.slug}` : '/films'

  return (
    <article className="works-card">
      <div className="works-card__poster">
        {poster ? (
          linkTitle && film.slug ? (
            <Link href={filmHref} aria-label={`View ${film.title}`}>
              <Image
                src={poster.url!}
                alt={poster.alt}
                fill
                preload={priority}
                sizes="(min-width: 900px) 50vw, 100vw"
              />
            </Link>
          ) : (
            <Image
              src={poster.url!}
              alt={poster.alt}
              fill
              preload={priority}
              sizes="(min-width: 900px) 50vw, 100vw"
            />
          )
        ) : (
          <div className="works-card__empty">Image TBA</div>
        )}
      </div>

      <div className="works-card__body">
        <h2 className="notranslate" translate="no">
          {linkTitle && film.slug ? <Link href={filmHref}>{film.title}</Link> : film.title}
        </h2>
        <p className="works-card__meta">
          {[film.year || 'TBA', film.type, film.status, film.duration].filter(Boolean).join(' · ')}
        </p>
        {film.synopsis && <p className="works-card__lede">{film.synopsis}</p>}
        {film.description && <p>{film.description}</p>}
        {film.additionalInformation && <p>{film.additionalInformation}</p>}

        {film.credits && film.credits.length > 0 && (
          <dl className="works-card__credits">
            {film.credits.map((credit) => (
              <div key={credit.id}>
                <dt>{credit.label}</dt>
                <dd className="notranslate" translate="no">
                  {credit.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {relatedAwards.length > 0 && (
          <ul className="works-card__awards">
            {relatedAwards.map((award) => (
              <li key={award.id}>
                {[award.recognition, award.awardName, award.festivalName, award.year]
                  .filter(Boolean)
                  .join(' · ')}
              </li>
            ))}
          </ul>
        )}

        {film.trailerUrl && (
          <a
            className="works-card__trailer"
            href={film.trailerUrl}
            target="_blank"
            rel="noreferrer"
          >
            Watch trailer
          </a>
        )}
        {asMedia(film.trailerFile)?.url && (
          <video
            className="works-card__video"
            controls
            playsInline
            poster={poster?.url || undefined}
            preload="none"
          >
            <source src={asMedia(film.trailerFile)!.url!} />
          </video>
        )}
      </div>

      {galleryImages.length > 0 && (
        <div className="works-card__gallery">
          {galleryImages.map((item, galleryIndex) => (
            <figure key={`${film.id}-${galleryIndex}`}>
              <div>
                <Image
                  src={item.image!.url!}
                  alt={item.image!.alt}
                  fill
                  sizes="(min-width: 900px) 24vw, 50vw"
                />
              </div>
              {item.caption && <figcaption>{item.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </article>
  )
}
