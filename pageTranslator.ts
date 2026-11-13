import type { TranslatedLanguage } from './translations'

/* Built-in page translation. The site is written in English; choosing another
   language swaps every piece of visible text (and labels read out by screen
   readers) for its translation from translations.ts. Anything marked
   `notranslate` or translate="no" stays as written, which keeps Kassandra's name
   and film titles in their original form. Text with no translation yet simply
   stays in English. Nothing is sent to any outside service. */

export const languages = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano' },
  { code: 'ja', flag: '🇯🇵', name: '日本語' },
  { code: 'ko', flag: '🇰🇷', name: '한국어' },
  { code: 'zh-CN', flag: '🇨🇳', name: '中文' },
] as const

export type LanguageCode = (typeof languages)[number]['code']

const storageKey = 'kassandra-language'
const ATTRIBUTES = ['aria-label', 'placeholder', 'alt', 'title'] as const
const KEEP = 'script, style, noscript, textarea, code, pre, .notranslate, [translate="no"], [contenteditable="true"]'

type Record_ = { en: string; shown: string }

let current: LanguageCode = 'en'
let table: Record<string, string> = {}
let requested: LanguageCode = 'en'
let observer: MutationObserver | null = null
const texts = new WeakMap<Text, Record_>()
const attributes = new WeakMap<Element, Partial<Record<(typeof ATTRIBUTES)[number], Record_>>>()
let titleRecord: Record_ | null = null
const listeners = new Set<(language: LanguageCode) => void>()

export function isLanguageCode(value: unknown): value is LanguageCode {
  return languages.some((language) => language.code === value)
}

export function getLanguage() {
  return current
}

export function getSavedLanguage(): LanguageCode {
  try {
    const saved = window.localStorage.getItem(storageKey)
    return isLanguageCode(saved) ? saved : 'en'
  } catch {
    return 'en'
  }
}

export function onLanguageChange(listener: (language: LanguageCode) => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function lookup(english: string): string {
  if (current === 'en') return english
  const key = english.replace(/\s+/g, ' ').trim()
  if (!key) return english
  const translated = table[key]
  if (!translated) return english
  const lead = english.match(/^\s*/)?.[0] ?? ''
  const trail = english.match(/\s*$/)?.[0] ?? ''
  return lead + translated + trail
}

/* Work out the English behind what is shown now: if the page still shows what we
   last put there, the English is what we saved; otherwise the site has just
   written new English text, so that becomes the original. */
function settle(record: Record_ | undefined, value: string): Record_ {
  if (record && value === record.shown) return record
  return { en: value, shown: value }
}

function translateText(node: Text) {
  const parent = node.parentElement
  if (!parent || parent.closest(KEEP)) return
  const value = node.nodeValue ?? ''
  if (!/\p{L}/u.test(value) && !texts.has(node)) return
  const record = settle(texts.get(node), value)
  record.shown = lookup(record.en)
  texts.set(node, record)
  if (node.nodeValue !== record.shown) node.nodeValue = record.shown
}

function translateAttributes(element: Element) {
  if (element.closest(KEEP)) return
  let saved = attributes.get(element)
  for (const name of ATTRIBUTES) {
    const value = element.getAttribute(name)
    if (value === null) continue
    if (!saved) {
      saved = {}
      attributes.set(element, saved)
    }
    const record = settle(saved[name], value)
    record.shown = lookup(record.en)
    saved[name] = record
    if (value !== record.shown) element.setAttribute(name, record.shown)
  }
}

function translateTree(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateText(root as Text)
    return
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return
  const element = root as Element
  translateAttributes(element)
  element.querySelectorAll('[aria-label], [placeholder], [alt], [title]').forEach(translateAttributes)
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  let node: Node | null
  while ((node = walker.nextNode())) translateText(node as Text)
}

function translateTitle() {
  const value = document.title
  titleRecord = settle(titleRecord ?? undefined, value)
  titleRecord.shown = titleRecord.en
    .split(' | ')
    .map((part) => lookup(part))
    .join(' | ')
  if (document.title !== titleRecord.shown) document.title = titleRecord.shown
}

function watch() {
  if (observer) return
  observer = new MutationObserver((mutations) => {
    let titleChanged = false
    for (const mutation of mutations) {
      if (mutation.target.parentNode && (mutation.target as Node).parentElement?.closest('title')) {
        titleChanged = true
        continue
      }
      if ((mutation.target as Element).nodeName === 'TITLE') {
        titleChanged = true
        continue
      }
      if (mutation.type === 'characterData') translateText(mutation.target as Text)
      else if (mutation.type === 'attributes') translateAttributes(mutation.target as Element)
      else mutation.addedNodes.forEach(translateTree)
    }
    if (titleChanged) translateTitle()
  })
  observer.observe(document.documentElement, {
    attributeFilter: [...ATTRIBUTES],
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  })
}

function clearOldGoogleCookie() {
  try {
    const host = window.location.hostname
    for (const domain of ['', `; domain=${host}`, `; domain=.${host}`]) {
      document.cookie = `googtrans=; path=/; max-age=0${domain}`
    }
  } catch {
    // Nothing to clear when cookies are blocked.
  }
}

/* The translations only download when a visitor picks a language other than English */
async function loadTable(language: LanguageCode): Promise<Record<string, string>> {
  if (language === 'en') return {}
  const { translations } = await import('./translations')
  return translations[language as TranslatedLanguage] ?? {}
}

export async function applyLanguage(language: LanguageCode, { save = true } = {}) {
  requested = language
  const next = await loadTable(language)
  if (requested !== language) return
  table = next
  current = language
  if (save) {
    try {
      window.localStorage.setItem(storageKey, language)
    } catch {
      // The choice still applies to this visit when storage is blocked.
    }
  }
  clearOldGoogleCookie()
  document.documentElement.lang = language
  translateTree(document.body)
  translateTitle()
  if (language === 'en') {
    observer?.disconnect()
    observer = null
  } else {
    watch()
  }
  listeners.forEach((listener) => listener(language))
}
