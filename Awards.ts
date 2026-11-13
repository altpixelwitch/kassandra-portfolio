import { revalidateTag } from 'next/cache'
import type { CollectionConfig } from 'payload'
import { isPayloadAdmin, publicOrAdminRead } from '@/access/isPayloadAdmin'

const revalidateAwards = () => {
  revalidateTag('awards-list', 'max')
  revalidateTag('works-list', 'max')
}

export const Awards: CollectionConfig = {
  slug: 'awards',
  labels: {
    singular: 'Festival or Award',
    plural: 'Festivals & Awards',
  },
  access: {
    create: isPayloadAdmin,
    delete: isPayloadAdmin,
    read: publicOrAdminRead,
    update: isPayloadAdmin,
  },
  admin: {
    defaultColumns: ['festivalName', 'year', 'recognition', 'film', '_status'],
    description: 'Add festival selections, nominations, wins, and professional recognition.',
    group: 'My Website',
    listSearchableFields: ['festivalName', 'awardName', 'location'],
    useAsTitle: 'festivalName',
  },
  defaultSort: ['-year', 'sortOrder'],
  orderable: true,
  fields: [
    {
      name: 'festivalName',
      type: 'text',
      label: 'Festival or recognition',
      required: true,
      admin: {
        description: 'What is the festival, organisation, or recognition called?',
      },
    },
    {
      name: 'location',
      type: 'text',
      label: 'Location',
      admin: {
        description: 'Where did it take place? Optional.',
      },
    },
    {
      name: 'year',
      type: 'text',
      label: 'Year',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'recognition',
      type: 'select',
      label: 'Recognition',
      options: [
        { label: 'Official Selection', value: 'official-selection' },
        { label: 'Nominee', value: 'nominee' },
        { label: 'Winner', value: 'winner' },
        { label: 'Honourable Mention', value: 'honourable-mention' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Choose the closest description.',
        position: 'sidebar',
      },
    },
    {
      name: 'customRecognition',
      type: 'text',
      label: 'Custom wording',
      admin: {
        condition: (_, siblingData) => siblingData?.recognition === 'other',
        description: 'Use your own wording.',
      },
    },
    {
      name: 'awardName',
      type: 'text',
      label: 'Award name',
      admin: {
        description: 'For example, Best Director. Optional.',
      },
    },
    {
      name: 'result',
      type: 'text',
      label: 'Result or supporting detail',
      admin: {
        description: 'Add any result or detail you would like visitors to see.',
      },
    },
    {
      name: 'laurel',
      type: 'upload',
      relationTo: 'media',
      label: 'Festival laurel or logo',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Supporting image',
    },
    {
      name: 'film',
      type: 'relationship',
      relationTo: 'works',
      label: 'Related film',
      admin: {
        description: 'Optional. Choose a film only when this recognition belongs to it.',
      },
    },
    {
      name: 'showOnFilmPage',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show this on the related film page',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.film),
      },
    },
    {
      name: 'website',
      type: 'text',
      label: 'Festival website',
      validate: (value: null | string | undefined) => {
        if (!value) return true
        try {
          const url = new URL(value)
          return ['http:', 'https:'].includes(url.protocol) || 'Use a full http or https link.'
        } catch {
          return 'Use a full http or https link.'
        }
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Display order',
      admin: {
        description: 'Lower numbers appear first within the same year.',
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateAwards],
    afterDelete: [revalidateAwards],
  },
  versions: {
    drafts: {
      autosave: true,
      validate: false,
    },
    maxPerDoc: 50,
  },
}
