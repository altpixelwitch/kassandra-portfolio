import path from 'path'
import type { CollectionConfig } from 'payload'
import { isPayloadAdmin } from '@/access/isPayloadAdmin'
import { validateUploadSize } from '@/hooks/validateUpload'

/* PDFs that go with a piece of writing (a screenplay, for example).
   Every file starts private. A file becomes downloadable by visitors only while
   a published piece of writing uses it and Kassandra has chosen "Visitors can
   download it" on that piece. The `isPublic` switch below is set by the
   Poetry & Writing collection itself, never by hand, and the server checks it
   on every download request. */
export const WritingFiles: CollectionConfig = {
  slug: 'writing-files',
  labels: {
    singular: 'Writing PDF',
    plural: 'Writing PDFs',
  },
  access: {
    create: isPayloadAdmin,
    delete: isPayloadAdmin,
    read: ({ req }) => {
      if (req.user?.collection === 'admins') return true
      return { isPublic: { equals: true } }
    },
    update: isPayloadAdmin,
  },
  admin: {
    defaultColumns: ['filename', 'description', 'isPublic', 'updatedAt'],
    description:
      'PDF files attached to your writing. They stay private unless a published piece is set to let visitors download them.',
    group: 'Private Materials',
    useAsTitle: 'filename',
  },
  fields: [
    {
      name: 'description',
      type: 'text',
      label: 'Description',
      admin: {
        description: 'Optional. A note to help you recognise this file.',
      },
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: false,
      label: 'Visitors can currently download this file',
      access: {
        create: () => false,
        update: () => false,
      },
      admin: {
        description:
          'Set automatically. It turns on only while a published piece of writing offers this PDF to visitors.',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeValidate: [validateUploadSize(50 * 1024 * 1024)],
  },
  upload: {
    staticDir: path.join(process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads'), 'writing-files'),
    allowRestrictedFileTypes: false,
    mimeTypes: ['application/pdf'],
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'private, no-store')
      headers.set('X-Content-Type-Options', 'nosniff')
      headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
      return headers
    },
    pasteURL: false,
  },
  versions: false,
}
