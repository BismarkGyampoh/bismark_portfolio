import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, BriefcaseBusiness, FileText, FolderKanban, Mail } from 'lucide-react'
import { Card, SectionHeading } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { requestJson } from '../services/api.js'

export function DashboardOverview() {
  const { user } = useAuth()
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadStats() {
      try {
        const payload = await requestJson('/dashboard/stats')
        if (isMounted) {
          setStats(payload?.data || {})
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard statistics')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadStats()
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return <div className="flex min-h-64 items-center justify-center" style={{ color: 'var(--text-secondary)' }}>Loading dashboard…</div>
  }

  if (error) {
    return <div className="min-h-64 py-12 text-center" style={{ color: '#dc2626' }}>{error}</div>
  }

  const published = stats.projectsPublished || 0
  const draft = stats.projectsDraft || 0
  const totalBlog = stats.totalBlogPosts || 0
  const unreadMessages = stats.unreadMessages || 0
  const firstName = user?.name?.trim().split(/\s+/)[0] || 'there'
  const statCards = [
    { label: 'Projects', value: stats.totalProjects || 0, detail: `${published} published · ${draft} drafts`, icon: FolderKanban, tone: 'terracotta' },
    { label: 'Blog posts', value: totalBlog, detail: `${stats.publishedBlogPosts || 0} published`, icon: FileText, tone: 'olive' },
    { label: 'Unread messages', value: unreadMessages, detail: `${stats.totalMessages || 0} messages in total`, icon: Mail, tone: 'gold' },
  ]

  return (
    <div className="dashboard-overview">
      <SectionHeading
        eyebrow="Your workspace"
        title={`Good to see you, ${firstName}.`}
        description="Here is a snapshot of your portfolio and what needs your attention."
      />

      <div className="dashboard-stats-grid">
        {statCards.map(({ label, value, detail, icon: Icon, tone }) => (
          <Card key={label} className="dashboard-stat-card">
            <div className="dashboard-stat-top">
              <span className="dashboard-stat-label">{label}</span>
              <span className={`dashboard-stat-icon ${tone}`}><Icon size={19} strokeWidth={1.8} /></span>
            </div>
            <p className="dashboard-stat-value">{value}</p>
            <p className="dashboard-stat-detail">{detail}</p>
          </Card>
        ))}
        <Card className="dashboard-activity-card">
          <p className="dashboard-stat-label">Recent activity</p>
          <p className="dashboard-activity-copy">{stats.recentActivity || 'Your workspace is ready for its next update.'}</p>
          <p className="dashboard-activity-user">Signed in as {user?.name || 'admin'}</p>
        </Card>
      </div>

      <section className="dashboard-quick-section">
        <div className="dashboard-section-heading">
          <div><p className="dashboard-section-kicker">Keep things moving</p><h2>Quick actions</h2></div>
          <span>Choose a section to update</span>
        </div>
        <div className="dashboard-quick-grid">
          {[
            { to: '/dashboard/projects', title: 'Add a project', copy: 'Showcase recent work', icon: FolderKanban },
            { to: '/dashboard/experience', title: 'Update experience', copy: 'Keep your background current', icon: BriefcaseBusiness },
            { to: '/dashboard/blog', title: 'Write a post', copy: 'Share a new idea', icon: FileText },
            { to: '/dashboard/messages', title: 'View messages', copy: 'Reply to an enquiry', icon: Mail },
          ].map(({ to, title, copy, icon: Icon }) => (
            <Link key={to} to={to} className="dashboard-quick-link">
              <span className="dashboard-quick-icon"><Icon size={18} /></span>
              <span className="dashboard-quick-copy"><strong>{title}</strong><small>{copy}</small></span>
              <ArrowUpRight size={17} className="dashboard-quick-arrow" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
