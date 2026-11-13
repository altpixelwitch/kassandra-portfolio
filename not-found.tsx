import PortfolioHeader from './components/PortfolioHeader'

/**
 * Custom not-found page for the frontend.
 * This renders when `notFound()` is called from any page in the (frontend) route group.
 *
 * Customize this component to match your app's design and provide helpful navigation.
 */
export default function NotFound() {
  return (
    <main className="works-page inner-page">
      <PortfolioHeader />
      <section className="works-page__intro">
        <p>404</p>
        <h1>Page Not Found</h1>
        <span>The page you&apos;re looking for doesn&apos;t exist or has been moved.</span>
      </section>
    </main>
  )
}
