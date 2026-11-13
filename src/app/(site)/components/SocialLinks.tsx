import Link from 'next/link'

export type SocialName = 'imdb' | 'vimeo' | 'youtube' | 'instagram' | 'letterboxd' | 'stage32' | 'x'

/* Recovered from the original portfolio and kept in one place so the menu,
   lower navigation and homepage footer can never drift apart again. */
export const socialLinks: {
  href: string
  label: string
  name: SocialName
}[] = [
  { name: 'imdb', label: 'IMDb', href: 'https://www.imdb.com/name/nm2998964' },
  { name: 'vimeo', label: 'Vimeo', href: 'https://vimeo.com/kassandrastanley' },
  { name: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@KassandraStanley' },
  { name: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/rolemodelkass' },
  { name: 'letterboxd', label: 'Letterboxd', href: 'https://letterboxd.com/auteur_kass' },
  { name: 'stage32', label: 'Stage 32', href: 'https://www.stage32.com/profile/kassandrastanley' },
  { name: 'x', label: 'X', href: 'https://x.com/KristinaCoolish' },
]

export default function SocialLinks({
  className,
  includeMessage = false,
  label = 'Official social profiles',
}: {
  className: string
  includeMessage?: boolean
  label?: string
}) {
  return (
    <nav aria-label={label} className={className}>
      {socialLinks.map((link) => (
        <a
          aria-label={link.label}
          href={link.href}
          key={link.name}
          rel="noopener noreferrer"
          target="_blank"
          title={link.label}
        >
          <span className="drawer__social-logo" data-icon={link.name} aria-hidden="true" />
        </a>
      ))}
      {includeMessage && (
        <Link aria-label="Send a message" href="/contact#message-form" title="Send a message">
          <span className="drawer__social-logo" data-icon="message" aria-hidden="true" />
        </Link>
      )}
    </nav>
  )
}
