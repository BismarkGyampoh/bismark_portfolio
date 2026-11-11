import { useEffect, useState } from 'react'
import { Button, Card, SectionHeading } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { requestJson } from '../services/api.js'
import { profile as defaultProfile } from '../data/profile.js'

function toForm(profile) {
  return {
    ...profile,
    aboutLong: profile.aboutLong.join('\n'),
    interests: profile.interests.join('\n'),
    socials: profile.socials.map((social) => `${social.label} | ${social.url || ''} | ${social.handle || ''}`).join('\n'),
  }
}

function fromForm(form) {
  return {
    ...form,
    aboutLong: form.aboutLong.split('\n').map((item) => item.trim()).filter(Boolean),
    interests: form.interests.split('\n').map((item) => item.trim()).filter(Boolean),
    socials: form.socials.split('\n').map((line) => {
      const [label = '', url = '', handle = ''] = line.split('|').map((item) => item.trim())
      return { label, url, handle }
    }).filter((social) => social.label),
  }
}

const fields = [
  ['name', 'Name'],
  ['title', 'Professional title'],
  ['headline', 'Headline'],
  ['introduction', 'Introduction'],
  ['aboutShort', 'Short about text'],
  ['aboutLong', 'About paragraphs (one per line)'],
  ['interests', 'Areas of interest (one per line)'],
  ['philosophy', 'Working philosophy'],
  ['location', 'Location'],
  ['email', 'Public email'],
  ['whatsapp', 'WhatsApp number'],
  ['whatsappUrl', 'WhatsApp link'],
  ['imagePath', 'Portrait image path or URL'],
  ['cvPath', 'Résumé file path or URL'],
  ['socials', 'Social links (one per line: label | URL | handle)'],
]

export function DashboardProfile() {
  const { isAuthenticated } = useAuth()
  const [form, setForm] = useState(() => toForm(defaultProfile))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return undefined

    let active = true
    async function loadProfile() {
      try {
        const result = await requestJson('/profile')
        if (active && result?.data) setForm(toForm(result.data))
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load public profile.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProfile()
    return () => { active = false }
  }, [isAuthenticated])

  const submitProfile = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
    setSaving(true)

    try {
      const result = await requestJson('/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fromForm(form)),
      })
      if (result?.data) setForm(toForm(result.data))
      setNotice('Public profile saved. It will appear on the site when the page is refreshed.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save public profile.')
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated) return null

  return (
    <main>
      <SectionHeading eyebrow="Profile" title="Public profile" description="Edit the identity, introduction, contact details, and social links shown across the public portfolio." />
      <Card className="p-5 sm:p-6">
        {loading ? <p style={{ color: 'var(--text-secondary)' }}>Loading profile…</p> : (
          <form onSubmit={submitProfile} className="grid gap-4">
            {fields.map(([name, label]) => {
              const textarea = ['introduction', 'aboutShort', 'aboutLong', 'interests', 'philosophy', 'socials'].includes(name)
              const Component = textarea ? 'textarea' : 'input'
              return (
                <label key={name} className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {label}
                  <Component
                    name={name}
                    type={name === 'email' ? 'email' : 'text'}
                    value={form[name] || ''}
                    onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))}
                    rows={['aboutLong', 'interests', 'socials'].includes(name) ? 5 : textarea ? 3 : undefined}
                    required={!['aboutLong', 'interests', 'socials'].includes(name)}
                    className="w-full border px-3 py-2.5 text-sm"
                    style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                  />
                </label>
              )
            })}
            {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
            {notice ? <p role="status" className="text-sm text-green-700">{notice}</p> : null}
            <div><Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving…' : 'Save public profile'}</Button></div>
          </form>
        )}
      </Card>
    </main>
  )
}
