import { revalidateTag } from 'next/cache'
import type { CollectionConfig } from 'payload'
import { isPayloadAdmin, publicOrAdminRead } from '@/access/isPayloadAdmin'

const revalidateNews = ({
  doc,
  previousDoc,
}: {
  doc?: { slug?: null | string }
  previousDoc?: { slug?: null | string }
}) => {
  revalidateTag('news-list', 'max')
  if (previousDoc?.slug) revalidateTag(`news:${previousDoc.slug}`, 'max')
  if (doc?.slug) revalidateTag(`news:${doc.slug}`, 'max')
}

export const News: CollectionConfig = {
  slug: 'news',
  labels: {
    singular: 'News Post',
    plural: 'News',
  },
  access: {
    create: isPayloadAdmin,
    delete: isPayloadAdmin,
    read: publicOrAdminRead,
    update: isPayloadAdmin,
  },
  admin: {
    defaultColumns: ['headline', 'date', 'featured', '_status', 'updatedAt'],
    description: 'Write an update, save it as a draft, preview it, and publish when ready.',
    group: 'My Website',
    listSearchableFields: ['headline', 'summary'],
    preview: (data) =>
      data?.id ? `/preview/news/${data.id}` : data?.slug ? `/news/${data.slug}` : '/news',
    useAsTitle: 'headline',
  },
  defaultSort: ['-featured', '-date', 'sortOrder'],
  orderable: true,
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      admin: {
        description: 'Give your update a title.',
      },
    },
    {
      name: 'slug',
      type: 'slug',
      useAsSlug: 'headline',
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Main image',
      admin: {
        description: 'Add a photograph if you would like.',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Short introduction',
      admin: {
        description: 'A short sentence for the News page. Optional.',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Your news',
      admin: {
        description: 'Write your update here.',
      },
    },
    {
      name: 'date',
      type: 'date',
      label: 'Date',
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: {
          displayFormat: 'dd MMMM yyyy',
          pickerAppearance: 'dayOnly',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'relatedFilm',
      type: 'relationship',
      relationTo: 'works',
      label: 'Related film',
      admin: {
        description: 'Optional.',
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Feature this update',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Display order',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateNews],
    afterDelete: [revalidateNews],
  },
  versions: {
    drafts: {
      autosave: true,
      validate: false,
    },
    maxPerDoc: 50,
  },
}
