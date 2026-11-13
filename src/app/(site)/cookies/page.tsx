import type { Metadata } from 'next'
import LegalPagePresentation from '../components/LegalPagePresentation'

export const metadata: Metadata = {
  title: 'Cookies | Kassandra Stanley Shostle',
  description: 'Cookie and browser-storage information for this filmmaker portfolio.',
}

export default async function CookiesPage() {
  return <LegalPagePresentation pageType="cookies" />
}
