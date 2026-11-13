import { revalidateTag } from 'next/cache'
import type { GlobalConfig } from 'payload'
import { isPayloadAdminGlobal } from '@/access/isPayloadAdmin'

export const ContactSettings: GlobalConfig = {
  slug: 'contact-settings',
  label: 'Contact Details',
  access: {
    read: () => true,
    update: isPayloadAdminGlobal,
  },
  admin: {
    description: 'Choose which professional contact methods appear on the website.',
    group: 'My Website',
    preview: () => '/preview/contact',
  },
  fields: [
    {
      name: 'introduction',
      type: 'textarea',
      label: 'Contact introduction',
      admin: {
        description: 'Optional text shown above your contact details.',
      },
    },
    {
      name: 'email',
      type: 'email',
      label: 'Professional email',
    },
    {
      name: 'showEmail',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show email on my website',
    },
    {
      name: 'telephone',
      type: 'text',
      label: 'Telephone number',
    },
    {
      name: 'showTelephone',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show telephone number on my website',
    },
    {
      name: 'allowForm',
      type: 'checkbox',
      defaultValue: false,
      label: 'Allow visitors to send me a message',
      admin: {
        description: 'Messages are stored privately in the Messages section.',
      },
    },
    {
      name: 'messageRetentionDays',
      type: 'number',
      defaultValue: 180,
      label: 'Message retention period in days',
      min: 1,
      max: 730,
      admin: {
        description:
          'Messages receive a review-by date based on this period. Deletion remains a deliberate administrator action.',
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [() => revalidateTag('contact-settings', 'max')],
  },
  versions: {
    drafts: {
      autosave: true,
      validate: false,
    },
  },
}
