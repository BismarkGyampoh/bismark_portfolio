/**
 * Dashboard Sidebar Navigation
 */

import { Link, NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Folder,
  Briefcase,
  GraduationCap,
  Library,
  MessageCircle,
  User,
  Settings,
  Wrench,
  Images,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
  { path: '/dashboard/projects', icon: Folder, label: 'Projects' },
  { path: '/dashboard/media', icon: Images, label: 'Media' },
  { path: '/dashboard/skills', icon: Wrench, label: 'Skills' },
  { path: '/dashboard/experience', icon: Briefcase, label: 'Experience' },
  { path: '/dashboard/education', icon: GraduationCap, label: 'Education' },
  { path: '/dashboard/blog', icon: Library, label: 'Blog' },
  { path: '/dashboard/messages', icon: MessageCircle, label: 'Messages' },
  { path: '/dashboard/profile', icon: User, label: 'Profile' },
  { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export function SidebarNav({ currentPath }) {
  const { user } = useAuth()

  return (
    <>
      <aside className="dashboard-sidebar">
        <Link to="/dashboard" className="dashboard-brand">
          <span className="dashboard-brand-mark">BG</span>
          <span><strong>Bismark Gyampoh</strong><small>Portfolio studio</small></span>
        </Link>
        <p className="dashboard-nav-label">Workspace</p>
        <nav className="dashboard-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `dashboard-nav-link${isActive ? ' is-active' : ''}`}
            >
              <item.icon size={18} strokeWidth={1.8} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="dashboard-sidebar-bottom">
          <a className="dashboard-site-link" href="/" target="_blank" rel="noreferrer">
            <ExternalLink size={16} /><span>View live portfolio</span>
          </a>
          <div className="dashboard-sidebar-user">
            <span className="dashboard-user-avatar">{(user?.name || 'A').slice(0, 1).toUpperCase()}</span>
            <span><strong>{user?.name || 'Administrator'}</strong><small>Administrator</small></span>
          </div>
        </div>
      </aside>
      <nav className="dashboard-mobile-nav" aria-label="Admin sections">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            aria-current={currentPath === item.path ? 'page' : undefined}
            className={({ isActive }) => `dashboard-mobile-link${isActive ? ' is-active' : ''}`}
          >
            <item.icon size={17} strokeWidth={1.8} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}
