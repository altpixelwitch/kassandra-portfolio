import path from 'path'
import type { CollectionConfig } from 'payload'
import { isPayloadAdmin } from '@/access/isPayloadAdmin'
import { validateUploadSize } from '@/hooks/validateUpload'

export const PrivateMedia: CollectionConfig = {
  slug: 'private-media',
  labels: {
    singular: 'Private File',
    plural: 'Private Films & Materials',
  },
  access: {
    create: isPayloadAdmin,
    delete: isPayloadAdmin,
    read: isPayloadAdmin,
    update: isPayloadAdmin,
  },
  admin: {
    description:
      'Unpublished films and production materials. These files are available only to authorised administrators.',
    group: 'Private Materials',
    useAsTitle: 'filename',
  },
  fields: [
    {
      name: 'description',
      type: 'text',
      label: 'Description',
      admin: {
        description: 'Describe the private file so it is easy to identify.',
      },
    },
    {
      name: 'relatedFilm',
      type: 'relationship',
      relationTo: 'works',
      label: 'Related film',
    },
    {
      name: 'copyrightOwner',
      type: 'text',
      label: 'Copyright owner',
      admin: {
        description: 'Optional. Record ownership information without changing the file.',
      },
    },
  ],
  hooks: {
    beforeValidate: [validateUploadSize(500 * 1024 * 1024)],
  },
  upload: {
    staticDir: path.join(process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads'), 'private-media'),
    allowRestrictedFileTypes: false,
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'private, no-store')
      headers.set('X-Content-Type-Options', 'nosniff')
      return headers
    },
    pasteURL: false,
  },
  versions: false,
}
