import { useEffect, useState } from 'react'
import { Button, Card, Container, SectionHeading } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { requestJson } from '../services/api.js'

const blankForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  categoryId: '',
  published: true,
  publishedAt: '',
}

export function DashboardBlog() {
  const { isAuthenticated } = useAuth()
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingSlug, setEditingSlug] = useState('')
  const [form, setForm] = useState(blankForm)
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' })
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return undefined

    let isMounted = true

    async function loadBlogData() {
      try {
        const [postsResult, categoriesResult] = await Promise.all([
          requestJson('/blog/admin'),
          requestJson('/blog/categories'),
        ])

        if (isMounted) {
          setPosts(postsResult?.data || [])
          setCategories(categoriesResult?.data || [])
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load blog content.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadBlogData()
    return () => { isMounted = false }
  }, [isAuthenticated])

  const resetForm = () => {
    setForm(blankForm)
    setEditingSlug('')
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleCategoryChange = (event) => {
    const { name, value } = event.target
    setNewCategory((current) => ({ ...current, [name]: value }))
  }

  const submitCategory = async () => {
    const name = newCategory.name.trim()
    const slug = (newCategory.slug || name).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

    if (!name || !slug) {
      throw new Error('Category name is required.')
    }

    const categoryResult = await requestJson('/blog/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug }),
    })

    const createdCategory = categoryResult?.data || { id: '', name, slug }
    setCategories((current) => {
      const exists = current.some((entry) => entry.slug === createdCategory.slug)
      if (exists) return current
      return [...current, createdCategory]
    })
    setForm((current) => ({ ...current, categoryId: createdCategory.id || current.categoryId || '' }))
    setNewCategory({ name: '', slug: '' })
    return createdCategory
  }

  const submitPost = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')

    try {
      let categoryId = form.categoryId || ''
      if (newCategory.name.trim() && !categoryId) {
        const category = await submitCategory()
        categoryId = category.id || categoryId
      }

      const slug = (form.slug || form.title).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
      const payload = {
        title: form.title.trim(),
        slug: slug || 'untitled-post',
        excerpt: form.excerpt.trim() || undefined,
        content: form.content.trim() || undefined,
        coverImage: form.coverImage.trim() || undefined,
        published: Boolean(form.published),
        publishedAt: form.publishedAt
          ? new Date(`${form.publishedAt}T00:00:00Z`).toISOString()
          : form.published ? new Date().toISOString() : undefined,
        categoryId: categoryId || undefined,
      }

      if (!payload.title || !payload.content) {
        throw new Error('Post title and content are required.')
      }

      const endpoint = editingSlug ? `/blog/${encodeURIComponent(editingSlug)}` : '/blog'
      const method = editingSlug ? 'PUT' : 'POST'
      const result = await requestJson(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const nextPost = result?.data
      setPosts((current) => {
        if (!editingSlug) return [nextPost, ...current]
        return current.map((post) => (post.slug === editingSlug ? nextPost : post))
      })

      setNotice(editingSlug ? 'Blog post updated successfully.' : 'Blog post created successfully.')
      resetForm()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save blog post.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete “${post.title}”?`)) return

    try {
      await requestJson(`/blog/${encodeURIComponent(post.slug)}`, { method: 'DELETE' })
      setPosts((current) => current.filter((entry) => entry.slug !== post.slug))
      if (editingSlug === post.slug) resetForm()
      setNotice('Blog post deleted successfully.')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete blog post.')
    }
  }

  const handleEdit = (post) => {
    setEditingSlug(post.slug)
    setForm({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      coverImage: post.coverImage || '',
      categoryId: post.categoryId || '',
      published: Boolean(post.published),
      publishedAt: post.publishedAt ? post.publishedAt.slice(0, 10) : '',
    })
  }

  if (!isAuthenticated) return null

  return (
    <main>
      <SectionHeading eyebrow="Blog" title="Blog management" description="Publish, update, and organize portfolio writing." />

      <Card className="mb-6 p-5">
        <form onSubmit={submitPost} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Title
              <input name="title" value={form.title} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} required />
            </label>
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Slug
              <input name="slug" value={form.slug} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="lesson-learned" />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Category
              <select name="categoryId" value={form.categoryId} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Published date
              <input type="date" name="publishedAt" value={form.publishedAt} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
            </label>
          </div>

          <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Excerpt
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows="2" className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="Short summary shown in list views." />
          </label>

          <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Content
            <textarea name="content" value={form.content} onChange={handleChange} rows="5" className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="Markdown or plain-text article content" required />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Cover image URL
              <input name="coverImage" value={form.coverImage} onChange={handleChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="https://example.com/cover.jpg" />
            </label>
            <label className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
              Published
            </label>
          </div>

          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Create category</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <input name="name" value={newCategory.name} onChange={handleCategoryChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="Category name" />
              <input name="slug" value={newCategory.slug} onChange={handleCategoryChange} className="rounded-xl border px-3 py-2.5" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="category-slug" />
            </div>
          </div>

          {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
          {notice ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</div> : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving?' : editingSlug ? 'Update post' : 'Create post'}</Button>
            {editingSlug ? <Button type="button" variant="secondary" onClick={resetForm}>Cancel edit</Button> : null}
          </div>
        </form>
      </Card>

      <Container className="px-0">
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading blog posts?</p>
        ) : (
          <div className="grid gap-4">
            {posts.length ? posts.map((post) => (
              <Card key={post.slug || post.id} className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--accent-primary)' }}>{post.category?.name || 'Uncategorized'}</p>
                    <h3 className="mt-2 text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{post.title || 'Untitled post'}</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{post.excerpt || 'No excerpt provided.'}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>{post.published ? 'Published' : 'Draft'}</span>
                    <Button type="button" variant="secondary" onClick={() => handleEdit(post)}>Edit</Button>
                    <Button type="button" variant="secondary" onClick={() => handleDelete(post)}>Delete</Button>
                  </div>
                </div>
              </Card>
            )) : (
              <Card className="p-6 text-sm" style={{ color: 'var(--text-secondary)' }}>No blog posts have been created yet.</Card>
            )}
          </div>
        )}
      </Container>
    </main>
  )
}
