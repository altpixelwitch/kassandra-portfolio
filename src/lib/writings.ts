import { unstable_cache } from 'next/cache'
import { writingCategories } from '@/collections/Writings'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import type { Media, Writing as GeneratedWriting, WritingFile } from '@/payload-types'

export type { WritingFile }
export type Writing = GeneratedWriting
export type WritingMedia = Media

/* The shape of a rich-text node saved by the editor */
export type LexicalNode = {
  children?: LexicalNode[]
  fields?: { url?: string }
  format?: number | string
  indent?: number
  listType?: string
  tag?: string
  text?: string
  type: string
  url?: string
}

export const writingCategoryOrder = writingCategories

export const writingCategoryLabel = (category: string | null | undefined) =>
  writingCategories.find((item) => item.value === category)?.label ?? 'Writing'

/* Visitors see only the year of publication */
export const writingYear = (writing: Pick<Writing, 'publicationDate'>) => {
  if (!writing.publicationDate) return null
  const year = new Date(writing.publicationDate).getUTCFullYear()
  return Number.isFinite(year) ? String(year) : null
}

export const getPublishedWritings = unstable_cache(
  async (): Promise<Writing[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collection: 'writings' as any,
      depth: 1,
      draft: false,
      limit: 200,
      overrideAccess: false,
      sort: ['-publicationDate', '-createdAt'],
    })
    return result.docs as unknown as Writing[]
  },
  ['published-writings-v1'],
  { tags: ['writings-list'] },
)

export function getPublishedWritingBySlug(slug: string): Promise<Writing | null> {
  return unstable_cache(
    async () => findBySlug<Writing>('writings', slug, { depth: 1 }),
    ['published-writing-by-slug-v1', slug],
    { tags: ['writings-list', `writing:${slug}`] },
  )()
}
