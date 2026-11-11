import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, SectionHeading } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { requestJson } from '../services/api.js'
import { profile as defaultProfile } from '../data/profile.js'

export function DashboardSettings() {
  const navigate = useNavigate()
  const { isAuthenticated, clearSession } = useAuth()
  const [siteProfile, setSiteProfile] = useState(null)
  const [identity, setIdentity] = useState({ name: '', title: '', headline: '', email: '' })
  const [loadingIdentity, setLoadingIdentity] = useState(true)
  const [savingIdentity, setSavingIdentity] = useState(false)
  const [identityError, setIdentityError] = useState('')
  const [identityNotice, setIdentityNotice] = useState('')
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return undefined

    let active = true
    async function loadIdentity() {
      try {
        const result = await requestJson('/profile')
        if (active && result?.data) {
          setSiteProfile(result.data)
          setIdentity({
            name: result.data.name,
            title: result.data.title,
            headline: result.data.headline,
            email: result.data.email,
          })
          setIdentityError('')
        }
      } catch (error) {
        if (!active) return
        if (error instanceof Error && error.message === 'Profile content has not been configured.') {
          setSiteProfile(defaultProfile)
          setIdentity({
            name: defaultProfile.name,
            title: defaultProfile.title,
            headline: defaultProfile.headline,
            email: defaultProfile.email,
          })
          setIdentityError('')
        } else {
          setIdentityError(error instanceof Error ? error.message : 'Unable to load site identity.')
        }
      } finally {
        if (active) setLoadingIdentity(false)
      }
    }

    loadIdentity()
    return () => { active = false }
  }, [isAuthenticated])

  if (!isAuthenticated) return null

  const handleIdentityChange = async (event) => {
    event.preventDefault()
    if (!siteProfile) return
    setIdentityError('')
    setIdentityNotice('')
    setSavingIdentity(true)

    try {
      const result = await requestJson('/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...siteProfile, ...identity }),
      })
      if (!result?.data) throw new Error('The site identity could not be saved.')
      setSiteProfile(result.data)
      setIdentity({
        name: result.data.name,
        title: result.data.title,
        headline: result.data.headline,
        email: result.data.email,
      })
      setIdentityNotice('Site identity saved. Refresh the public site to see the updated browser title.')
    } catch (error) {
      setIdentityError(error instanceof Error ? error.message : 'Unable to save site identity.')
    } finally {
      setSavingIdentity(false)
    }
  }

  const handlePasswordChange = async (event) => {
    event.preventDefault()
    setPasswordError('')

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('The new passwords do not match.')
      return
    }
    if (passwords.newPassword.length < 12) {
      setPasswordError('Use at least 12 characters for your new password.')
      return
    }
    if (passwords.newPassword === passwords.currentPassword) {
      setPasswordError('Your new password must be different from your current password.')
      return
    }

    setSavingPassword(true)
    try {
      const result = await requestJson('/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      })

      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      clearSession()
      navigate('/admin/login', {
        replace: true,
        state: { notice: result?.data?.message || 'Password changed. Please sign in again.' },
      })
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Unable to change password.')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <main>
      <SectionHeading eyebrow="Settings" title="Portfolio settings" description="Manage general site preferences for the personal portfolio admin area." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--accent-primary)' }}>Site identity</p>
          <p className="mt-2 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>Manage the name and public-facing details shown across your portfolio.</p>
          {loadingIdentity ? <p className="mt-5 text-sm" style={{ color: 'var(--text-secondary)' }}>Loading site identity…</p> : (
            <form onSubmit={handleIdentityChange} className="mt-5 grid gap-4">
              <IdentityField
                label="Site name"
                name="name"
                value={identity.name}
                onChange={(event) => setIdentity((current) => ({ ...current, name: event.target.value }))}
                required
              />
              <IdentityField
                label="Professional title"
                name="title"
                value={identity.title}
                onChange={(event) => setIdentity((current) => ({ ...current, title: event.target.value }))}
                required
              />
              <IdentityField
                label="Headline"
                name="headline"
                value={identity.headline}
                onChange={(event) => setIdentity((current) => ({ ...current, headline: event.target.value }))}
                required
              />
              <IdentityField
                label="Public contact email"
                name="email"
                type="email"
                value={identity.email}
                onChange={(event) => setIdentity((current) => ({ ...current, email: event.target.value }))}
                required
              />
              {identityError ? <p role="alert" className="text-sm text-red-700">{identityError}</p> : null}
              {identityNotice ? <p role="status" className="text-sm text-green-700">{identityNotice}</p> : null}
              <div>
                <Button type="submit" variant="primary" disabled={savingIdentity || !siteProfile}>
                  {savingIdentity ? 'Saving…' : 'Save site identity'}
                </Button>
              </div>
            </form>
          )}
        </Card>

        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--accent-primary)' }}>Security</p>
          <h2 className="mt-3 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Change password</h2>
          <p className="mt-2 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>Enter your current password and choose a new one. Changing your password signs out all active sessions.</p>
          <form onSubmit={handlePasswordChange} className="mt-5 grid gap-4">
            <PasswordField
              label="Current password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={(event) => setPasswords((current) => ({ ...current, currentPassword: event.target.value }))}
              autoComplete="current-password"
              required
            />
            <PasswordField
              label="New password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={(event) => setPasswords((current) => ({ ...current, newPassword: event.target.value }))}
              autoComplete="new-password"
              minLength={12}
              required
            />
            <PasswordField
              label="Confirm new password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={(event) => setPasswords((current) => ({ ...current, confirmPassword: event.target.value }))}
              autoComplete="new-password"
              minLength={12}
              required
            />
            {passwordError ? <p role="alert" className="text-sm text-red-700">{passwordError}</p> : null}
            <div>
              <Button type="submit" variant="primary" disabled={savingPassword}>
                {savingPassword ? 'Updating…' : 'Update password'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  )
}

function IdentityField({ label, name, ...props }) {
  return (
    <label htmlFor={`settings-${name}`} className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
      {label}
      <input
        id={`settings-${name}`}
        name={name}
        type="text"
        className="w-full border px-3 py-2.5 text-sm"
        style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
        {...props}
      />
    </label>
  )
}

function PasswordField({ label, name, ...props }) {
  return (
    <label htmlFor={`settings-${name}`} className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
      {label}
      <input
        id={`settings-${name}`}
        name={name}
        type="password"
        className="w-full border px-3 py-2.5 text-sm"
        style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
        {...props}
      />
    </label>
  )
}
