import { revalidateTag } from 'next/cache'
import type { GlobalConfig } from 'payload'
import { isPayloadAdminGlobal } from '@/access/isPayloadAdmin'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Home Page',
  access: {
    read: () => true,
    update: isPayloadAdminGlobal,
  },
  admin: {
    description: 'Choose the featured film and update supporting homepage content.',
    group: 'My Website',
    preview: () => '/preview/home',
  },
  fields: [
    {
      name: 'featuredFilm',
      type: 'relationship',
      relationTo: 'works',
      label: 'Featured film',
      filterOptions: {
        and: [{ _status: { equals: 'published' } }, { archived: { not_equals: true } }],
      },
      admin: {
        description: 'Choose a film to feature on the home page.',
      },
    },
    {
      name: 'featuredVideo',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured video',
      admin: {
        description: 'Upload or choose the video shown in the main presentation. Optional.',
      },
    },
    {
      name: 'supportingText',
      type: 'textarea',
      label: 'Supporting text',
      admin: {
        description: 'Optional supporting copy for the featured film.',
      },
    },
    {
      name: 'heroImages',
      type: 'array',
      label: 'Homepage images',
      admin: {
        description: 'Optional. Add or reorder images for the homepage slideshow.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [() => revalidateTag('homepage', 'max')],
  },
  versions: {
    drafts: {
      autosave: true,
      validate: false,
    },
  },
}
