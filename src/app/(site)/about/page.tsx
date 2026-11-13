import type { Metadata } from 'next'
import BiographyPresentation from '../components/BiographyPresentation'
import PortfolioHeader from '../components/PortfolioHeader'
import { getBiography } from '@/lib/content'

export const metadata: Metadata = {
  title: 'About | Kassandra Stanley Shostle',
  description:
    'About Kassandra Stanley Shostle, British filmmaker, screenwriter, actor, poet, and model.',
}

export default async function AboutPage() {
  const biography = await getBiography()

  return (
    <main className="works-page inner-page">
      <PortfolioHeader />
      <BiographyPresentation biography={biography} />
    </main>
  )
}
