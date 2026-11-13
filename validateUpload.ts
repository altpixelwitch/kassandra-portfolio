import type { CollectionBeforeValidateHook } from 'payload'

export function validateUploadSize(maxBytes: number): CollectionBeforeValidateHook {
  return ({ data, req }) => {
    if (req.file && req.file.size > maxBytes) {
      const maximumMB = Math.round(maxBytes / 1024 / 1024)
      throw new Error(`This file is too large. Choose a file smaller than ${maximumMB} MB.`)
    }
    return data
  }
}
