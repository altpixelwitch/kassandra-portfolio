import type { Metadata } from 'next'
import Link from 'next/link'
import PortfolioHeader from '../components/PortfolioHeader'
import { getPublishedWritings, writingCategoryOrder, writingYear } from '@/lib/writings'

export const metadata: Metadata = {
  title: 'Poetry & Writing | Kassandra Stanley Shostle',
  description: 'Selected poetry, prose, essays and screenwriting by Kassandra Stanley Shostle.',
}

export default async function PoetryWritingPage() {
  const writings = await getPublishedWritings()
  // Only categories that hold published work are shown
  const groups = writingCategoryOrder
    .map((category) => ({
      ...category,
      items: writings.filter((writing) => writing.category === category.value && writing.slug),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <main className="works-page inner-page writing-page">
      <PortfolioHeader />
      <section className="works-page__intro writing-page__intro">
        <h1>Poetry &amp; Writing</h1>
        <span>Selected writing by Kassandra Stanley Shostle</span>
      </section>

      {groups.length > 0 ? (
        <div className="writing-collection">
          {groups.map((group) => (
            <section
              aria-labelledby={`writing-${group.value}`}
              className="writing-collection__group"
              data-zoom
              key={group.value}
            >
              <h2 className="writing-collection__category" id={`writing-${group.value}`}>
                {group.label}
              </h2>
              <ol className="writing-collection__list">
                {group.items.map((writing) => {
                  const year = writingYear(writing)
                  return (
                    <li key={writing.id}>
                      <Link className="writing-entry" href={`/poetry-writing/${writing.slug}`}>
                        <span className="writing-entry__title notranslate" translate="no">
                          {writing.title}
                        </span>
                        {writing.subtitle && (
                          <span className="writing-entry__subtitle notranslate" translate="no">
                            {writing.subtitle}
                          </span>
                        )}
                        {year && (
                          <span className="writing-entry__year notranslate" translate="no">
                            {year}
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </section>
          ))}
        </div>
      ) : (
        <div className="works-page__empty">
          <p>Writing will appear here.</p>
          <span>No writing has been published yet.</span>
        </div>
      )}
    </main>
  )
}
