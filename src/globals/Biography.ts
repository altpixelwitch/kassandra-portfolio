import { revalidateTag } from 'next/cache'
import type { GlobalConfig } from 'payload'
import { isPayloadAdminGlobal } from '@/access/isPayloadAdmin'

export const Biography: GlobalConfig = {
  slug: 'biography',
  label: 'About Me',
  access: {
    read: () => true,
    update: isPayloadAdminGlobal,
  },
  admin: {
    description: 'Update your biography and the photograph inside the existing gold frame.',
    group: 'My Website',
    preview: () => '/preview/about',
  },
  fields: [
    {
      name: 'roles',
      type: 'text',
      label: 'Professional roles',
      admin: {
        description: 'For example: Filmmaker · Poet · Performance Artist · Actor · Writer',
      },
    },
    {
      name: 'shortBiography',
      type: 'textarea',
      label: 'Short introduction',
      admin: {
        description: 'The larger introductory paragraph.',
      },
    },
    {
      name: 'fullBiography',
      type: 'textarea',
      label: 'My biography',
      admin: {
        description: 'Write or update your full biography.',
      },
    },
    {
      type: 'collapsible',
      label: 'About page',
      admin: {
        description:
          'The longer, more personal portrait shown only on the About page. Until these are filled in, the page shows gentle placeholders.',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'aboutStandfirst',
          type: 'text',
          label: 'Line beneath the About heading',
          admin: { description: 'A short line, for example: In her own words' },
        },
        {
          name: 'aboutOpening',
          type: 'textarea',
          label: 'Opening paragraph',
          admin: { description: 'Shown first, beneath the portrait.' },
        },
        {
          name: 'aboutChapters',
          type: 'array',
          label: 'Biography sections',
          labels: { singular: 'Section', plural: 'Sections' },
          maxRows: 8,
          admin: {
            description:
              'For example: who you are beyond your titles, your artistic philosophy, film, writing and performance, the questions in your work, and how you tell a story.',
          },
          fields: [
            { name: 'heading', type: 'text', label: 'Heading', required: true },
            { name: 'body', type: 'textarea', label: 'Text', required: true },
          ],
        },
        {
          name: 'aboutQuote',
          type: 'textarea',
          label: 'A line in your own words (optional)',
          admin: { description: 'Shown as a large quotation. Leave empty to hide it.' },
        },
      ],
    },
    {
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
      label: 'My photograph',
      admin: {
        description: 'Replacing this changes only the photograph inside the gold frame.',
      },
    },
    {
      name: 'portraitPosition',
      type: 'select',
      defaultValue: 'center',
      label: 'Photograph position',
      options: [
        { label: 'Centre', value: 'center' },
        { label: 'Top', value: 'top' },
        { label: 'Bottom', value: 'bottom' },
      ],
      admin: {
        description: 'Adjust the crop without changing the original image.',
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [() => revalidateTag('biography', 'max')],
  },
  versions: {
    drafts: {
      autosave: true,
      validate: false,
    },
  },
}
