'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

const storageKey = 'kassandra-analytics-consent'

export default function AnalyticsConsent({ analyticsID }: { analyticsID: string }) {
  const [choice, setChoice] = useState<'accepted' | 'declined' | null>(null)

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey)
    if (saved === 'accepted' || saved === 'declined') setChoice(saved)
  }, [])

  const saveChoice = (value: 'accepted' | 'declined') => {
    window.localStorage.setItem(storageKey, value)
    setChoice(value)
  }

  return (
    <>
      {choice === 'accepted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsID}`}
            strategy="afterInteractive"
          />
          <Script id="figma-google-analytics" strategy="afterInteractive">
            {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(analyticsID)}, { anonymize_ip: true });
`}
          </Script>
        </>
      )}
      {choice === null && (
        <aside
          aria-label="Optional analytics choice"
          aria-live="polite"
          className="analytics-consent"
        >
          <p>
            May this website use optional analytics to understand general visits? Choosing decline
            does not affect the website.
          </p>
          <div>
            <button onClick={() => saveChoice('declined')} type="button">
              Decline
            </button>
            <button onClick={() => saveChoice('accepted')} type="button">
              Accept analytics
            </button>
          </div>
        </aside>
      )}
    </>
  )
}
