import { Link } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { navLinks } from '../data/profile.js'
import { useProfile } from '../context/ProfileContext.jsx'

const currentYear = new Date().getFullYear()

export default function Footer() {
  const profile = useProfile()
  return (
    <footer className="site-footer border-t" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
      <div className="site-footer-main mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div className="footer-identity">
          <div className="flex items-center gap-3">
            <span className="wordmark-initials">{profile.initials}</span>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{profile.name}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>{profile.aboutShort}</p>
        </div>
        <div>
          <h2 className="eyebrow">Explore</h2>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:underline" style={{ color: 'var(--text-secondary)' }}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="eyebrow">Elsewhere</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {profile.socials.map((s) => (
              <li key={s.label}>
                {s.url ? (
                  <a href={s.url} className="hover:underline" style={{ color: 'var(--text-secondary)' }} target={s.url.startsWith('http') ? '_blank' : undefined} rel={s.url.startsWith('http') ? 'noreferrer' : undefined}>
                    {s.label}{s.handle ? ` · ${s.handle}` : ''}
                  </a>
                ) : (
                  <span style={{ color: 'var(--text-secondary)' }}>{s.label}{s.handle ? ` · ${s.handle}` : ''}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 text-sm sm:px-8" style={{ color: 'var(--text-secondary)' }}>
          <p>© {currentYear} {profile.name}. All rights reserved.</p>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-1 px-2 py-1 hover:underline" aria-label="Back to top">
            <ArrowUp className="h-4 w-4" />Top
          </button>
        </div>
      </div>
    </footer>
  )
}
