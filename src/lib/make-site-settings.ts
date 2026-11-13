export type MakeSiteSettings = {
  title?: string
  description?: string
  language?: string
  robots?: { index?: boolean }
  icons?: { icon?: string }
  openGraph?: { image?: string }
  analytics?: { googleAnalyticsId?: string }
  customScripts?: {
    headStart?: string
    headEnd?: string
    bodyStart?: string
    bodyEnd?: string
  }
  accessibility?: { addBypassLinks?: boolean }
}

// Figma Make's site.json is platform-owned. Standalone deployments use the
// portfolio defaults in layout.tsx and may set analytics through the CMS.
export const makeSiteSettings: MakeSiteSettings = {}

export function sanitizeHtmlAttribute(value: string | undefined): string {
  return value?.replace(/[^a-zA-Z0-9_-]/g, '') || ''
}
