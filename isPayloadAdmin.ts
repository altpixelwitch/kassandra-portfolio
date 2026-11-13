import type { Access } from 'payload'

export const isPayloadAdmin: Access = ({ req }) => req.user?.collection === 'admins'

export const isPayloadAdminGlobal: Access = ({ req }) => req.user?.collection === 'admins'

export const publicOrAdminRead: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true

  return {
    _status: {
      equals: 'published',
    },
  }
}
