import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { ProfileProvider } from '../context/ProfileContext.jsx'

export default function PublicLayout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  return (
    <ProfileProvider>
      <div className="public-site min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--accent-primary)] focus:px-3 focus:py-2 focus:text-white">Skip to content</a>
        <Navbar />
        <main id="main"><Outlet /></main>
        <Footer />
      </div>
    </ProfileProvider>
  )
}
