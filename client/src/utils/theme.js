const THEME_KEY = 'theme'

function getPreferredTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // ignore storage errors
  }
  // Default to light mode for first-time visitors
  return 'light'
}

export function getTheme() {
  if (typeof document === 'undefined') return getPreferredTheme()
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function setTheme(theme) {
  const next = theme === 'dark' ? 'dark' : 'light'
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = next
    if (next === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  try {
    localStorage.setItem(THEME_KEY, next)
  } catch {
    // ignore storage errors
  }
  return next
}

export function toggleTheme() {
  const current = getTheme()
  return setTheme(current === 'dark' ? 'light' : 'dark')
}

export function initTheme() {
  const theme = getPreferredTheme()
  setTheme(theme)
}
