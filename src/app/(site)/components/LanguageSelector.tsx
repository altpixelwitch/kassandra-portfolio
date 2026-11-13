'use client'

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import {
  applyLanguage,
  getLanguage,
  getSavedLanguage,
  languages,
  onLanguageChange,
  type LanguageCode,
} from '../i18n/pageTranslator'
import LanguageFlag from './LanguageFlag'

/* The flag button: picks the language for the whole site using the built-in
   translations in i18n/. Kassandra's name and film titles stay as written. */

export default function LanguageSelector({ fixed = false }: { fixed?: boolean }) {
  const [language, setLanguage] = useState<LanguageCode>('en')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const selected = languages.find((item) => item.code === language) ?? languages[0]

  useEffect(() => {
    // Show the flag for the language already in use (SiteLanguage applies it to the page)
    const active = getLanguage()
    setLanguage(active !== 'en' ? active : getSavedLanguage())
    return onLanguageChange(setLanguage)
  }, [])

  useEffect(() => {
    if (!open) return

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsidePress)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  /* Opening the list moves focus to the language in use; closing it with the
     keyboard returns focus to the button */
  const wasOpen = useRef(false)
  useEffect(() => {
    if (open) {
      const items = menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')
      const current = menuRef.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')
      ;(current ?? items?.[0])?.focus()
    } else if (
      wasOpen.current &&
      (containerRef.current?.contains(document.activeElement) ||
        document.activeElement === document.body)
    ) {
      buttonRef.current?.focus()
    }
    wasOpen.current = open
  }, [open])

  /* Up and down arrows move through the languages; Home and End jump to the
     first and last; Tab leaves the list and closes it */
  const onMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? [],
    )
    const index = items.indexOf(document.activeElement as HTMLButtonElement)
    const move = (next: number) => {
      event.preventDefault()
      items[(next + items.length) % items.length]?.focus()
    }
    if (event.key === 'ArrowDown') move(index + 1)
    else if (event.key === 'ArrowUp') move(index - 1)
    else if (event.key === 'Home') move(0)
    else if (event.key === 'End') move(items.length - 1)
    else if (event.key === 'Tab') setOpen(false)
  }

  const chooseLanguage = (nextLanguage: LanguageCode) => {
    setLanguage(nextLanguage)
    setOpen(false)
    void applyLanguage(nextLanguage)
  }

  return (
    <div
      className={
        fixed
          ? // Level with the menu button on the right, on phones too (it moves to 14px there)
            'notranslate fixed top-[max(clamp(18px,2.8vw,42px),env(safe-area-inset-top,0px))] left-[max(clamp(18px,2.8vw,42px),env(safe-area-inset-left,0px))] z-[61] max-[640px]:top-[max(14px,env(safe-area-inset-top,0px))] max-[640px]:left-[max(14px,env(safe-area-inset-left,0px))]'
          : 'notranslate relative z-[61] shrink-0'
      }
      data-no-translate
      ref={containerRef}
      translate="no"
    >
      <button
        ref={buttonRef}
        aria-controls="language-menu"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Change language. Current language: ${selected.name}`}
        className={`language-selector__button grid place-items-center rounded-xl border text-lg leading-none shadow-[0_8px_30px_rgb(0_0_0_/_25%)] backdrop-blur-md transition-colors ${
          fixed ? 'size-[46px]' : 'size-10'
        }`}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <LanguageFlag className="language-selector__flag" code={language} />
      </button>

      {open && (
        <div
          aria-label="Select website language"
          id="language-menu"
          onKeyDown={onMenuKeyDown}
          ref={menuRef}
          className={`absolute top-[calc(100%+8px)] max-h-[calc(100dvh-96px)] w-44 overflow-y-auto overscroll-contain rounded-2xl border border-[var(--line)] bg-[rgb(21_19_17_/_97%)] p-1.5 language-selector__menu shadow-[0_22px_70px_rgb(0_0_0_/_55%)] backdrop-blur-xl ${
            fixed ? 'left-0' : 'right-0'
          }`}
          role="menu"
        >
          {languages.map((item) => (
            <button
              aria-checked={item.code === language}
              className="flex min-h-10 w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-[var(--bone)] transition-colors hover:bg-[var(--oxblood)] focus-visible:bg-[var(--oxblood)]"
              key={item.code}
              lang={item.code}
              onClick={() => chooseLanguage(item.code)}
              role="menuitemradio"
              tabIndex={item.code === language ? 0 : -1}
              type="button"
            >
              <LanguageFlag className="language-selector__item-flag" code={item.code} />
              <span>{item.name}</span>
              {item.code === language && (
                <span aria-hidden="true" className="ml-auto text-[var(--emerald-bright)]">
                  ·
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
