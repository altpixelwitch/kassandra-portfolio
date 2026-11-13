'use client'

import { useActionState } from 'react'
import { submitContactMessage, type ContactFormState } from './actions'

const initialState: ContactFormState = { success: false }

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactMessage, initialState)

  if (state.success) {
    return (
      <div className="contact-form__success" role="status">
        <h2>Message received</h2>
        <p>Your message has been saved securely for Kassandra to read.</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="contact-form">
      <div className="contact-form__field">
        <label htmlFor="contact-name">Name</label>
        <input
          aria-describedby={state.errors?.name ? 'contact-name-error' : undefined}
          aria-invalid={Boolean(state.errors?.name)}
          autoComplete="name"
          id="contact-name"
          name="name"
          required
        />
        {state.errors?.name && (
          <span className="contact-form__error" id="contact-name-error">
            {state.errors.name}
          </span>
        )}
      </div>
      <div className="contact-form__field">
        <label htmlFor="contact-email">Email</label>
        <input
          aria-describedby={state.errors?.email ? 'contact-email-error' : undefined}
          aria-invalid={Boolean(state.errors?.email)}
          autoComplete="email"
          id="contact-email"
          name="email"
          required
          type="email"
        />
        {state.errors?.email && (
          <span className="contact-form__error" id="contact-email-error">
            {state.errors.email}
          </span>
        )}
      </div>
      <div className="contact-form__field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          aria-describedby={state.errors?.message ? 'contact-message-error' : undefined}
          aria-invalid={Boolean(state.errors?.message)}
          id="contact-message"
          maxLength={4000}
          name="message"
          required
          rows={8}
        />
        {state.errors?.message && (
          <span className="contact-form__error" id="contact-message-error">
            {state.errors.message}
          </span>
        )}
      </div>
      <div aria-hidden="true" className="contact-form__honeypot">
        <label htmlFor="contact-website">Website</label>
        <input autoComplete="off" id="contact-website" name="website" tabIndex={-1} />
      </div>
      {state.errors?.form && (
        <p className="contact-form__error contact-form__error--form" role="alert">
          {state.errors.form}
        </p>
      )}
      <button className="btn btn--primary" disabled={pending} type="submit">
        {pending ? 'Saving message…' : 'Send message'}
      </button>
    </form>
  )
}
