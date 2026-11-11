import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Download } from 'lucide-react'
import { navLinks } from '../data/profile.js'
import { useProfile } from '../context/ProfileContext.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { Button } from './ui.jsx'

function navClass({ isActive }) {
  return `site-nav-link text-sm transition-colors ${isActive ? 'is-active' : ''}`
}

export default function Navbar() {
  const profile = useProfile()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className="site-header sticky top-0 z-40 border-b"
      style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
    >
      <div className="site-header-inner mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link to="/" className="site-wordmark flex items-center gap-3" aria-label={`${profile.name} home`} onClick={() => setOpen(false)}>
          <span className="wordmark-initials">{profile.initials}</span>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{profile.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} className={navClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          {profile.cvAvailable ? (
            <Button as="a" href={profile.cvPath} download variant="primary"><Download className="h-4 w-4" aria-hidden />Download CV</Button>
          ) : null}
        </div>

        <button
          type="button"
          className="site-menu-button inline-flex border p-2 lg:hidden"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)', background: 'var(--bg-secondary)' }}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div id="mobile-nav" className="site-mobile-nav border-t lg:hidden" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)' }}>
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4 sm:px-8" aria-label="Mobile">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `mobile-nav-link px-3 py-2 text-sm ${isActive ? 'is-active' : ''}`}
                style={{ color: 'var(--text-primary)' }}
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex items-center gap-2 px-1">
              <ThemeToggle />
              {profile.cvAvailable ? (
                <Button as="a" href={profile.cvPath} download="Bismark-Gyampoh-Resume.pdf" variant="primary" className="flex-1">
                  <Download className="h-4 w-4" aria-hidden />
                  Download CV
                </Button>
              ) : null}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
