import type { Metadata } from 'next'
import PortfolioHeader from '../components/PortfolioHeader'
import ContactPresentation from './ContactPresentation'
import { getContactSettings } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Contact | Kassandra Stanley Shostle',
  description: 'Professional contact and enquiries for Kassandra Stanley Shostle.',
}

export default async function ContactPage() {
  const settings = await getContactSettings()

  return (
    <main className="works-page inner-page">
      <PortfolioHeader />
      <section className="works-page__intro">
        <p>Enquiries</p>
        <h1>Contact</h1>
        <span>Film · Writing · Performance · Collaboration</span>
      </section>
      <ContactPresentation settings={settings} />
    </main>
  )
}
