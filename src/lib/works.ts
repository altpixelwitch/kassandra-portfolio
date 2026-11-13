import { unstable_cache } from 'next/cache'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import type { Work } from '@/payload-types'

/* Published, non-archived films, in the order set in the CMS */
export const getPublishedWorks = unstable_cache(
  async (): Promise<Work[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'works',
      depth: 2,
      draft: false,
      limit: 200,
      overrideAccess: false,
      sort: ['-featured', 'sortOrder', '-createdAt'],
      where: { archived: { not_equals: true } },
    })
    return result.docs
  },
  ['published-works-v1'],
  { tags: ['works-list'] },
)

export function getPublishedWorkBySlug(slug: string): Promise<Work | null> {
  return unstable_cache(
    async () => findBySlug<Work>('works', slug, { depth: 2 }),
    ['published-work-by-slug-v1', slug],
    { tags: ['works-list', `work:${slug}`] },
  )()
}
