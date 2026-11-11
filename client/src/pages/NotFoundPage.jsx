import { Link } from 'react-router-dom'
import { Container } from '../components/ui.jsx'

export default function NotFoundPage() {
  return (
    <div className="py-20 sm:py-28">
      <Container className="max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--accent-primary)' }}>404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: 'var(--text-primary)' }}>Page not found</h1>
        <p className="mt-4 leading-7" style={{ color: 'var(--text-secondary)' }}>The page you requested does not exist or may have moved.</p>
        <Link to="/" className="mt-8 inline-flex rounded-lg px-4 py-2.5 text-sm font-medium text-white" style={{ background: 'var(--accent-primary)' }}>Go to homepage</Link>
      </Container>
    </div>
  )
}
