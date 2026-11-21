import { useState } from 'react'
import { requestJson } from '../../services/api.js'

export function AssetUploadField({ label, value, onChange, kind = 'image' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const isDocument = kind === 'document'
  const accept = isDocument ? 'application/pdf' : 'image/jpeg,image/png,image/webp'

  const upload = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploading(true)
    setError('')
    try {
      const body = new FormData()
      body.append('file', file)
      const result = await requestJson(isDocument ? '/uploads/document' : '/uploads/image', {
        method: 'POST',
        body,
      })
      if (!result?.data?.url) throw new Error('The upload completed without returning a file URL.')
      onChange(result.data.url)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Unable to upload file.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="grid gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
      <label className="grid gap-2">
        {label}
        <input
          type="text"
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder={isDocument ? 'PDF URL or upload a file' : 'Image URL or upload an image'}
          className="w-full border px-3 py-2.5 text-sm"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
        />
      </label>
      <input
        type="file"
        accept={accept}
        onChange={upload}
        disabled={uploading}
        aria-label={`Upload ${label.toLowerCase()}`}
        className="w-full border px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-[var(--accent-soft)] file:px-3 file:py-1.5"
        style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      />
      {uploading ? <span role="status">Uploading to persistent storage…</span> : null}
      <span className="text-xs">Uploaded files are public. Do not upload confidential documents.</span>
      {error ? <span role="alert" className="text-red-700">{error}</span> : null}
    </div>
  )
}
