import { revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeValidateHook,
  CollectionConfig,
  PayloadRequest,
} from 'payload'
import { isPayloadAdmin, publicOrAdminRead } from '@/access/isPayloadAdmin'

/* Poetry & Writing: Kassandra's poems, prose, essays and screenwriting.
   Each piece is saved as a private draft until she presses Publish. Only
   published pieces can be read by visitors, and only signed-in administrators
   can create, change, publish, unpublish or delete them. */

export const writingCategories = [
  { label: 'Poetry', value: 'poetry' },
  { label: 'Prose', value: 'prose' },
  { label: 'Essay', value: 'essay' },
  { label: 'Screenwriting', value: 'screenwriting' },
  { label: 'Other', value: 'other' },
] as const

const relationID = (value: unknown): null | number | string => {
  if (value && typeof value === 'object' && 'id' in value) {
    return (value as { id: number | string }).id
  }
  return typeof value === 'string' || typeof value === 'number' ? value : null
}

/* The web address. It is made from the title the first time a piece is saved
   and then kept, so links keep working if the title changes later. */
const toSlug = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

const keepAddress: CollectionBeforeValidateHook = async ({ data, originalDoc, req }) => {
  if (!data) return data
  const existing = typeof originalDoc?.slug === 'string' ? originalDoc.slug : ''
  const requested = typeof data.slug === 'string' ? toSlug(data.slug) : ''
  const title = typeof data.title === 'string' ? data.title : originalDoc?.title || ''

  let slug = requested || existing || toSlug(String(title)) || 'writing'
  if (slug !== existing) {
    // Make sure no other piece already uses this address
    const base = slug
    for (let attempt = 2; attempt < 50; attempt++) {
      const clash = await req.payload.find({
        // The generated Config type picks up this new collection after Payload reloads.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        collection: 'writings' as any,
        depth: 0,
        draft: true,
        limit: 1,
        overrideAccess: true,
        req,
        where: {
          and: [
            { slug: { equals: slug } },
            ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
          ],
        },
      })
      if (clash.totalDocs === 0) break
      slug = `${base}-${attempt}`
    }
  }
  return { ...data, slug }
}

/* A PDF may be downloaded by visitors only while a published piece offers it.
   After every save, publish, unpublish or delete, each PDF this piece uses (or
   used) is checked again and switched public or private to match. */
const syncAttachmentAccess = async (
  req: PayloadRequest,
  fileIDs: Array<null | number | string>,
) => {
  const unique = Array.from(new Set(fileIDs.filter((id) => id !== null)))
  for (const fileID of unique) {
    const offering = await req.payload.find({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collection: 'writings' as any,
      depth: 0,
      draft: false,
      limit: 1,
      overrideAccess: true,
      req,
      where: {
        and: [
          { _status: { equals: 'published' } },
          { attachment: { equals: fileID } },
          { attachmentVisibility: { equals: 'public' } },
        ],
      },
    })
    try {
      await req.payload.update({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        collection: 'writing-files' as any,
        data: { isPublic: offering.totalDocs > 0 },
        id: fileID,
        overrideAccess: true,
        req,
      })
    } catch (error) {
      // A file that has since been deleted needs no change
      req.payload.logger.warn({ err: error, msg: `Could not update writing PDF ${fileID}` })
    }
  }
}

const refreshWebsite = (slugs: Array<null | string | undefined>) => {
  revalidateTag('writings-list', 'max')
  for (const slug of new Set(slugs)) {
    if (slug) revalidateTag(`writing:${slug}`, 'max')
  }
}

const afterChange: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  const published = await req.payload
    .findByID({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collection: 'writings' as any,
      depth: 0,
      draft: false,
      id: doc.id,
      overrideAccess: true,
      req,
    })
    .catch(() => null)
  await syncAttachmentAccess(req, [
    relationID(doc.attachment),
    relationID(previousDoc?.attachment),
    relationID((published as { attachment?: unknown } | null)?.attachment),
  ])
  refreshWebsite([doc.slug, previousDoc?.slug])
  return doc
}

const afterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await syncAttachmentAccess(req, [relationID(doc.attachment)])
  refreshWebsite([doc.slug])
  return doc
}

export const Writings: CollectionConfig = {
  slug: 'writings',
  labels: {
    singular: 'Piece of Writing',
    plural: 'Poetry & Writing',
  },
  access: {
    create: isPayloadAdmin,
    delete: isPayloadAdmin,
    read: publicOrAdminRead,
    update: isPayloadAdmin,
  },
  admin: {
    defaultColumns: ['title', 'category', '_status', 'updatedAt'],
    description:
      'Add a poem or any other writing. Save it as a draft, preview it, and press Publish when you want visitors to read it.',
    group: 'My Website',
    listSearchableFields: ['title', 'subtitle', 'slug'],
    preview: (data) =>
      data?.id
        ? `/preview/writing/${data.id}`
        : data?.slug
          ? `/poetry-writing/${data.slug}`
          : '/poetry-writing',
    useAsTitle: 'title',
  },
  defaultSort: '-updatedAt',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
      maxLength: 200,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      maxLength: 300,
      admin: {
        description: 'Optional.',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'poetry',
      label: 'Category',
      options: [...writingCategories],
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      label: 'Your writing',
      admin: {
        description:
          'Type or paste your writing. Press Enter for a new line or stanza, and Shift + Enter for a line break within a stanza. Select words to make them italic or bold. Your line breaks and spacing are kept exactly as you write them.',
      },
    },
    {
      name: 'author',
      type: 'text',
      defaultValue: 'Kassandra Stanley Shostle',
      label: 'Author',
      maxLength: 200,
    },
    {
      name: 'publicationDate',
      type: 'date',
      label: 'Publication date',
      admin: {
        date: {
          displayFormat: 'dd MMMM yyyy',
          pickerAppearance: 'dayOnly',
        },
        description: 'Optional. Visitors see the year.',
        position: 'sidebar',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured image',
      admin: {
        description: 'Optional. A photograph or artwork shown above the writing.',
      },
    },
    {
      name: 'publicationCredit',
      type: 'text',
      label: 'Publication credit',
      maxLength: 300,
      admin: {
        description: 'Optional. For example: First published in Ambit, Spring 2025.',
      },
    },
    {
      name: 'externalLink',
      type: 'text',
      label: 'External link',
      maxLength: 500,
      admin: {
        description: 'Optional. A web address where the piece was published, starting with https://',
      },
      validate: (value: unknown) => {
        if (value === undefined || value === null || value === '') return true
        try {
          const url = new URL(String(value))
          return url.protocol === 'https:' || url.protocol === 'http:'
            ? true
            : 'Please enter a web address starting with https://'
        } catch {
          return 'Please enter a full web address starting with https://'
        }
      },
    },
    {
      name: 'attachment',
      type: 'upload',
      relationTo: 'writing-files',
      label: 'PDF attachment',
      admin: {
        description: 'Optional. For example, a screenplay. PDFs only, up to 50 MB.',
      },
    },
    {
      name: 'attachmentVisibility',
      type: 'radio',
      defaultValue: 'private',
      label: 'Who can see the PDF?',
      options: [
        { label: 'Only me (private)', value: 'private' },
        { label: 'Visitors can download it', value: 'public' },
      ],
      admin: {
        condition: (data) => Boolean(data?.attachment),
        description:
          'Visitors can download the PDF only after you publish this piece with "Visitors can download it" chosen.',
        layout: 'vertical',
      },
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      label: 'Web address',
      maxLength: 120,
      unique: true,
      admin: {
        description:
          'Made from the title when you first save. It then stays the same, even if you change the title, so links keep working.',
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [afterChange],
    afterDelete: [afterDelete],
    beforeValidate: [keepAddress],
  },
  versions: {
    drafts: {
      autosave: false,
    },
    maxPerDoc: 50,
  },
}
