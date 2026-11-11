import ThemeToggle from '../components/ThemeToggle.jsx'

export default function DevStatusPage() {
  return (
    <main
      className="min-h-screen px-4 py-10 transition-colors"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <div className="mx-auto mb-4 flex max-w-3xl justify-end">
        <ThemeToggle />
      </div>
      <div
        className="mx-auto max-w-3xl rounded-2xl border p-6 transition-colors"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          boxShadow: 'var(--shadow-elevated)',
        }}
      >
        <p
          className="mb-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide"
          style={{
            borderColor: 'rgba(37, 99, 235, 0.4)',
            background: 'var(--accent-soft)',
            color: 'var(--accent-primary)',
          }}
        >
          Development Environment
        </p>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Professional Portfolio
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Phase 2 initialization test page (temporary). Light mode is the default.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <StatusCard title="Frontend" status="Running" description="React + Vite application shell loaded." ok />
          <StatusCard title="Backend" status="Check in browser" description="Use the API health endpoint to verify connection." neutral />
        </div>

        <div
          className="mt-6 rounded-xl border p-4 text-sm transition-colors"
          style={{
            background: 'var(--bg-section)',
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow-subtle)',
          }}
        >
          <h2 className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Design Direction
          </h2>
          <ul className="grid gap-1" style={{ color: 'var(--text-secondary)' }}>
            <li>Light-first modern corporate aesthetic</li>
            <li>Clean surfaces with subtle shadows</li>
            <li>Blue accent used strategically</li>
            <li>Dark mode available as optional theme</li>
          </ul>
        </div>
      </div>
    </main>
  )
}

function StatusCard({ title, status, description, ok, neutral }) {
  const palette = ok
    ? { bg: 'rgba(37, 99, 235, 0.08)', text: 'var(--accent-primary)', border: 'rgba(37, 99, 235, 0.4)' }
    : neutral
      ? { bg: 'var(--bg-section)', text: 'var(--text-secondary)', border: 'var(--border-color)' }
      : { bg: 'var(--bg-section)', text: 'var(--text-secondary)', border: 'var(--border-color)' }

  return (
    <article
      className="rounded-xl border p-4 transition-colors"
      style={{
        background: palette.bg,
        borderColor: palette.border,
        boxShadow: 'var(--shadow-subtle)',
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <span className="text-sm" style={{ color: palette.text }}>
          {status}
        </span>
      </div>
      <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
        {description}
      </p>
    </article>
  )
}
