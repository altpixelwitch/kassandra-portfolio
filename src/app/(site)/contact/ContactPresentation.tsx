import Link from 'next/link'
import ContactForm from './ContactForm'
import type { ContactSetting } from '@/payload-types'

export default function ContactPresentation({
  preview = false,
  settings,
}: {
  preview?: boolean
  settings: ContactSetting
}) {
  const showEmail = settings.showEmail && settings.email
  const showTelephone = settings.showTelephone && settings.telephone
  const hasContactMethod = showEmail || showTelephone || settings.allowForm

  return (
    <section className="contact contact-page__body">
      <p className="contact-page__lede">
        {settings.introduction ||
          'Professional contact details and enquiries will appear here when available.'}
      </p>
      {hasContactMethod ? (
        <>
          {(showEmail || showTelephone) && (
            <div className="contact-page__methods">
              {showEmail && (
                <a href={`mailto:${settings.email}`}>
                  <span>Professional email</span>
                  <strong>{settings.email}</strong>
                </a>
              )}
              {showTelephone && (
                <a href={`tel:${settings.telephone?.replace(/[^\d+]/g, '')}`}>
                  <span>Telephone</span>
                  <strong>{settings.telephone}</strong>
                </a>
              )}
            </div>
          )}
          {settings.allowForm && (
            <div className="contact-page__form" id="message-form">
              <h2>Send a message</h2>
              <p>Messages are stored privately in Kassandra’s website manager.</p>
              {preview ? (
                <p className="contact-page__preview-note">
                  The message form is disabled in preview. It will work on the published page.
                </p>
              ) : (
                <ContactForm />
              )}
            </div>
          )}
        </>
      ) : (
        <p className="contact-page__empty">
          No public contact method is currently enabled. Official social profiles remain available
          from the main menu.
        </p>
      )}
      <p className="contact-page__privacy">
        Personal information is used only to respond to enquiries. Read the{' '}
        <Link href="/privacy">privacy notice</Link>.
      </p>
    </section>
  )
}
