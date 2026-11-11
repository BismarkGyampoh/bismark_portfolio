import { useState } from 'react'
import { getTheme, toggleTheme } from '../utils/theme.js'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle({ className = '' } = {}) {
  const [theme, setThemeState] = useState(getTheme)

  function handleToggle() {
    const next = toggleTheme()
    setThemeState(next)
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`portfolio-button inline-flex items-center gap-2 border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] ${className}`}
      style={{
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)',
        background: 'var(--bg-secondary)',
        boxShadow: 'none',
      }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  )
}
