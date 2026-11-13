import type { Metadata } from 'next'
import LegalPagePresentation from '../components/LegalPagePresentation'

export const metadata: Metadata = {
  title: 'Terms | Kassandra Stanley Shostle',
  description: 'Terms of use for this filmmaker portfolio.',
}

export default async function TermsPage() {
  return <LegalPagePresentation pageType="terms" />
}
