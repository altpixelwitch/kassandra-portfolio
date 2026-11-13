import type { Metadata } from 'next'
import LegalPagePresentation from '../components/LegalPagePresentation'

export const metadata: Metadata = {
  title: 'Copyright | Kassandra Stanley Shostle',
  description: 'Copyright, intellectual-property, and AI-use information for this portfolio.',
}

export default async function CopyrightPage() {
  return <LegalPagePresentation pageType="copyright" />
}
