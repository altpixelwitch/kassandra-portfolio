'use client'

import { useEffect } from 'react'
import { applyLanguage, getSavedLanguage } from '../i18n/pageTranslator'

/* Puts the visitor's chosen language back on every page, including pages
   without a flag button such as the not-found page. */
export default function SiteLanguage() {
  useEffect(() => {
    const saved = getSavedLanguage()
    if (saved === 'en') return
    // wait a frame so the page has finished loading before its words change
    const frame = window.requestAnimationFrame(() => void applyLanguage(saved, { save: false }))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  return null
}
