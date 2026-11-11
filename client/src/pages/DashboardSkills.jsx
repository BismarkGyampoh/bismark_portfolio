import { useEffect, useState } from 'react'
import { Button, Card, Container, SectionHeading } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { requestJson } from '../services/api.js'

const blankForm = {
  name: '',
  categoryId: '',
  proficiency: 'Intermediate',
  icon: '',
  displayOrder: '0',
}

export function DashboardSkills() {
  const { isAuthenticated } = useAuth()
  const [skills, setSkills] = useState([])
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState('')
  const [form, setForm] = useState(blankForm)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return undefined

    let isMounted = true

    async function loadSkills() {
      try {
        const [payload, categoryPayload] = await Promise.all([
          requestJson('/skills'),
          requestJson('/skills/categories'),
        ])
        if (isMounted) {
          setSkills(payload?.data || [])
          setCategories(categoryPayload?.data || [])
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load skills.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadSkills()
    return () => {
      isMounted = false
    }
  }, [isAuthenticated])

  const resetForm = () => {
    setForm(blankForm)
    setEditingId('')
    setNewCategoryName('')
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const submitSkill = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')

    try {
      let categoryId = form.categoryId.trim()
      if (newCategoryName.trim()) {
        const name = newCategoryName.trim()
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        const result = await requestJson('/skills/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, slug }),
        })
        const category = result?.data
        categoryId = category.id
        setCategories((current) => [...current, category])
      }

      const payload = {
        name: form.name.trim(),
        categoryId: categoryId || undefined,
        proficiency: form.proficiency.trim() || 'Intermediate',
        icon: form.icon.trim() || undefined,
        displayOrder: Number(form.displayOrder || 0),
      }

      if (!payload.name) {
        throw new Error('Skill name is required.')
      }

      const endpoint = editingId ? `/skills/${encodeURIComponent(editingId)}` : '/skills'
      const method = editingId ? 'PUT' : 'POST'
      const result = await requestJson(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const nextSkill = result?.data
      setSkills((current) => {
        if (!editingId) return [nextSkill, ...current]
        return current.map((skill) => (skill.id === editingId ? nextSkill : skill))
      })

      setNotice(editingId ? 'Skill updated successfully.' : 'Skill created successfully.')
      resetForm()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save skill.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (skill) => {
    if (!window.confirm(`Delete “${skill.name}”?`)) return

    try {
      await requestJson(`/skills/${encodeURIComponent(skill.id)}`, { method: 'DELETE' })
      setSkills((current) => current.filter((item) => item.id !== skill.id))
      if (editingId === skill.id) {
        resetForm()
      }
      setNotice('Skill deleted successfully.')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete skill.')
    }
  }

  const handleEdit = (skill) => {
    setEditingId(skill.id)
    setForm({
      name: skill.name || '',
      categoryId: skill.categoryId || '',
      proficiency: skill.proficiency || 'Intermediate',
      icon: skill.icon || '',
      displayOrder: String(skill.displayOrder ?? 0),
    })
    setNewCategoryName('')
  }

  if (!isAuthenticated) return null

  return (
    <main>
      <SectionHeading eyebrow="Skills" title="Skills management" description="Organize the technical capabilities shown on the portfolio." />

      <Card className="mb-6 p-5">
        <form onSubmit={submitSkill} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Skill name
              <input name="name" value={form.name} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="TypeScript" required />
            </label>
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Category
              <select name="categoryId" value={form.categoryId} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                <option value="">Choose category</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Category if new
              <input value={newCategoryName} onChange={(event) => setNewCategoryName(event.target.value)} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="Create a category" />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Proficiency
              <input name="proficiency" value={form.proficiency} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="Advanced" />
            </label>
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Display order
              <input name="displayOrder" type="number" min="0" value={form.displayOrder} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
            </label>
          </div>

          <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Icon
            <input name="icon" value={form.icon} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="https://example.com/icon.svg" />
          </label>

          {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
          {notice ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</div> : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Update skill' : 'Create skill'}</Button>
            {editingId ? <Button type="button" variant="secondary" onClick={resetForm}>Cancel edit</Button> : null}
          </div>
        </form>
      </Card>

      <Container className="px-0">
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading skills…</p>
        ) : (
          <div className="grid gap-4">
            {skills.length ? skills.map((skill) => (
              <Card key={skill.id || skill.name} className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{skill.name || 'Skill'}</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{skill.categoryId || 'General'}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>{skill.proficiency || 'Intermediate'}</span>
                    <Button type="button" variant="secondary" onClick={() => handleEdit(skill)}>Edit</Button>
                    <Button type="button" variant="secondary" onClick={() => handleDelete(skill)}>Delete</Button>
                  </div>
                </div>
              </Card>
            )) : (
              <Card className="p-6 text-sm" style={{ color: 'var(--text-secondary)' }}>No skills have been configured yet.</Card>
            )}
          </div>
        )}
      </Container>
    </main>
  )
}
