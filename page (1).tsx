import type { Metadata } from 'next'
import LegalPagePresentation from '../components/LegalPagePresentation'

export const metadata: Metadata = {
  title: 'Accessibility | Kassandra Stanley Shostle',
  description: 'Accessibility information for this filmmaker portfolio.',
}

export default async function AccessibilityPage() {
  return <LegalPagePresentation pageType="accessibility" />
}
