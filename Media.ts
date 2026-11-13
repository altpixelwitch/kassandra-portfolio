import path from 'path'
import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'

import { createFolderField, createTagField } from 'payload'
import { validateUploadSize } from '@/hooks/validateUpload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Photo or Video',
    plural: 'Photos & Videos',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Description for visitors using screen readers',
      admin: {
        description: 'Briefly describe what is shown.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
    },
    {
      name: 'relatedFilm',
      type: 'relationship',
      relationTo: 'works',
      label: 'Related film',
      admin: {
        description: 'Optional. Helps you organise the library.',
      },
    },
    createFolderField({ relationTo: 'folders' }),
    createTagField({ relationTo: 'tags' }),
  ],
  hooks: {
    afterChange: [
      () => {
        revalidateTag('works-list', 'max')
        revalidateTag('writings-list', 'max')
      },
    ],
    afterDelete: [
      () => {
        revalidateTag('works-list', 'max')
        revalidateTag('writings-list', 'max')
      },
    ],
    beforeValidate: [validateUploadSize(500 * 1024 * 1024)],
  },
  upload: {
    staticDir: path.join(process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads'), 'media'),
    allowRestrictedFileTypes: false,
    mimeTypes: ['image/*', 'video/*'],
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600')
      return headers
    },
    pasteURL: false,
  },
}
