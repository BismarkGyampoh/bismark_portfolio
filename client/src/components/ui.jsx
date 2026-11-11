import { Link } from 'react-router-dom'

export function Button({ as: Comp = 'button', to, href, variant = 'primary', className = '', children, ...props }) {
  const base =
    'portfolio-button inline-flex items-center justify-center gap-2 border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] disabled:opacity-60'
  const styles =
    variant === 'primary'
      ? { background: 'var(--accent-primary)', color: '#fff', borderColor: 'var(--accent-primary)' }
      : variant === 'secondary'
        ? { background: 'transparent', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }
        : { background: 'transparent', color: 'var(--accent-primary)', borderColor: 'transparent', paddingInline: 0 }
  const cls = `${base} ${className}`
  if (to) return <Link to={to} className={cls} style={styles} {...props}>{children}</Link>
  if (href) return <a href={href} className={cls} style={styles} {...props}>{children}</a>
  return <Comp className={cls} style={styles} {...props}>{children}</Comp>
}

export function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const a = align === 'center' ? 'text-center items-center' : 'text-left items-start'
  return (
    <div className={`mb-10 flex flex-col gap-3 ${a}`}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--accent-primary)' }}>{eyebrow}</p>
      ) : null}
      <h2 className="display-type max-w-3xl text-3xl leading-tight sm:text-4xl lg:text-5xl" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      {description ? <p className="max-w-2xl text-base leading-7" style={{ color: 'var(--text-secondary)' }}>{description}</p> : null}
    </div>
  )
}

export function Container({ className = '', children, as: Tag = 'div' }) {
  return <Tag className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</Tag>
}

export function Card({ className = '', children }) {
  return (
    <div
      className={`portfolio-card border ${className}`}
      style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
    >
      {children}
    </div>
  )
}
