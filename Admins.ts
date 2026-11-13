import type { Access, CollectionConfig } from 'payload'

const isPayloadAdmin: Access = ({ req }) => req.user?.collection === 'admins'

export const Admins: CollectionConfig = {
  slug: 'admins',
  access: {
    delete: isPayloadAdmin,
    read: isPayloadAdmin,
    update: isPayloadAdmin,
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    lockTime: 10 * 60 * 1000,
    maxLoginAttempts: 5,
    tokenExpiration: 2 * 60 * 60,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
  versions: false,
}
