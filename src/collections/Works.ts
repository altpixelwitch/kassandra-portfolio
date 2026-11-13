import { revalidateTag } from 'next/cache'
import type { CollectionConfig, Where } from 'payload'
import { isPayloadAdmin } from '@/access/isPayloadAdmin'

const publicOrAdminWorkRead: NonNullable<CollectionConfig['access']>['read'] = ({ req }) => {
  if (req.user?.collection === 'admins') return true

  const published: Where = { _status: { equals: 'published' } }
  const notArchived: Where = { archived: { not_equals: true } }
  return { and: [published, notArchived] }
}

const revalidateWorks = ({
  doc,
  previousDoc,
}: {
  doc?: { slug?: null | string }
  previousDoc?: { slug?: null | string }
}) => {
  revalidateTag('works-list', 'max')
  revalidateTag('homepage', 'max')
  if (previousDoc?.slug) revalidateTag(`work:${previousDoc.slug}`, 'max')
  if (doc?.slug) revalidateTag(`work:${doc.slug}`, 'max')
}

export const Works: CollectionConfig = {
  slug: 'works',
  access: {
    create: isPayloadAdmin,
    delete: isPayloadAdmin,
    read: publicOrAdminWorkRead,
    update: isPayloadAdmin,
  },
  admin: {
    defaultColumns: ['title', 'year', 'featured', 'archived', '_status', 'updatedAt'],
    description: 'Add a film, save a draft, preview it, and publish when it is ready.',
    group: 'My Website',
    preview: (data) =>
      data?.id ? `/preview/film/${data.id}` : data?.slug ? `/films/${data.slug}` : '/films',
    useAsTitle: 'title',
  },
  orderable: true,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'slug',
      useAsSlug: 'title',
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'year',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'type',
      type: 'text',
      label: 'Type / medium',
    },
    {
      name: 'status',
      type: 'text',
    },
    {
      name: 'duration',
      type: 'text',
    },
    {
      name: 'synopsis',
      type: 'textarea',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'awards',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'credits',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'trailerUrl',
      type: 'text',
      label: 'Trailer URL',
      admin: {
        description: 'Add a YouTube, Vimeo, or other public video link.',
      },
    },
    {
      name: 'trailerFile',
      type: 'upload',
      relationTo: 'media',
      label: 'Trailer upload',
      admin: {
        description: 'Optional. Upload a video instead of using a link.',
      },
    },
    {
      name: 'additionalInformation',
      type: 'textarea',
      label: 'Additional information',
      admin: {
        description: 'Anything else you would like visitors to know.',
      },
    },
    {
      name: 'privateMaterials',
      type: 'upload',
      relationTo: 'private-media',
      hasMany: true,
      label: 'Private films and production materials',
      admin: {
        description:
          'Optional. These files stay in administrator-only storage and never appear on the public film page.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'archived',
      type: 'checkbox',
      defaultValue: false,
      label: 'Archive this film',
      admin: {
        description: 'Archived films remain saved but are hidden from the public film list.',
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateWorks],
    afterDelete: [revalidateWorks],
  },
  versions: {
    drafts: {
      autosave: true,
      validate: false,
    },
    maxPerDoc: 50,
  },
}
