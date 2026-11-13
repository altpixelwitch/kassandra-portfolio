'use server'

import { getPayloadClient } from '@/lib/payload'

export type ContactFormState = {
  errors?: Partial<Record<'email' | 'form' | 'message' | 'name', string>>
  success: boolean
}

const clean = (value: FormDataEntryValue | null, maxLength: number) =>
  typeof value === 'string'
    ? value
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, maxLength)
    : ''

export async function submitContactMessage(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const website = clean(formData.get('website'), 200)
  if (website) return { success: true }

  const name = clean(formData.get('name'), 120)
  const email = clean(formData.get('email'), 254).toLowerCase()
  const message = clean(formData.get('message'), 4000)
  const errors: NonNullable<ContactFormState['errors']> = {}

  if (name.length < 2) errors.name = 'Please enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (message.length < 10) errors.message = 'Please enter a message of at least 10 characters.'
  if (Object.keys(errors).length > 0) return { errors, success: false }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'contact-messages',
      data: { email, message, name },
      overrideAccess: false,
    })
    return { success: true }
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes('Too many')
        ? error.message
        : 'Your message could not be saved. Please check the form and try again.'
    return { errors: { form: message }, success: false }
  }
}
