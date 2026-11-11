import { useState } from 'react'
import { useProfile } from '../context/ProfileContext.jsx'
import { Button, Card, Container, SectionHeading } from '../components/ui.jsx'
import { submitContactMessage } from '../services/portfolio.js'

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Full name is required.'
  if (!values.email.trim()) errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email address.'
  if (!values.subject.trim()) errors.subject = 'Subject is required.'
  if (!values.message.trim()) errors.message = 'Message is required.'
  else if (values.message.trim().length < 10) errors.message = 'Message should be at least 10 characters.'
  return errors
}

export default function ContactPage() {
  const profile = useProfile()
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [apiMessage, setApiMessage] = useState('')

  function onChange(e) {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    const next = validate(values)
    setErrors(next)
    if (Object.keys(next).length) {
      setStatus('error')
      setApiMessage('Please fix the highlighted fields before submitting.')
      return
    }

    setStatus('submitting')
    setApiMessage('Sending your message…')

    const result = await submitContactMessage({
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
    })

    if (result.success) {
      setStatus('ready')
      setApiMessage('Your message has been sent successfully.')
      setValues({ name: '', email: '', subject: '', message: '' })
      setErrors({})
      return
    }

    setStatus('error')
    setApiMessage(result.message || 'Unable to send the message right now. Please try again later.')
  }

  return (
    <div className="py-14 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="Contact" title="Get in touch" description="Have a project in mind, need technical support, or just want to connect? Send a note." />
            <Card className="space-y-3 p-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <p><strong style={{ color: 'var(--text-primary)' }}>Email:</strong> {profile.email}</p>
              <p>
                <strong style={{ color: 'var(--text-primary)' }}>WhatsApp:</strong>{' '}
                <a href={profile.whatsappUrl} target="_blank" rel="noreferrer" className="hover:underline">
                  {profile.whatsapp}
                </a>
              </p>
              <p><strong style={{ color: 'var(--text-primary)' }}>Based in:</strong> {profile.location}</p>
            </Card>
          </div>
          <Card className="p-6 sm:p-8">
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <Field label="Full name" name="name" value={values.name} onChange={onChange} error={errors.name} autoComplete="name" />
              <Field label="Email address" name="email" type="email" value={values.email} onChange={onChange} error={errors.email} autoComplete="email" />
              <Field label="Subject" name="subject" value={values.subject} onChange={onChange} error={errors.subject} />
              <Field label="Message" name="message" value={values.message} onChange={onChange} error={errors.message} textarea rows={5} />
              {status === 'error' ? <p role="alert" className="text-sm" style={{ color: '#dc2626' }}>{apiMessage}</p> : null}
              {status === 'ready' ? (
                <div role="status" className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: 'rgba(37,99,235,0.25)', background: 'var(--accent-soft)', color: 'var(--text-primary)' }}>
                  {apiMessage}
                </div>
              ) : null}
              {status === 'submitting' ? (
                <div role="status" className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                  {apiMessage}
                </div>
              ) : null}
              <Button type="submit" variant="primary" disabled={status === 'submitting'}>{status === 'submitting' ? 'Sending…' : 'Send message'}</Button>
            </form>
          </Card>
        </div>
      </Container>
    </div>
  )
}

function Field({ label, name, error, textarea, className = '', ...props }) {
  const Comp = textarea ? 'textarea' : 'input'
  const id = `contact-${name}`
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</label>
      <Comp
        id={id}
        name={name}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-xl border px-3 py-2.5 text-sm transition-colors"
        style={{ borderColor: error ? '#f87171' : 'var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-subtle)' }}
        {...props}
      />
      {error ? <p id={`${id}-error`} className="mt-1 text-sm" style={{ color: '#dc2626' }}>{error}</p> : null}
    </div>
  )
}
