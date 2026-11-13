'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import KassandraLogo from './KassandraLogo'
import LanguageSelector from './LanguageSelector'
import SocialLinks from './SocialLinks'

const navigationItems = [
  { label: 'Home', href: '/#home' },
  { label: 'Films', href: '/films' },
  { label: 'Poetry & Writing', href: '/poetry-writing' },
  { label: 'Festivals & Awards', href: '/awards' },
  { label: 'News', href: '/news' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function PortfolioHeader({
  backHref,
  backLabel,
}: {
  backHref?: string
  backLabel?: string
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)

  /* Keyboard and screen-reader users land inside the menu when it opens, and
     back on the menu button when it closes */
  useEffect(() => {
    if (menuOpen) closeButtonRef.current?.focus()
    else if (wasOpen.current) menuButtonRef.current?.focus()
    wasOpen.current = menuOpen
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  return (
    <>
      <header className="works-page__header">
        <KassandraLogo
          as={Link}
          className="works-page__name"
          href="/#home"
          aria-label="Kassandra Stanley Shostle — home"
        />
        <div className="works-page__actions">
          <LanguageSelector />
          {backHref && backLabel ? (
            <Link className="works-page__back" href={backHref}>
              {backLabel}
            </Link>
          ) : (
            <button
              ref={menuButtonRef}
              aria-controls="site-navigation"
              aria-expanded={menuOpen}
              aria-label="Open navigation"
              className="works-page__menu"
              onClick={() => setMenuOpen(true)}
              type="button"
            >
              <span />
              <span />
              <span />
            </button>
          )}
        </div>
      </header>

      <div
        aria-hidden={!menuOpen}
        className={`drawer-backdrop ${menuOpen ? 'is-open' : ''}`}
        inert={!menuOpen}
        onMouseDown={(event) => event.target === event.currentTarget && setMenuOpen(false)}
      >
        <aside
          aria-label="Site navigation"
          aria-modal="true"
          className="drawer"
          id="site-navigation"
          role="dialog"
        >
          <div className="drawer__top">
            <KassandraLogo className="drawer__name" />
            <p className="drawer__roles">Filmmaker · Poet · Performance Artist · Actor · Writer</p>
            <button
              ref={closeButtonRef}
              aria-label="Close navigation"
              className="drawer__close"
              onClick={() => setMenuOpen(false)}
              type="button"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <nav className="drawer__links" aria-label="Site navigation">
            {navigationItems.map((item) => (
              <Link href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="drawer__bottom">
            <SocialLinks className="drawer__socials" />
          </div>
        </aside>
      </div>
    </>
  )
}
