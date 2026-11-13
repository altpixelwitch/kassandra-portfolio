import { revalidateTag } from 'next/cache'
import type { CollectionConfig } from 'payload'
import { isPayloadAdmin, publicOrAdminRead } from '@/access/isPayloadAdmin'

const revalidateLegalPage = ({
  doc,
  previousDoc,
}: {
  doc?: { pageType?: null | string }
  previousDoc?: { pageType?: null | string }
}) => {
  if (previousDoc?.pageType) revalidateTag(`legal:${previousDoc.pageType}`, 'max')
  if (doc?.pageType) revalidateTag(`legal:${doc.pageType}`, 'max')
}

export const LegalPages: CollectionConfig = {
  slug: 'legal-pages',
  labels: {
    singular: 'Legal Page',
    plural: 'Legal & Rights Pages',
  },
  access: {
    create: isPayloadAdmin,
    delete: isPayloadAdmin,
    read: publicOrAdminRead,
    update: isPayloadAdmin,
  },
  admin: {
    defaultColumns: ['title', 'pageType', 'reviewRequired', '_status', 'updatedAt'],
    description:
      'Editable legal drafts. Obtain professional legal advice before publishing substantive changes.',
    group: 'Settings',
    preview: (data) => (data?.pageType ? `/${data.pageType}` : '/privacy'),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'pageType',
      type: 'select',
      required: true,
      unique: true,
      options: [
        { label: 'Privacy Policy', value: 'privacy' },
        { label: 'Cookie Policy', value: 'cookies' },
        { label: 'Terms of Use', value: 'terms' },
        { label: 'Copyright & Intellectual Property', value: 'copyright' },
        { label: 'Accessibility Statement', value: 'accessibility' },
      ],
      admin: {
        description: 'Each page type can be used only once.',
        position: 'sidebar',
      },
    },
    {
      name: 'introduction',
      type: 'textarea',
      label: 'Introduction',
    },
    {
      name: 'sections',
      type: 'array',
      labels: {
        singular: 'Section',
        plural: 'Sections',
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
        },
        {
          name: 'body',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'reviewRequired',
      type: 'checkbox',
      defaultValue: true,
      label: 'Professional legal review required',
      admin: {
        description: 'Keep this selected until a qualified professional has reviewed the page.',
        position: 'sidebar',
      },
    },
    {
      name: 'lastReviewed',
      type: 'date',
      label: 'Last professionally reviewed',
      admin: {
        date: {
          displayFormat: 'dd MMMM yyyy',
          pickerAppearance: 'dayOnly',
        },
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateLegalPage],
    afterDelete: [revalidateLegalPage],
  },
  versions: {
    drafts: {
      autosave: true,
      validate: false,
    },
    maxPerDoc: 50,
  },
}
