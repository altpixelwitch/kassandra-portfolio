import Image from 'next/image'
import Link from 'next/link'
import {
  type Writing,
  type WritingFile,
  type WritingMedia,
  writingCategoryLabel,
  writingYear,
} from '@/lib/writings'
import WritingBody from './WritingBody'

/* One piece of Kassandra's writing, as visitors read it. Used by the public
   page and by the private preview, so the preview matches exactly. */

const asImage = (value: Writing['featuredImage']): WritingMedia | null =>
  value && typeof value === 'object' && value.url ? value : null

const asFile = (value: Writing['attachment']): WritingFile | null =>
  value && typeof value === 'object' && value.url ? value : null

const safeLink = (value: null | string | undefined) => {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch {
    return null
  }
}

export default function WritingArticle({ writing }: { writing: Writing }) {
  const image = asImage(writing.featuredImage)
  const year = writingYear(writing)
  const link = safeLink(writing.externalLink)
  // The PDF is offered only when it is set to public and the server allows the
  // visitor to read it (a private PDF never arrives here as a file)
  const pdf = writing.attachmentVisibility === 'public' ? asFile(writing.attachment) : null
  const poetry = writing.category === 'poetry'

  return (
    <article className={`writing ${poetry ? 'writing--verse' : 'writing--prose'}`}>
      <Link className="writing__back" href="/poetry-writing">
        <span aria-hidden="true">←</span> Back to Poetry &amp; Writing
      </Link>

      <header className="writing__header">
        <p className="writing__meta">
          <span>{writingCategoryLabel(writing.category)}</span>
          {year && <span className="notranslate" translate="no">{year}</span>}
        </p>
        <h1 className="notranslate" translate="no">
          {writing.title}
        </h1>
        {writing.subtitle && (
          <p className="writing__subtitle notranslate" translate="no">
            {writing.subtitle}
          </p>
        )}
        <p className="writing__author">
          By{' '}
          <span className="notranslate" translate="no">
            {writing.author || 'Kassandra Stanley Shostle'}
          </span>
        </p>
      </header>

      {image && (
        <figure className="writing__image">
          <Image
            alt={image.alt || ''}
            height={image.height || 900}
            sizes="(min-width: 900px) 720px, 100vw"
            src={image.url!}
            width={image.width || 1200}
          />
        </figure>
      )}

      <WritingBody body={writing.body} poetry={poetry} />

      {(writing.publicationCredit || link || pdf) && (
        <footer className="writing__footer">
          {writing.publicationCredit && (
            <p className="writing__credit notranslate" translate="no">
              {writing.publicationCredit}
            </p>
          )}
          {(link || pdf) && (
            <div className="writing__actions">
              {link && (
                <a className="btn writing__button" href={link} rel="noopener noreferrer" target="_blank">
                  Read where it was published
                </a>
              )}
              {pdf && (
                <a className="btn writing__button" download href={pdf.url!}>
                  Download PDF
                </a>
              )}
            </div>
          )}
        </footer>
      )}
    </article>
  )
}
