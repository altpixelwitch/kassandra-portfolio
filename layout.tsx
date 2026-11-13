import React from 'react'
import type { Metadata, Viewport } from 'next'
import AnalyticsConsent from './components/AnalyticsConsent'
import LegalFooter from './components/LegalFooter'
import SiteParticles from './components/SiteParticles'
import SmoothCursor from './components/SmoothCursor'
import SiteLanguage from './components/SiteLanguage'
import ScrollZoom from './components/ScrollZoom'
import { BodyCustomCode, renderHeadCustomCode } from '@/lib/make-custom-code'
import { makeSiteSettings, sanitizeHtmlAttribute } from '@/lib/make-site-settings'
import './styles.css'

const defaultTitle = 'Kassandra Stanley Shostle'
const title = makeSiteSettings.title ?? defaultTitle
const description =
  makeSiteSettings.description ?? 'Filmmaker, poet, performance artist, actor, and writer.'
const favicon = makeSiteSettings.icons?.icon ?? '/favicon.svg'
const socialImage = makeSiteSettings.openGraph?.image
const googleAnalyticsId = sanitizeHtmlAttribute(makeSiteSettings.analytics?.googleAnalyticsId)

/* Lets the dark design reach the screen edges on phones with notches; the
   controls themselves keep clear using safe-area insets in styles.css */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#151311',
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title,
  description,
  robots: makeSiteSettings.robots?.index === false ? { follow: false, index: false } : undefined,
  icons: favicon ? { icon: favicon } : undefined,
  openGraph: {
    title,
    description,
    images: socialImage ? [socialImage] : undefined,
  },
  twitter: socialImage
    ? {
        card: 'summary_large_image',
        images: [socialImage],
      }
    : undefined,
  other: {
    copyright: 'Kassandra Stanley Shostle. All rights reserved.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const language = sanitizeHtmlAttribute(makeSiteSettings.language) || 'en'
  const customScripts = makeSiteSettings.customScripts

  return (
    <html lang={language}>
      <head>
        {renderHeadCustomCode(customScripts?.headStart, 'head-start')}
        {/* Web fonts are linked here: the build drops @import url(...) from styles.css,
            so without these the labels and reading text fell back to system fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Inter:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Serif+JP:wght@400;600&family=Noto+Serif+KR:wght@400;600&family=Noto+Serif+SC:wght@400;600&display=swap"
        />
        {renderHeadCustomCode(customScripts?.headEnd, 'head-end')}
      </head>
      <body>
        <BodyCustomCode html={customScripts?.bodyStart} />
        <SiteParticles />
        <SmoothCursor />
        <SiteLanguage />
        <ScrollZoom />
        <a className="figma-bypass-link" href="#root">
          Skip to content
        </a>
        <div id="root" tabIndex={-1}>
          {children}
        </div>
        <LegalFooter />
        {googleAnalyticsId && <AnalyticsConsent analyticsID={googleAnalyticsId} />}
        <BodyCustomCode html={customScripts?.bodyEnd} />
      </body>
    </html>
  )
}
