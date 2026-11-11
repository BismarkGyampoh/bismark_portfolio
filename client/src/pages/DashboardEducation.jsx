import { useEffect, useState } from 'react'
import { Button, Card, Container, SectionHeading } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { requestJson } from '../services/api.js'

const blankForm = {
  institution: '',
  qualification: '',
  fieldOfStudy: '',
  description: '',
  startDate: '',
  endDate: '',
  current: false,
  displayOrder: '0',
}

export function DashboardEducation() {
  const { isAuthenticated } = useAuth()
  const [educations, setEducations] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState('')
  const [form, setForm] = useState(blankForm)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return undefined

    let isMounted = true

    async function loadEducation() {
      try {
        const payload = await requestJson('/education')
        if (isMounted) setEducations(payload?.data || [])
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load education records.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadEducation()
    return () => { isMounted = false }
  }, [isAuthenticated])

  const resetForm = () => {
    setForm(blankForm)
    setEditingId('')
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const submitEducation = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')

    try {
      const payload = {
        institution: form.institution.trim(),
        qualification: form.qualification.trim(),
        fieldOfStudy: form.fieldOfStudy.trim() || undefined,
        description: form.description.trim() || undefined,
        startDate: form.startDate ? new Date(`${form.startDate}T00:00:00Z`).toISOString() : undefined,
        endDate: form.endDate && !form.current ? new Date(`${form.endDate}T00:00:00Z`).toISOString() : undefined,
        current: Boolean(form.current),
        displayOrder: Number(form.displayOrder || 0),
      }

      if (!payload.institution || !payload.qualification) {
        throw new Error('Institution and qualification are required.')
      }

      const endpoint = editingId ? `/education/${encodeURIComponent(editingId)}` : '/education'
      const method = editingId ? 'PUT' : 'POST'
      const result = await requestJson(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const nextItem = result?.data
      setEducations((current) => {
        if (!editingId) return [nextItem, ...current]
        return current.map((item) => (item.id === editingId ? nextItem : item))
      })

      setNotice(editingId ? 'Education updated successfully.' : 'Education created successfully.')
      resetForm()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save education.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete “${item.qualification} at ${item.institution}”?`)) return

    try {
      await requestJson(`/education/${encodeURIComponent(item.id)}`, { method: 'DELETE' })
      setEducations((current) => current.filter((entry) => entry.id !== item.id))
      if (editingId === item.id) resetForm()
      setNotice('Education deleted successfully.')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete education.')
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setForm({
      institution: item.institution || '',
      qualification: item.qualification || '',
      fieldOfStudy: item.fieldOfStudy || '',
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
      <SectionHeading eyebrow="Education" title="Educational background" description="Add, update, and archive education history." />

      <Card className="mb-6 p-5">
        <form onSubmit={submitEducation} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Institution
              <input name="institution" value={form.institution} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} required />
            </label>
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Qualification
              <input name="qualification" value={form.qualification} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="BSc, MSc, certificate" required />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Field of study
              <input name="fieldOfStudy" value={form.fieldOfStudy} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
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
            Currently studying / ongoing
          </label>

          <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
          </label>

          {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
          {notice ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</div> : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving?' : editingId ? 'Update education' : 'Create education'}</Button>
            {editingId ? <Button type="button" variant="secondary" onClick={resetForm}>Cancel edit</Button> : null}
          </div>
        </form>
      </Card>

      <Container className="px-0">
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading education entries?</p>
        ) : (
          <div className="grid gap-4">
            {educations.length ? educations.map((item) => (
              <Card key={item.id || `${item.institution}-${item.qualification}`} className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--accent-primary)' }}>{item.qualification || 'Qualification'}</p>
                    <h3 className="mt-2 text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{item.institution || 'Institution'}</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.fieldOfStudy || 'Field of study'}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>{item.current ? 'Ongoing' : 'Completed'}</span>
                    <Button type="button" variant="secondary" onClick={() => handleEdit(item)}>Edit</Button>
                    <Button type="button" variant="secondary" onClick={() => handleDelete(item)}>Delete</Button>
                  </div>
                </div>
              </Card>
            )) : (
              <Card className="p-6 text-sm" style={{ color: 'var(--text-secondary)' }}>No education records have been added yet.</Card>
            )}
          </div>
        )}
      </Container>
    </main>
  )
}
