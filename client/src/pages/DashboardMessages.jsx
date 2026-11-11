import { useEffect, useState } from 'react'
import { ArrowUpRight, Mail, MailCheck, RefreshCw } from 'lucide-react'
import { Button, Card, SectionHeading } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { requestJson } from '../services/api.js'

function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
}

export function DashboardMessages() {
  const { isAuthenticated } = useAuth()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [updatingId, setUpdatingId] = useState('')
  const [refreshVersion, setRefreshVersion] = useState(0)

  useEffect(() => {
    if (!isAuthenticated) return

    let active = true
    const loadMessages = async () => {
      try {
        const result = await requestJson(`/contact${unreadOnly ? '?unread=true' : ''}`)
        if (!Array.isArray(result?.data)) {
          throw new Error('The inbox returned an invalid response.')
        }
        if (active) {
          setMessages(result.data)
          setError('')
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load messages.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadMessages()
    return () => {
      active = false
    }
  }, [isAuthenticated, refreshVersion, unreadOnly])

  const markAsRead = async (message) => {
    setUpdatingId(message.id)
    setError('')
    try {
      const result = await requestJson(`/contact/message/${encodeURIComponent(message.id)}/read`, {
        method: 'PUT',
      })
      if (!result?.data) throw new Error('The message could not be updated.')

      setMessages((current) => current.map((item) => item.id === message.id ? result.data : item))
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to mark the message as read.')
    } finally {
      setUpdatingId('')
    }
  }

  const refreshMessages = () => {
    setLoading(true)
    setRefreshVersion((current) => current + 1)
  }

  const toggleUnreadFilter = () => {
    setLoading(true)
    setUnreadOnly((current) => !current)
  }

  if (!isAuthenticated) return null

  const unreadCount = messages.filter((message) => !message.read).length

  return (
    <main>
      <SectionHeading eyebrow="Messages" title="Inbox" description="Review contact and collaboration messages from your portfolio visitors." />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <Mail size={17} style={{ color: 'var(--accent-primary)' }} />
          {unreadOnly ? `${unreadCount} unread in this view` : `${unreadCount} unread · ${messages.length} total`}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={unreadOnly ? 'primary' : 'secondary'}
            onClick={toggleUnreadFilter}
          >
            {unreadOnly ? 'Show all messages' : 'Show unread only'}
          </Button>
          <Button type="button" variant="secondary" onClick={refreshMessages} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <div role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          <span>{error}</span>
          <button type="button" className="font-semibold underline" onClick={refreshMessages}>Try again</button>
        </div>
      ) : null}

      {loading ? (
        <p role="status" className="py-12 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>Loading inbox…</p>
      ) : messages.length ? (
        <div className="grid gap-3">
          {messages.map((message) => (
            <Card key={message.id} className={`p-5 sm:p-6${message.read ? '' : ' dashboard-message-unread'}`}>
              <article>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{message.subject}</h2>
                      {!message.read ? <span className="dashboard-message-badge">Unread</span> : null}
                    </div>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {message.name} · <a className="hover:underline" href={`mailto:${message.email}`}>{message.email}</a>
                    </p>
                    <time className="mt-1 block text-xs" dateTime={message.createdAt} style={{ color: 'var(--text-secondary)' }}>
                      {formatDate(message.createdAt)}
                    </time>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a className="dashboard-message-action" href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}>
                      Reply <ArrowUpRight size={14} />
                    </a>
                    {!message.read ? (
                      <button
                        type="button"
                        className="dashboard-message-action"
                        onClick={() => markAsRead(message)}
                        disabled={updatingId === message.id}
                      >
                        <MailCheck size={14} />
                        {updatingId === message.id ? 'Saving…' : 'Mark read'}
                      </button>
                    ) : null}
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-wrap border-t pt-4 text-sm leading-7" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                  {message.message}
                </p>
              </article>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="px-6 py-12 text-center">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-full" style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)' }}>
            <Mail size={20} />
          </span>
          <h2 className="mt-4 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {unreadOnly ? 'You’re all caught up' : 'Your inbox is clear'}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
            {unreadOnly ? 'There are no unread messages.' : 'Contact form submissions from visitors will appear here.'}
          </p>
        </Card>
      )}
    </main>
  )
}
