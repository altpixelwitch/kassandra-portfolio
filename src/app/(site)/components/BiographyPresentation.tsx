import Image from 'next/image'
import type { Biography, Media } from '@/payload-types'

function asMedia(value: number | string | Media | null | undefined) {
  return value && typeof value === 'object' && value.url ? value : null
}

/* The About page fields live in the "About page" section of About Me in the CMS */
type AboutFields = {
  aboutStandfirst?: string | null
  aboutOpening?: string | null
  aboutQuote?: string | null
  aboutChapters?: Array<{ heading?: string | null; body?: string | null; id?: string | null }> | null
}

/* Until Kassandra writes or approves her own words, each section shows what it
   will hold. None of this states facts about her. */
const placeholderOpening =
  'This page is a space for Kassandra to speak for herself. Her reflections will appear here once she has written or approved them.'

const placeholderChapters = [
  {
    heading: 'Beyond the titles',
    body: 'Who Kassandra is beyond her professional titles, in her own words.',
  },
  {
    heading: 'On making art',
    body: 'Her artistic philosophy and the perspective she brings to her work.',
  },
  {
    heading: 'Film, writing and performance',
    body: 'Her relationship with filmmaking, writing and performance, and how they meet.',
  },
  {
    heading: 'The questions in the work',
    body: 'The themes, questions and ideas that inform her films, writing and performances.',
  },
  {
    heading: 'How a story is told',
    body: 'Her individual approach to storytelling.',
  },
]

const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']

/* A textarea can hold several paragraphs separated by blank lines */
function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
}

export default function BiographyPresentation({ biography }: { biography: Biography }) {
  const about = biography as Biography & AboutFields
  const portrait = asMedia(biography.portrait)
  const standfirst = about.aboutStandfirst?.trim() || 'In her own words'
  const opening = about.aboutOpening?.trim()
  const quote = about.aboutQuote?.trim()
  const written = (about.aboutChapters ?? []).filter(
    (chapter) => chapter.heading?.trim() && chapter.body?.trim(),
  )
  const chapters = written.length
    ? written.map((chapter) => ({
        heading: chapter.heading!.trim(),
        body: chapter.body!.trim(),
        pending: false,
      }))
    : placeholderChapters.map((chapter) => ({ ...chapter, pending: true }))

  return (
    <>
      <section className="works-page__intro about__intro">
        <h1>About</h1>
        <span>{standfirst}</span>
      </section>

      <div className="panel panel--emerald">
        <div className="profile about__profile">
          <figure className="profile__photo">
            <span className="profile__photo-window">
              <Image
                alt="Kassandra Stanley Shostle"
                className={`profile__portrait profile__portrait--${biography.portraitPosition || 'center'}`}
                height="686"
                src={portrait?.url || '/images/kassandra-stanley-shostle-headshot.jpeg'}
                unoptimized={!portrait?.url?.startsWith('/api/')}
                width="789"
              />
            </span>
            <Image
              alt=""
              aria-hidden="true"
              className="profile__frame"
              height="4096"
              src="/images/ornate-gold-baroque-frame.webp"
              unoptimized
              width="4096"
            />
          </figure>
        </div>
      </div>

      <article className="about" aria-label="Biography">
        <div className={`about__opening${opening ? '' : ' about__opening--pending'}`}>
          {(opening ? paragraphs(opening) : [placeholderOpening]).map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>

        {quote && (
          <blockquote className="about__quote">
            <p>{quote}</p>
          </blockquote>
        )}

        <ol className="about__chapters">
          {chapters.map((chapter, index) => (
            <li
              className={`about__chapter${chapter.pending ? ' about__chapter--pending' : ''}`}
              key={`${chapter.heading}-${index}`}
            >
              <span aria-hidden="true" className="about__numeral notranslate" translate="no">
                {numerals[index] ?? index + 1}
              </span>
              <h3>{chapter.heading}</h3>
              <div className="about__body">
                {paragraphs(chapter.body).map((text, paragraph) => (
                  <p key={paragraph}>{text}</p>
                ))}
              </div>
              {chapter.pending && <span className="about__pending">Awaiting Kassandra’s words</span>}
            </li>
          ))}
        </ol>
      </article>
    </>
  )
}
