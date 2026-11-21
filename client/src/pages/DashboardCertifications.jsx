import { useEffect, useState } from 'react'
import { Button, Card, Container, SectionHeading } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { requestJson } from '../services/api.js'

const blankForm = {
  name: '',
  issuer: '',
  credentialId: '',
  credentialUrl: '',
  description: '',
  issuedAt: '',
  expiresAt: '',
  displayOrder: '0',
}

const fieldClass = 'w-full rounded-xl border px-3 py-2.5'
const fieldStyle = { background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }

export function DashboardCertifications() {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(blankForm)
  const [editingId, setEditingId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return undefined
    let active = true
    requestJson('/certifications')
      .then((result) => { if (active) setItems(result?.data || []) })
      .catch((loadError) => { if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load certifications.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [isAuthenticated])

  const resetForm = () => {
    setForm(blankForm)
    setEditingId('')
  }

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        issuer: form.issuer.trim(),
        credentialId: form.credentialId.trim() || undefined,
        credentialUrl: form.credentialUrl.trim() || undefined,
        description: form.description.trim() || undefined,
        issuedAt: form.issuedAt ? new Date(`${form.issuedAt}T00:00:00Z`).toISOString() : undefined,
        expiresAt: form.expiresAt ? new Date(`${form.expiresAt}T00:00:00Z`).toISOString() : undefined,
        displayOrder: Number(form.displayOrder || 0),
      }
      const result = await requestJson(editingId ? `/certifications/${encodeURIComponent(editingId)}` : '/certifications', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const item = result?.data
      setItems((current) => {
        const next = editingId ? current.map((entry) => entry.id === editingId ? item : entry) : [...current, item]
        return next.sort((a, b) => a.displayOrder - b.displayOrder || String(b.issuedAt || '').localeCompare(String(a.issuedAt || '')))
      })
      setNotice(editingId ? 'Certification updated.' : 'Certification added and published.')
      resetForm()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save certification.')
    } finally {
      setSaving(false)
    }
  }

  const edit = (item) => {
    setEditingId(item.id)
    setForm({
      name: item.name || '',
      issuer: item.issuer || '',
      credentialId: item.credentialId || '',
      credentialUrl: item.credentialUrl || '',
      description: item.description || '',
      issuedAt: item.issuedAt ? item.issuedAt.slice(0, 10) : '',
      expiresAt: item.expiresAt ? item.expiresAt.slice(0, 10) : '',
      displayOrder: String(item.displayOrder ?? 0),
    })
    setError('')
    setNotice('')
  }

  const remove = async (item) => {
    if (!window.confirm(`Delete “${item.name}” from certifications?`)) return
    setError('')
    try {
      await requestJson(`/certifications/${encodeURIComponent(item.id)}`, { method: 'DELETE' })
      setItems((current) => current.filter((entry) => entry.id !== item.id))
      if (editingId === item.id) resetForm()
      setNotice('Certification deleted.')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete certification.')
    }
  }

  if (!isAuthenticated) return null

  return (
    <main>
      <SectionHeading eyebrow="Credentials" title="Certifications" description="Manage professional certificates, memberships, and credentials shown on the public experience page." />
      <Card className="mb-6 p-5 sm:p-6">
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Certification or membership name" name="name" value={form.name} onChange={handleChange} required />
            <Field label="Issuer or organization" name="issuer" value={form.issuer} onChange={handleChange} required />
            <Field label="Credential ID" name="credentialId" value={form.credentialId} onChange={handleChange} />
            <Field label="Verification URL" name="credentialUrl" type="url" value={form.credentialUrl} onChange={handleChange} />
            <Field label="Issue date" name="issuedAt" type="date" value={form.issuedAt} onChange={handleChange} />
            <Field label="Expiration date" name="expiresAt" type="date" value={form.expiresAt} onChange={handleChange} />
            <Field label="Display order" name="displayOrder" type="number" min="0" value={form.displayOrder} onChange={handleChange} />
          </div>
          <Field label="Description" name="description" as="textarea" rows="3" value={form.description} onChange={handleChange} />
          {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
          {notice ? <p role="status" className="text-sm text-green-700">{notice}</p> : null}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Update certification' : 'Add certification'}</Button>
            {editingId ? <Button type="button" variant="secondary" onClick={resetForm}>Cancel edit</Button> : null}
          </div>
        </form>
      </Card>
      <Container className="px-0">
        {loading ? <p style={{ color: 'var(--text-secondary)' }}>Loading certifications…</p> : (
          <div className="grid gap-4">
            {items.length ? items.map((item) => (
              <Card key={item.id} className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--accent-primary)' }}>{item.issuer}</p>
                    <h2 className="mt-2 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{item.name}</h2>
                    {item.credentialId ? <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>ID: {item.credentialId}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="secondary" onClick={() => edit(item)}>Edit</Button>
                    <Button type="button" variant="secondary" onClick={() => remove(item)}>Delete</Button>
                  </div>
                </div>
              </Card>
            )) : <Card className="p-6 text-sm" style={{ color: 'var(--text-secondary)' }}>No certifications yet. Add verified credentials above.</Card>}
          </div>
        )}
      </Container>
    </main>
  )
}

function Field({ label, name, as = 'input', ...props }) {
  const Component = as
  return (
    <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
      {label}
      <Component name={name} className={fieldClass} style={fieldStyle} {...props} />
    </label>
  )
}
