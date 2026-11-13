import type { GlobalConfig } from 'payload'
import { isPayloadAdminGlobal } from '@/access/isPayloadAdmin'

export const WebsiteSettings: GlobalConfig = {
  slug: 'website-settings',
  label: 'Website Settings',
  access: {
    read: () => true,
    update: isPayloadAdminGlobal,
  },
  admin: {
    description: 'Review public website details without changing its visual design.',
    group: 'Settings',
  },
  fields: [
    {
      name: 'siteDescription',
      type: 'textarea',
      label: 'Website description',
      admin: {
        description: 'A short description used by search engines and social sharing.',
      },
    },
    {
      name: 'privacyContactEmail',
      type: 'email',
      label: 'Privacy contact email',
      admin: {
        description: 'Optional. Used only for privacy enquiries when provided.',
      },
    },
  ],
  versions: {
    drafts: {
      autosave: true,
      validate: false,
    },
  },
}
