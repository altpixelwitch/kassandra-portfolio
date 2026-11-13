import config from '@payload-config'
import { getPayload } from 'payload'

/* One shared Payload instance for server code (pages, actions, cached reads) */
export const getPayloadClient = () => getPayload({ config })

/* The one published document of a collection with this slug, or null */
export async function findBySlug<T = unknown>(
  collection: 'news' | 'works' | 'writings',
  slug: string,
  options: { depth?: number } = {},
): Promise<T | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collection: collection as any,
    depth: options.depth ?? 1,
    draft: false,
    limit: 1,
    overrideAccess: false,
    where: { slug: { equals: slug } },
  })
  return (result.docs[0] as T | undefined) ?? null
}
