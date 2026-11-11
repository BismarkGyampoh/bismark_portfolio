import { useEffect, useMemo, useState } from 'react'
import { Button, Card, Container, SectionHeading } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { requestJson } from '../services/api.js'

const blankForm = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  categoryId: '',
  featuredImage: '',
  liveUrl: '',
  githubUrl: '',
  featured: false,
  published: true,
  displayOrder: '0',
}

export function DashboardProjectsMinimal() {
  const { isAuthenticated } = useAuth()
  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingSlug, setEditingSlug] = useState('')
  const [form, setForm] = useState(blankForm)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const formSummary = useMemo(
    () => ({
      title: form.title.trim(),
      slug: form.slug.trim(),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      categoryId: form.categoryId.trim(),
      featuredImage: form.featuredImage.trim(),
      liveUrl: form.liveUrl.trim(),
      githubUrl: form.githubUrl.trim(),
    }),
    [form],
  )

  useEffect(() => {
    if (!isAuthenticated) return undefined

    let isMounted = true

    async function loadProjects() {
      try {
        const [payload, categoryPayload] = await Promise.all([
          requestJson('/projects/admin'),
          requestJson('/projects/categories'),
        ])
        if (isMounted) {
          setProjects(payload?.data || [])
          setCategories(categoryPayload?.data || [])
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load projects.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadProjects()
    return () => {
      isMounted = false
    }
  }, [isAuthenticated])

  const resetForm = () => {
    setForm(blankForm)
    setEditingSlug('')
    setNewCategoryName('')
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const submitProject = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')

    try {
      let categoryId = formSummary.categoryId
      if (newCategoryName.trim()) {
        const name = newCategoryName.trim()
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        const result = await requestJson('/projects/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, slug }),
        })
        const newCategory = result?.data
        categoryId = newCategory.id
        setCategories((current) => [...current, newCategory])
      }

      const nextSlug = formSummary.slug || formSummary.title
      const normalizedSlug = nextSlug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

      const payload = {
        title: formSummary.title || 'Untitled Project',
        slug: normalizedSlug || 'untitled-project',
        shortDescription: formSummary.shortDescription || undefined,
        description: formSummary.description || undefined,
        categoryId: categoryId || undefined,
        featuredImage: formSummary.featuredImage || undefined,
        liveUrl: formSummary.liveUrl || undefined,
        githubUrl: formSummary.githubUrl || undefined,
        featured: Boolean(form.featured),
        published: Boolean(form.published),
        displayOrder: Number(form.displayOrder || 0),
      }

      if (!payload.title || !payload.slug) {
        throw new Error('A project title is required.')
      }

      const endpoint = editingSlug ? `/projects/${encodeURIComponent(editingSlug)}` : '/projects'
      const method = editingSlug ? 'PUT' : 'POST'
      const result = await requestJson(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const nextProject = result?.data
      setProjects((current) => {
        if (!editingSlug) {
          return [nextProject, ...current]
        }
        return current.map((project) => (project.slug === editingSlug ? nextProject : project))
      })

      setNotice(editingSlug ? 'Project updated successfully.' : 'Project created successfully.')
      resetForm()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save the project.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete “${project.title || project.slug}”?`)) {
      return
    }

    try {
      await requestJson(`/projects/${encodeURIComponent(project.slug)}`, {
        method: 'DELETE',
      })
      setProjects((current) => current.filter((item) => item.slug !== project.slug))
      if (editingSlug === project.slug) {
        resetForm()
      }
      setNotice('Project deleted successfully.')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete the project.')
    }
  }

  const handleEdit = (project) => {
    setEditingSlug(project.slug)
    setForm({
      title: project.title || '',
      slug: project.slug || '',
      shortDescription: project.shortDescription || '',
      description: project.description || '',
      categoryId: project.categoryId || '',
      featuredImage: project.featuredImage || '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      featured: Boolean(project.featured),
      published: Boolean(project.published),
      displayOrder: String(project.displayOrder ?? 0),
    })
    setNewCategoryName('')
  }

  if (!isAuthenticated) return null

  return (
    <main>
      <SectionHeading eyebrow="Projects" title="Project management" description="Published project changes appear on the public portfolio." />

      <Card className="mb-6 p-5">
        <form onSubmit={submitProject} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Title
              <input name="title" value={form.title} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="Quarterly growth dashboard" required />
            </label>
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Slug
              <input name="slug" value={form.slug} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="quarterly-growth-dashboard" />
            </label>
          </div>

          <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Short description
            <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows="2" className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="Brief summary shown on public cards." />
          </label>

          <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Full description
            <textarea name="description" value={form.description} onChange={handleChange} rows="4" className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="Detailed overview of the problem, solution, and impact." />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
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
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Featured image path or URL
              <input name="featuredImage" value={form.featuredImage} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="/images/project.jpg" />
            </label>
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Live URL
              <input name="liveUrl" value={form.liveUrl} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="https://example.com" />
            </label>
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              GitHub URL
              <input name="githubUrl" value={form.githubUrl} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="https://github.com/..." />
            </label>
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Display order
              <input type="number" min="0" name="displayOrder" value={form.displayOrder} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              Featured
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
              Published
            </label>
          </div>

          {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
          {notice ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</div> : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving…' : editingSlug ? 'Update project' : 'Create project'}</Button>
            {editingSlug ? (
              <Button type="button" variant="secondary" onClick={resetForm}>Cancel edit</Button>
            ) : null}
          </div>
        </form>
      </Card>

      <Container className="px-0">
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading projects…</p>
        ) : (
          <div className="grid gap-4">
            {projects.length ? projects.map((project) => (
              <Card key={project.slug || project.id} className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--accent-primary)' }}>{project.category?.name || 'Portfolio'}</p>
                    <h2 className="mt-2 text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{project.title || project.slug}</h2>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{project.shortDescription || 'No summary yet.'}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                    <Button type="button" variant="secondary" onClick={() => handleEdit(project)}>Edit</Button>
                    <Button type="button" variant="secondary" onClick={() => handleDelete(project)}>Delete</Button>
                  </div>
                </div>
              </Card>
            )) : (
              <Card className="p-6 text-sm" style={{ color: 'var(--text-secondary)' }}>No projects have been added yet.</Card>
            )}
          </div>
        )}
      </Container>
    </main>
  )
}
