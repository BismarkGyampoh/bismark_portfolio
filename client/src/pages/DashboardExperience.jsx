import { useEffect, useState } from 'react'
import { Button, Card, Container, SectionHeading } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { requestJson } from '../services/api.js'

const blankForm = {
  company: '',
  position: '',
  employmentType: 'full-time',
  location: '',
  description: '',
  startDate: '',
  endDate: '',
  current: false,
  displayOrder: '0',
}

export function DashboardExperience() {
  const { isAuthenticated } = useAuth()
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState('')
  const [form, setForm] = useState(blankForm)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return undefined

    let isMounted = true

    async function loadExperiences() {
      try {
        const payload = await requestJson('/experience')
        if (isMounted) {
          setExperiences(payload?.data || [])
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load experience records.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadExperiences()
    return () => {
      isMounted = false
    }
  }, [isAuthenticated])

  const resetForm = () => {
    setForm(blankForm)
    setEditingId('')
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const submitExperience = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')

    try {
      const payload = {
        company: form.company.trim(),
        position: form.position.trim(),
        employmentType: form.employmentType || undefined,
        location: form.location.trim() || undefined,
        description: form.description.trim() || undefined,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
        endDate: form.endDate && !form.current ? new Date(form.endDate).toISOString() : undefined,
        current: Boolean(form.current),
        displayOrder: Number(form.displayOrder || 0),
      }

      if (!payload.company || !payload.position) {
        throw new Error('Company and position are required.')
      }

      const endpoint = editingId ? `/experience/${encodeURIComponent(editingId)}` : '/experience'
      const method = editingId ? 'PUT' : 'POST'
      const result = await requestJson(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const nextItem = result?.data
      setExperiences((current) => {
        if (!editingId) return [nextItem, ...current]
        return current.map((item) => (item.id === editingId ? nextItem : item))
      })

      setNotice(editingId ? 'Experience updated successfully.' : 'Experience created successfully.')
      resetForm()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save experience.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete “${item.position} @ ${item.company}”?`)) return
    try {
      await requestJson(`/experience/${encodeURIComponent(item.id)}`, { method: 'DELETE' })
      setExperiences((current) => current.filter((entry) => entry.id !== item.id))
      if (editingId === item.id) resetForm()
      setNotice('Experience deleted successfully.')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete experience.')
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setForm({
      company: item.company || '',
      position: item.position || '',
      employmentType: item.employmentType || 'full-time',
      location: item.location || '',
      description: item.description || '',
      startDate: item.startDate ? item.startDate.slice(0, 10) : '',
      endDate: item.endDate ? item.endDate.slice(0, 10) : '',
      current: Boolean(item.current),
      displayOrder: String(item.displayOrder ?? 0),
    })
  }

  if (!isAuthenticated) return null

  return (
    <main>
      <SectionHeading eyebrow="Experience" title="Professional history" description="Add and update work, internship, and leadership records." />

      <Card className="mb-6 p-5">
        <form onSubmit={submitExperience} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Company
              <input name="company" value={form.company} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="Northwind Labs" required />
            </label>
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Position
              <input name="position" value={form.position} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="Senior Product Analyst" required />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Employment type
              <select name="employmentType" value={form.employmentType} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Location
              <input name="location" value={form.location} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="Remote" />
            </label>
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Display order
              <input name="displayOrder" type="number" min="0" value={form.displayOrder} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Start date
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
            </label>
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              End date
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} disabled={form.current} />
            </label>
          </div>

          <label className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <input type="checkbox" name="current" checked={form.current} onChange={handleChange} />
            Current position
          </label>

          <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="What you achieved in this role." />
          </label>

          {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
          {notice ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</div> : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Update experience' : 'Create experience'}</Button>
            {editingId ? <Button type="button" variant="secondary" onClick={resetForm}>Cancel edit</Button> : null}
          </div>
        </form>
      </Card>

      <Container className="px-0">
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading experience entries…</p>
        ) : (
          <div className="grid gap-4">
            {experiences.length ? experiences.map((item) => (
              <Card key={item.id || `${item.company}-${item.position}`} className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--accent-primary)' }}>{item.employmentType || 'Role'}</p>
                    <h3 className="mt-2 text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{item.position || 'Position'}</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.company || 'Organization'} · {item.location || 'Remote'} </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>{item.current ? 'Current' : 'Previous'}</span>
                    <Button type="button" variant="secondary" onClick={() => handleEdit(item)}>Edit</Button>
                    <Button type="button" variant="secondary" onClick={() => handleDelete(item)}>Delete</Button>
                  </div>
                </div>
              </Card>
            )) : (
              <Card className="p-6 text-sm" style={{ color: 'var(--text-secondary)' }}>No experience records have been added yet.</Card>
            )}
          </div>
        )}
      </Container>
    </main>
  )
}
