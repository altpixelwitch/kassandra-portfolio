import { unstable_cache } from 'next/cache'
import type { LegalPage } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'

export type LegalPageType = 'accessibility' | 'cookies' | 'copyright' | 'privacy' | 'terms'

export interface LegalPageCopy {
  introduction: string
  sections: Array<{ body: string; heading: string }>
  title: string
}

export const legalFallbacks: Record<LegalPageType, LegalPageCopy> = {
  privacy: {
    title: 'Privacy',
    introduction:
      'This notice describes the limited personal information used by this portfolio. It is a technical summary, not legal advice.',
    sections: [
      {
        heading: 'Information this website uses',
        body: 'This portfolio displays public films, photographs, news, awards, biography information, and professional contact details selected by Kassandra. The private administration area is restricted to authorised editors.',
      },
      {
        heading: 'Contact messages',
        body: 'If the contact form is enabled and you submit it, your name, email address, message, submission time, and limited technical information used for abuse prevention are stored so Kassandra can read and respond to your enquiry. Do not include sensitive information you do not want to share. Messages are marked with a review date but are not automatically deleted.',
      },
      {
        heading: 'Cookies and analytics',
        body: 'The administration area uses essential authentication technology. Optional analytics loads only after an explicit acceptance, if analytics has been configured.',
      },
      {
        heading: 'Third-party services',
        body: 'Public links may take you to Instagram, Vimeo, YouTube, IMDb, Letterboxd, Stage 32, or X. Those services process information under their own terms. Translations are built into this website, so choosing another language does not send page text to any outside service. Some portfolio photography may be delivered by Unsplash.',
      },
      {
        heading: 'Your choices',
        body: 'You may ask for access to, correction of, or deletion of personal information submitted through the contact form. Appropriate identity checks may be required. Contact details for privacy requests will be published when configured.',
      },
      {
        heading: 'Legal review',
        body: 'Retention periods, lawful bases, international transfers, and jurisdiction-specific obligations require confirmation by a qualified privacy professional before launch.',
      },
    ],
  },
  cookies: {
    title: 'Cookies',
    introduction:
      'This page explains the browser storage and similar technology currently used by the portfolio.',
    sections: [
      {
        heading: 'Public portfolio',
        body: 'The public portfolio does not require optional analytics. If analytics is configured, it is not loaded until you select “Accept analytics.” Analytics and language choices are saved in local browser storage.',
      },
      {
        heading: 'Language translation',
        body: 'Translations are built into this website, so no page text is sent to an outside translation service. If you select another language, that choice is saved in local browser storage so it can be remembered on your next visit.',
      },
      {
        heading: 'Administration',
        body: 'The private administration area may use essential session technology to keep authorised editors signed in and protect content. This technology is not used for advertising.',
      },
      {
        heading: 'Third-party destinations',
        body: 'Following an external link or playing third-party media may allow that provider to use its own storage or cookies under its own policy.',
      },
      {
        heading: 'Review required',
        body: 'Cookie and ePrivacy requirements vary by visitor location and the services actually enabled. A qualified professional should review this notice before launch and whenever integrations change.',
      },
    ],
  },
  terms: {
    title: 'Terms of use',
    introduction:
      'These cautious website terms describe permitted use of the portfolio and require professional legal review.',
    sections: [
      {
        heading: 'Portfolio use',
        body: 'You may browse this website for personal, informational, and legitimate professional-enquiry purposes. Do not attempt to disrupt the website, bypass access controls, or misuse its contact features.',
      },
      {
        heading: 'No licence',
        body: 'Access to this website does not transfer ownership or grant a licence to reproduce, distribute, adapt, train systems on, or commercially exploit films, writing, photographs, designs, or other portfolio materials.',
      },
      {
        heading: 'External services',
        body: 'Links and embedded services are provided for convenience. Their availability, content, security, and terms are controlled by their operators.',
      },
      {
        heading: 'No professional advice',
        body: 'Portfolio content is provided for general information and is not legal, financial, or other professional advice. Appropriate jurisdiction-specific terms and limitations require qualified legal review.',
      },
    ],
  },
  copyright: {
    title: 'Copyright & intellectual property',
    introduction:
      'Unless a specific credit says otherwise, the original portfolio content and presentation are reserved to their respective rights holders.',
    sections: [
      {
        heading: 'Rights reserved',
        body: 'Films, scripts, writing, performances, photographs, graphics, audio, branding, and site presentation may be protected by copyright, trade mark, publicity, contractual, and other rights. No permission is implied by online availability.',
      },
      {
        heading: 'AI and text-and-data mining',
        body: 'No permission is granted to use portfolio content for machine-learning training, generative AI datasets, automated text-and-data mining, biometric analysis, synthetic media, or model evaluation. Technical rights-reservation signals are also sent, but they cannot prevent copying or guarantee enforcement.',
      },
      {
        heading: 'Requests and credits',
        body: 'For licensing, press, festival, educational, or correction requests, use the published professional contact route and identify the exact material and intended use. Third-party materials remain the property of their credited owners.',
      },
      {
        heading: 'Legal review',
        body: 'Ownership, registrations, takedown procedures, moral rights, performer rights, and jurisdiction-specific remedies should be confirmed by a qualified intellectual-property professional.',
      },
    ],
  },
  accessibility: {
    title: 'Accessibility',
    introduction:
      'The aim is to make this portfolio usable across common browsers, screen sizes, keyboard input, and assistive technology.',
    sections: [
      {
        heading: 'Current approach',
        body: 'The site uses semantic headings, keyboard focus indicators, text alternatives where content provides them, and responsive layouts. Motion and media experiences may still present barriers for some visitors.',
      },
      {
        heading: 'Feedback',
        body: 'If you encounter an accessibility barrier, use the professional contact route and describe the page, device, browser, and assistance needed. A reasonable alternative format will be considered where possible.',
      },
      {
        heading: 'Ongoing review',
        body: 'This statement is not a certification of conformance. Formal testing against applicable WCAG and disability-access requirements, including ADA and UK/EU obligations, requires specialist review.',
      },
    ],
  },
}

export function getPublishedLegalPage(pageType: LegalPageType): Promise<LegalPage | null> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'legal-pages',
        depth: 0,
        draft: false,
        limit: 1,
        overrideAccess: false,
        where: { pageType: { equals: pageType } },
      })
      return result.docs[0] ?? null
    },
    ['published-legal-page-v1', pageType],
    { tags: [`legal:${pageType}`] },
  )()
}
