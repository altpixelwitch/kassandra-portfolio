import type { Metadata } from 'next'
import LegalPagePresentation from '../components/LegalPagePresentation'

export const metadata: Metadata = {
  title: 'Privacy | Kassandra Stanley Shostle',
  description: 'Privacy information for this filmmaker portfolio website.',
}

export default async function PrivacyPage() {
  return <LegalPagePresentation pageType="privacy" />
}
