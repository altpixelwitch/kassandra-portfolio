import PortfolioHeader from './PortfolioHeader'
import { getPublishedLegalPage, legalFallbacks, type LegalPageType } from '@/lib/legal'

export default async function LegalPagePresentation({ pageType }: { pageType: LegalPageType }) {
  const managedPage = await getPublishedLegalPage(pageType)
  const fallback = legalFallbacks[pageType]
  const title = managedPage?.title ?? fallback.title
  const introduction = managedPage?.introduction ?? fallback.introduction
  const sections = managedPage?.sections?.length ? managedPage.sections : fallback.sections

  return (
    <main className="works-page inner-page">
      <PortfolioHeader />
      <section className="works-page__intro">
        <p>Website information</p>
        <h1>{title}</h1>
        <span>Clear · Proportionate · Reviewable</span>
      </section>
      <article className="legal-page">
        <p>{introduction}</p>
        {sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        {managedPage?.reviewRequired && (
          <p>
            <strong>Review note:</strong> The portfolio owner has marked this page as requiring
            professional legal review.
          </p>
        )}
      </article>
    </main>
  )
}
