import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ArrowUpRight, LogOut } from 'lucide-react'
import { SidebarNav } from '../components/dashboard/SidebarNav.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const pageTitles = {
  '/dashboard': 'Overview',
  '/dashboard/projects': 'Projects',
  '/dashboard/media': 'Media library',
  '/dashboard/skills': 'Skills',
  '/dashboard/experience': 'Experience',
  '/dashboard/education': 'Education',
  '/dashboard/blog': 'Blog',
  '/dashboard/messages': 'Messages',
  '/dashboard/profile': 'Public profile',
  '/dashboard/settings': 'Settings',
}

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="dashboard-site min-h-screen">
      <SidebarNav currentPath={location.pathname} />

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="dashboard-header-title">
              <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--accent-primary)' }}>Portfolio Admin</p>
              <h1>{pageTitles[location.pathname] || 'Dashboard'}</h1>
            </div>

            <div className="flex items-center gap-3">
              <a className="dashboard-header-site" href="/" target="_blank" rel="noreferrer">
                View site <ArrowUpRight size={15} />
              </a>
              <div className="dashboard-header-user">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user?.name || 'Administrator'}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{user?.email || 'Session active'}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="dashboard-logout"
              >
                <LogOut size={16} /><span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="dashboard-content mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
