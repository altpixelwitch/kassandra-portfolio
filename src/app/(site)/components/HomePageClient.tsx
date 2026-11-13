'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import CinematicEntrance from './CinematicEntrance'
import HomepageFooter from './HomepageFooter'
import KassandraLogo from './KassandraLogo'
import LanguageSelector from './LanguageSelector'
import SocialLinks from './SocialLinks'

/* Temporary images: swap these for Kass's own stills, poster and portrait. */
const assets = {
  redPortrait:
    'https://images.unsplash.com/photo-1637961239771-6578d3eb8d8e?auto=format&fit=crop&w=2200&q=85',
  shore:
    'https://images.unsplash.com/photo-1706821554141-11d33c4b650b?auto=format&fit=crop&w=2200&q=85',
  water:
    'https://images.unsplash.com/photo-1597423638372-47d2468de1ce?auto=format&fit=crop&w=2200&q=85',
  silhouette:
    'https://images.unsplash.com/photo-1530501452251-8d78c4b7e7c1?auto=format&fit=crop&w=2200&q=85',
  waves:
    'https://images.unsplash.com/photo-1761399876992-8c8f295ea60e?auto=format&fit=crop&w=2200&q=85',
  profile:
    'https://images.unsplash.com/photo-1625856198195-909122522ec6?auto=format&fit=crop&w=1200&q=85',
}

const fallbackHeroStills = [assets.shore, assets.redPortrait, assets.silhouette, assets.waves]

const fallbackNews: HomeNews[] = [
  {
    date: '2026',
    title: 'TBA',
    body: 'TBA',
  },
  {
    date: '2027',
    title: 'TBA',
    body: 'TBA',
  },
  {
    date: '2027',
    title: 'TBA',
    body: 'TBA',
  },
]

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Films', href: '/films' },
  { label: 'Poetry & Writing', href: '/poetry-writing' },
  { label: 'Festivals & Awards', href: '/awards' },
  { label: 'News', href: '/news' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export type HomeWork = {
  slug?: string | null
  title: string
  year?: string | null
  type?: string | null
  status?: string | null
  duration?: string | null
  synopsis?: string | null
  description?: string | null
  poster?: {
    url: string
    alt: string
  } | null
  awards?: { text?: string | null }[] | null
  credits?: { label?: string | null; value?: string | null }[] | null
}

export type HomeBiography = {
  fullBiography: string
  portrait?: { alt: string; url: string } | null
  portraitPosition: string
  roles: string
  shortBiography: string
}

export type HomeNews = {
  body: string
  date: string
  href?: string
  title: string
}

function Chevron({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  )
}

function Placeholder({ children }: { children: string }) {
  return <span className="placeholder-tag">{children}</span>
}

function SectionTitle({ children, kicker }: { children: ReactNode; kicker?: string }) {
  return (
    <header className="section-title">
      {kicker && <p className="section-title__kicker">{kicker}</p>}
      <h2>{children}</h2>
    </header>
  )
}

/* Unsplash stills are requested at the size the screen needs, not always 2200px */
function unsplashLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const url = new URL(src)
  url.searchParams.set('w', String(width))
  url.searchParams.set('q', String(quality ?? 80))
  url.searchParams.set('auto', 'format')
  return url.toString()
}

function HeroSlideshow({ images, video }: { images: string[]; video?: string | null }) {
  const [active, setActive] = useState(0)
  /* Only the first still loads straight away; each next one loads just before it shows */
  const [loaded, setLoaded] = useState(1)

  useEffect(() => {
    setLoaded((count) => Math.max(count, Math.min(images.length, active + 2)))
  }, [active, images.length])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const timer = window.setInterval(() => setActive((i) => (i + 1) % images.length), 5500)
    return () => window.clearInterval(timer)
  }, [images.length])

  if (video) {
    return (
      <div className="hero__slides" aria-hidden="true">
        <video
          className="hero__video"
          src={video}
          poster={images[0]}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
    )
  }

  return (
    <div className="hero__slides" aria-hidden="true">
      {images.slice(0, loaded).map((src, i) => {
        const fromUnsplash = src.startsWith('https://images.unsplash.com/')
        return (
          <Image
            alt=""
            className={i === active ? 'is-active' : ''}
            fetchPriority={i === 0 ? 'high' : 'low'}
            fill
            key={src}
            loader={fromUnsplash ? unsplashLoader : undefined}
            loading="eager"
            sizes="(min-width: 900px) calc(100vw - 84px), calc(100vw - 36px)"
            src={src}
            unoptimized={!fromUnsplash && !src.startsWith('/api/')}
          />
        )
      })}
    </div>
  )
}

export default function HomePageClient({
  biography,
  featuredVideo,
  featuredWork,
  heroImages,
  news,
  skipEntrance = false,
}: {
  biography: HomeBiography
  featuredVideo?: string | null
  featuredWork: HomeWork | null
  heroImages: string[]
  news: HomeNews[]
  skipEntrance?: boolean
}) {
  const [entranceVisible, setEntranceVisible] = useState(!skipEntrance)
  const [menuOpen, setMenuOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuCloseRef = useRef<HTMLButtonElement>(null)
  const previewButtonRef = useRef<HTMLButtonElement>(null)
  const previewCloseRef = useRef<HTMLButtonElement>(null)
  const mounted = useRef(false)

  const overlayOpen = menuOpen || previewOpen
  const festivalItems = (featuredWork?.awards ?? [])
    .map((award) => award.text?.trim())
    .filter((text): text is string => Boolean(text))
  const pageLocked = overlayOpen || entranceVisible

  useEffect(() => {
    if (window.location.hash === '#home') setEntranceVisible(false)
  }, [])

  useEffect(() => {
    document.body.style.overflow = pageLocked ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        setPreviewOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [pageLocked])

  useEffect(() => {
    if (!mounted.current) return
    if (menuOpen) menuCloseRef.current?.focus()
    else menuButtonRef.current?.focus({ preventScroll: true })
  }, [menuOpen])

  useEffect(() => {
    if (!mounted.current) return
    if (previewOpen) previewCloseRef.current?.focus()
    else previewButtonRef.current?.focus({ preventScroll: true })
  }, [previewOpen])

  useEffect(() => {
    mounted.current = true
  }, [])

  return (
    <>
      {entranceVisible && <CinematicEntrance onComplete={() => setEntranceVisible(false)} />}

      <div className="site" inert={pageLocked}>
        <LanguageSelector fixed />
        <button
          ref={menuButtonRef}
          className="menu-button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-controls="site-menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        {/* ---------- Hero: stills play inside a rounded gilt frame ---------- */}
        <section id="home" className="hero">
          <div className="hero__frame">
            <HeroSlideshow
              images={heroImages.length > 0 ? heroImages : fallbackHeroStills}
              video={featuredVideo}
            />
            <div className="hero__shade" />
            <div className="hero__content">
              <KassandraLogo as="h1" className="hero__name" emblem="still" />
              <p className="hero__roles">Filmmaker · Poet · Performance Artist · Actor · Writer</p>
            </div>
            <nav className="hero__nav" aria-label="Main">
              <Link href="/about">About</Link>
              <Link href="/films">Films</Link>
            </nav>
            <Placeholder>Showreel goes here</Placeholder>
          </div>
        </section>

        <main>
          {/* ---------- Featured work ---------- */}
          <section id="works" className="block" data-zoom>
            <SectionTitle>Films</SectionTitle>

            <div className="panel panel--oxblood">
              {featuredWork ? (
                <div className="work">
                  <figure className="work__poster">
                    {featuredWork.poster ? (
                      <Image
                        src={featuredWork.poster.url}
                        alt={featuredWork.poster.alt}
                        fill
                        sizes="(min-width: 900px) 55vw, 100vw"
                      />
                    ) : (
                      <div className="work__poster-empty" aria-hidden="true" />
                    )}
                    <figcaption>
                      <span className="work__poster-credit">
                        A film by{' '}
                        <span className="notranslate" translate="no">
                          <span className="name--kassandra">Kassandra</span> Stanley Shostle
                        </span>
                        {featuredWork.year ? ` · ${featuredWork.year}` : ''}
                      </span>
                    </figcaption>
                  </figure>

                  <div className="work__info">
                    <p className="work__eyebrow">
                      {[featuredWork.type, featuredWork.status, featuredWork.duration]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                    <h3 className="work__title notranslate" translate="no">
                      {featuredWork.title}
                    </h3>
                    {featuredWork.synopsis && (
                      <>
                        <h4 className="label-heading">Synopsis</h4>
                        <p className="lede">{featuredWork.synopsis}</p>
                      </>
                    )}
                    {featuredWork.description && <p>{featuredWork.description}</p>}

                    {featuredWork.credits && featuredWork.credits.length > 0 && (
                      <dl className="credits">
                        {featuredWork.credits.map((credit, index) => (
                          <div key={index}>
                            <dt>{credit.label}</dt>
                            <dd>{credit.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}

                  </div>

                  {/* Under the poster on larger screens, after the details on phones */}
                  <div className="button-row work__actions">
                    <button
                      ref={previewButtonRef}
                      className="btn btn--primary"
                      onClick={() => setPreviewOpen(true)}
                    >
                      Watch the trailer <Chevron />
                    </button>
                    <Link
                      className="btn btn--ghost"
                      href={featuredWork.slug ? `/films/${featuredWork.slug}` : '/films'}
                    >
                      Film details <Chevron />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="work-empty">
                  <p>Works will appear here as they are published.</p>
                  <Link className="btn btn--ghost" href="/films">
                    View films <Chevron />
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* ---------- About ---------- */}
          <section id="profile" className="block" data-zoom>
            <SectionTitle>Profile</SectionTitle>

            <div className="panel panel--emerald">
              <div className="profile profile--home">
                <KassandraLogo as="h3" className="profile__name profile__name--logo" />
                <figure className="profile__photo">
                  <span className="profile__photo-window">
                    <Image
                      className={`profile__portrait profile__portrait--${biography.portraitPosition}`}
                      src={
                        biography.portrait?.url || '/images/kassandra-stanley-shostle-headshot.jpeg'
                      }
                      alt="Kassandra Stanley Shostle"
                      unoptimized={!biography.portrait?.url?.startsWith('/api/')}
                      width="789"
                      height="686"
                    />
                  </span>
                  <Image
                    className="profile__frame"
                    src="/images/ornate-gold-baroque-frame.webp"
                    alt=""
                    width="4096"
                    height="4096"
                    aria-hidden="true"
                    unoptimized
                  />
                </figure>
                <div className="profile__text">
                  <p className="profile__roles">Filmmaker · Poet · Performance Artist · Actor · Writer</p>
                  <p className="lede">{biography.shortBiography}</p>
                  {biography.fullBiography && <p>{biography.fullBiography}</p>}
                </div>
              </div>
            </div>
          </section>

          {/* ---------- Festivals & Awards ---------- */}
          {/* Filled from the featured film's "Festivals & awards" list in the CMS */}
          <section id="festivals" className="block block--narrow" data-zoom>
            <SectionTitle>Festivals &amp; Awards</SectionTitle>
            <ul className="awards awards--home">
              {(festivalItems.length > 0 ? festivalItems : ['Festival announcements TBA']).map(
                (text, index) => (
                  <li
                    className={festivalItems.length > 0 ? undefined : 'awards__pending'}
                    key={index}
                  >
                    {text}
                  </li>
                ),
              )}
            </ul>
          </section>

          {/* ---------- News ---------- */}
          <section id="news" className="block block--narrow" data-zoom>
            <SectionTitle>News</SectionTitle>
            <div className="news">
              {(news.length > 0 ? news : fallbackNews).map((item, i) => (
                <details key={i} className="news__item">
                  <summary>
                    <span className="news__date">{item.date}</span>
                    <span className="news__title">
                      {item.href ? <Link href={item.href}>{item.title}</Link> : item.title}
                    </span>
                    <Chevron className="news__chevron" />
                  </summary>
                  <p>{item.body}</p>
                </details>
              ))}
            </div>
          </section>
        </main>
        <HomepageFooter />
      </div>

      {/* ---------- Full-screen menu ---------- */}
      <div
        className={`drawer-backdrop ${menuOpen ? 'is-open' : ''}`}
        inert={!menuOpen}
        onMouseDown={(event) => event.target === event.currentTarget && setMenuOpen(false)}
        aria-hidden={!menuOpen}
      >
        <aside
          className="drawer"
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="drawer__top">
            <KassandraLogo className="drawer__name" />
            <p className="drawer__roles">Filmmaker · Poet · Performance Artist · Actor · Writer</p>
            <button
              ref={menuCloseRef}
              className="drawer__close"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <nav className="drawer__links" aria-label="Site navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="drawer__bottom">
            <SocialLinks className="drawer__socials" />
          </div>
        </aside>
      </div>

      {/* ---------- Trailer placeholder ---------- */}
      {previewOpen && (
        <div
          className="preview"
          role="dialog"
          aria-modal="true"
          aria-label="Trailer placeholder"
          onMouseDown={(e) => e.target === e.currentTarget && setPreviewOpen(false)}
        >
          <button
            ref={previewCloseRef}
            className="menu__close preview__close"
            onClick={() => setPreviewOpen(false)}
          >
            Close
          </button>
          <div className="preview__box">
            <Image
              alt=""
              fill
              sizes="(min-width: 800px) 70vw, 94vw"
              src={assets.water}
              unoptimized
            />
            <div className="preview__text">
              <span className="preview__play" aria-hidden="true">
                ▶
              </span>
              <p>Trailer coming soon</p>
              <small>
                Temporary preview ·{' '}
                <span className="notranslate" translate="no">
                  The Water Remembers
                </span>
              </small>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
