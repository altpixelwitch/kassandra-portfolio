import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'
import { isPayloadAdmin } from '@/access/isPayloadAdmin'

const normalizeText = (value: unknown, maxLength: number) =>
  typeof value === 'string'
    ? value
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, maxLength)
    : ''

const protectMessage: CollectionBeforeValidateHook = async ({ data, operation, req }) => {
  if (operation !== 'create' || req.user?.collection === 'admins') return data

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  const recent = await req.payload.count({
    // The generated Config type picks up this new collection after Payload reloads.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collection: 'contact-messages' as any,
    overrideAccess: true,
    req,
    where: {
      and: [{ sourceIP: { equals: ip } }, { createdAt: { greater_than: since } }],
    },
  })

  if (recent.totalDocs >= 3) {
    throw new Error('Too many messages have been sent. Please wait and try again.')
  }

  const findGlobal = req.payload.findGlobal as (args: Record<string, unknown>) => Promise<unknown>
  const settings = (await findGlobal({
    slug: 'contact-settings',
    overrideAccess: true,
    req,
  })) as { messageRetentionDays?: number }
  const retentionDays =
    typeof settings.messageRetentionDays === 'number' ? settings.messageRetentionDays : 180

  return {
    ...data,
    deleteAfter: new Date(Date.now() + retentionDays * 24 * 60 * 60 * 1000).toISOString(),
    email: normalizeText(data?.email, 254).toLowerCase(),
    message: normalizeText(data?.message, 4000),
    name: normalizeText(data?.name, 120),
    sourceIP: ip,
    status: 'new',
  }
}

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: {
    singular: 'Message',
    plural: 'Messages',
  },
  access: {
    create: async ({ req }) => {
      if (req.user?.collection === 'admins') return true
      const findGlobal = req.payload.findGlobal as (
        args: Record<string, unknown>,
      ) => Promise<unknown>
      const settings = (await findGlobal({
        slug: 'contact-settings',
        overrideAccess: true,
        req,
      })) as { allowForm?: boolean }
      return settings.allowForm === true
    },
    delete: isPayloadAdmin,
    read: isPayloadAdmin,
    update: isPayloadAdmin,
  },
  admin: {
    defaultColumns: ['name', 'email', 'status', 'createdAt'],
    description: 'Private messages sent through the website contact form.',
    group: 'Messages',
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      maxLength: 4000,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Replied', value: 'replied' },
        { label: 'Archived', value: 'archived' },
      ],
      access: {
        create: ({ req }) => req.user?.collection === 'admins',
        update: ({ req }) => req.user?.collection === 'admins',
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'deleteAfter',
      type: 'date',
      label: 'Review for deletion after',
      access: {
        create: () => false,
        update: ({ req }) => req.user?.collection === 'admins',
      },
      admin: {
        description:
          'Review whether this message is still needed after this date. It is not deleted automatically.',
        position: 'sidebar',
      },
    },
    {
      name: 'sourceIP',
      type: 'text',
      access: {
        create: () => false,
        update: () => false,
      },
      admin: {
        hidden: true,
      },
    },
  ],
  hooks: {
    beforeValidate: [protectMessage],
  },
  versions: false,
}
