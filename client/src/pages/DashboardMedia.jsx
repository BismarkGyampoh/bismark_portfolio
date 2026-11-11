import { useEffect, useState } from 'react'
import { ArrowUpRight, ImagePlus } from 'lucide-react'
import { Button, Card, Container, SectionHeading } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { requestJson, resolveMediaUrl } from '../services/api.js'

const blankForm = {
  title: '',
  altText: '',
  imageUrl: '',
  displayOrder: '0',
  published: true,
}

const inputClass = 'w-full border px-3 py-2.5 text-sm'
const inputStyle = {
  background: 'var(--bg-primary)',
  borderColor: 'var(--border-color)',
  color: 'var(--text-primary)',
}

export function DashboardMedia() {
  const { isAuthenticated } = useAuth()
  const [artwork, setArtwork] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [fileInputKey, setFileInputKey] = useState(0)
  const [form, setForm] = useState(blankForm)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return undefined

    let active = true
    async function loadArtwork() {
      try {
        const result = await requestJson('/media/admin')
        if (active) setArtwork(result?.data || [])
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load media.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadArtwork()
    return () => {
      active = false
    }
  }, [isAuthenticated])

  const resetForm = () => {
    setForm(blankForm)
    setEditingId('')
    setImageFile(null)
    setFileInputKey((current) => current + 1)
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const submitArtwork = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')

    try {
      const payload = {
        title: form.title.trim(),
        altText: form.altText.trim(),
        imageUrl: form.imageUrl.trim(),
        displayOrder: Number(form.displayOrder),
        published: Boolean(form.published),
      }

      if (!payload.title || !payload.altText || (!payload.imageUrl && !imageFile)) {
        throw new Error('Title, alternative text, and an image file or URL are required.')
      }
      if (!Number.isInteger(payload.displayOrder) || payload.displayOrder < 0) {
        throw new Error('Display order must be a non-negative whole number.')
      }

      const body = new FormData()
      body.append('title', payload.title)
      body.append('altText', payload.altText)
      body.append('imageUrl', payload.imageUrl)
      body.append('displayOrder', String(payload.displayOrder))
      body.append('published', String(payload.published))
      if (imageFile) body.append('file', imageFile)

      const result = await requestJson(editingId ? `/media/${encodeURIComponent(editingId)}` : '/media', {
        method: editingId ? 'PUT' : 'POST',
        body,
      })

      const savedArtwork = result?.data
      setArtwork((current) => {
        const next = editingId
          ? current.map((item) => item.id === editingId ? savedArtwork : item)
          : [...current, savedArtwork]
        return next.sort((a, b) => a.displayOrder - b.displayOrder || a.createdAt.localeCompare(b.createdAt))
      })
      setNotice(editingId ? 'Artwork updated.' : 'Artwork added.')
      resetForm()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save artwork.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setForm({
      title: item.title,
      altText: item.altText,
      imageUrl: item.imageUrl,
      displayOrder: String(item.displayOrder),
      published: item.published,
    })
    setImageFile(null)
    setFileInputKey((current) => current + 1)
    setError('')
    setNotice('')
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Remove “${item.title}” from the portfolio gallery?`)) return

    setError('')
    setNotice('')
    try {
      await requestJson(`/media/${encodeURIComponent(item.id)}`, { method: 'DELETE' })
      setArtwork((current) => current.filter((entry) => entry.id !== item.id))
      if (editingId === item.id) resetForm()
      setNotice('Artwork removed from the portfolio.')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to remove artwork.')
    }
  }

  if (!isAuthenticated) return null

  return (
    <main>
      <SectionHeading
        eyebrow="Creative & Digital Media"
        title="Artwork library"
        description="Manage the flyers and designs shown on the public FLiKBi MEDIA project page."
      />

      <Card className="mb-8 p-5 sm:p-6">
        <form className="grid gap-4" onSubmit={submitArtwork}>
          <div className="flex items-center gap-2">
            <ImagePlus size={18} style={{ color: 'var(--accent-primary)' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {editingId ? 'Edit artwork' : 'Add artwork'}
            </h2>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Upload a JPG, PNG, or WebP flyer (up to 10 MB), or provide an existing hosted image URL.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" name="title" value={form.title} onChange={handleChange} placeholder="Event poster" required />
            <label className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Flyer image file
              <input
                key={fileInputKey}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                className={`${inputClass} file:mr-3 file:border-0 file:bg-[var(--accent-soft)] file:px-3 file:py-1.5`}
                style={inputStyle}
              />
              {imageFile ? <span className="text-xs">{imageFile.name}</span> : null}
            </label>
          </div>
          <Field label="Or image URL or site path" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="/creative-media/design.jpg or https://…" />
          <Field label="Alternative text" name="altText" value={form.altText} onChange={handleChange} placeholder="Describe the design for screen readers" required />
          <div className="flex flex-wrap items-end gap-4">
            <Field label="Display order" name="displayOrder" type="number" min="0" value={form.displayOrder} onChange={handleChange} className="w-36" />
            <label className="mb-2 inline-flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
              Published on portfolio
            </label>
          </div>

          {error ? <p role="alert" className="border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          {notice ? <p role="status" className="border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-800">{notice}</p> : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add to portfolio'}</Button>
            {editingId ? <Button type="button" variant="secondary" onClick={resetForm}>Cancel edit</Button> : null}
          </div>
        </form>
      </Card>

      <Container className="px-0">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Portfolio artwork</h2>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{artwork.length} items</span>
        </div>
        {loading ? <p style={{ color: 'var(--text-secondary)' }}>Loading artwork…</p> : null}
        {!loading && artwork.length === 0 ? (
          <Card className="p-6 text-sm" style={{ color: 'var(--text-secondary)' }}>No artwork yet. Add a design above to show it on the public portfolio.</Card>
        ) : null}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {artwork.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <img src={resolveMediaUrl(item.imageUrl)} alt={item.altText} className="h-64 w-full object-contain" style={{ background: 'var(--bg-secondary)' }} loading="lazy" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                    <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>Order {item.displayOrder} · {item.published ? 'Published' : 'Draft'}</p>
                  </div>
                  <a href={resolveMediaUrl(item.imageUrl)} target="_blank" rel="noreferrer" aria-label={`Open ${item.title}`} style={{ color: 'var(--accent-primary)' }}>
                    <ArrowUpRight size={18} />
                  </a>
                </div>
                <p className="mt-2 line-clamp-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{item.altText}</p>
                <div className="mt-4 flex gap-2">
                  <Button type="button" variant="secondary" onClick={() => handleEdit(item)}>Edit</Button>
                  <Button type="button" variant="ghost" onClick={() => handleDelete(item)}>Remove</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </main>
  )
}

function Field({ label, name, className = '', ...props }) {
  return (
    <label className={`grid gap-2 text-sm ${className}`} style={{ color: 'var(--text-secondary)' }}>
      {label}
      <input className={inputClass} style={inputStyle} name={name} {...props} />
    </label>
  )
}
