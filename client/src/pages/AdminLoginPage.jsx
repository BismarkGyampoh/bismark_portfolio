import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, KeyRound, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center" style={{ color: 'var(--text-secondary)' }}>Loading session…</div>
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to sign in.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-login-page">
      <section className="admin-login-visual" aria-label="Portfolio owner">
        <Link to="/" className="admin-login-back"><ArrowLeft size={16} /> Back to portfolio</Link>
        <div className="admin-login-visual-content">
          <div className="admin-login-monogram" aria-hidden="true">BG</div>
          <p className="admin-login-kicker">The workspace behind the work</p>
          <h1 className="display-type">A considered space<br />for what comes next.</h1>
          <p className="admin-login-caption">Projects, ideas, and the details that bring them together.</p>
        </div>
        <div className="admin-login-visual-footer">
          <span>PORTFOLIO · GHANA</span>
          <span>EST. 2025</span>
        </div>
      </section>

      <section className="admin-login-panel">
        <div className="admin-login-form-wrap">
          <Link to="/" className="admin-login-mobile-back"><ArrowLeft size={16} /> Portfolio</Link>
          <div className="admin-login-heading">
            <span className="admin-login-icon"><KeyRound size={19} /></span>
            <p className="admin-login-eyebrow">Admin workspace</p>
            <h2 className="display-type">Welcome back.</h2>
            <p>Sign in to manage your portfolio and published content.</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
            {location.state?.notice ? (
              <p role="status" className="admin-login-notice">{location.state.notice}</p>
            ) : null}

            <div className="admin-login-field">
              <label htmlFor="email">Email address</label>
              <div className="admin-login-input-wrap">
                <Mail size={17} aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="username"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="admin-login-field">
              <div className="admin-login-label-row">
                <label htmlFor="password">Password</label>
              </div>
              <div className="admin-login-input-wrap">
                <LockKeyhole size={17} aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="admin-login-password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error ? <p role="alert" className="admin-login-error">{error}</p> : null}

            <Button type="submit" variant="primary" className="admin-login-submit" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in to dashboard'}
              {!submitting ? <ArrowLeft className="admin-login-submit-arrow" size={17} /> : null}
            </Button>
          </form>

          <div className="admin-login-security">
            <ShieldCheck size={17} aria-hidden="true" />
            <span>Secure, private access to your portfolio workspace.</span>
          </div>
        </div>
        <p className="admin-login-copyright">© 2026 Bismark Gyampoh</p>
      </section>
    </div>
  )
}
