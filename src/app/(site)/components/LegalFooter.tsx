import Link from 'next/link'
import SocialLinks from './SocialLinks'
import { getContactSettings } from '@/lib/content'

const links = [
  ['Privacy', '/privacy'],
  ['Cookies', '/cookies'],
  ['Terms', '/terms'],
  ['Copyright', '/copyright'],
  ['Accessibility', '/accessibility'],
] as const

export default async function LegalFooter() {
  const contactSettings = await getContactSettings()
  const email =
    contactSettings.showEmail && contactSettings.email ? contactSettings.email : undefined

  return (
    <footer className="legal-footer">
      <div className="legal-footer__copy">
        {email && (
          <div className="legal-footer__contact">
            <span>Contact</span>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
        )}
      </div>
      <SocialLinks
        className="legal-footer__socials"
        includeMessage
        label="Official profiles and contact"
      />
      <div className="legal-footer__bar">
        <p className="legal-footer__rights">
          © {new Date().getFullYear()}{' '}
          <span className="notranslate" translate="no">
            Kassandra Stanley Shostle
          </span>
          . All rights reserved.
        </p>
        <nav aria-label="Legal information">
          {links.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
