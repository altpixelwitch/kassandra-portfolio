import { unstable_cache } from 'next/cache'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import type { Work } from '@/payload-types'

export const getHomepage = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({
      slug: 'homepage',
      depth: 2,
      draft: false,
      overrideAccess: false,
    })
  },
  ['published-homepage-v1'],
  { tags: ['homepage'] },
)

export const getBiography = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({
      slug: 'biography',
      depth: 2,
      draft: false,
      overrideAccess: false,
    })
  },
  ['published-biography-v1'],
  { tags: ['biography'] },
)

export const getContactSettings = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({
      slug: 'contact-settings',
      depth: 1,
      draft: false,
      overrideAccess: false,
    })
  },
  ['published-contact-settings-v1'],
  { tags: ['contact-settings'] },
)

export const getPublishedAwards = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'awards',
      depth: 2,
      draft: false,
      limit: 100,
      overrideAccess: false,
      sort: ['-year', 'sortOrder', '-createdAt'],
    })
    return result.docs
  },
  ['published-awards-v1'],
  { tags: ['awards-list'] },
)

export const getPublishedNews = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'news',
      depth: 2,
      draft: false,
      limit: 100,
      overrideAccess: false,
      sort: ['-featured', '-date', 'sortOrder', '-createdAt'],
    })
    return result.docs
  },
  ['published-news-v1'],
  { tags: ['news-list'] },
)

export function getPublishedNewsBySlug(slug: string) {
  return unstable_cache(
    () => findBySlug('news', slug, { depth: 2 }),
    ['published-news-by-slug-v1', slug],
    { tags: ['news-list', `news:${slug}`] },
  )()
}

export async function getAwardsForFilm(filmID: Work['id']) {
  const awards = await getPublishedAwards()
  return awards.filter((award) => {
    if (!award.showOnFilmPage || !award.film) return false
    return typeof award.film === 'object' ? award.film.id === filmID : award.film === filmID
  })
}
