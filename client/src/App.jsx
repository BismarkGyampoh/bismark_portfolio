import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import ProjectDetailPage from './pages/ProjectDetailPage.jsx'
import SkillsPage from './pages/SkillsPage.jsx'
import ExperiencePage from './pages/ExperiencePage.jsx'
import BlogPage from './pages/BlogPage.jsx'
import BlogArticlePage from './pages/BlogArticlePage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import AdminLoginPage from './pages/AdminLoginPage.jsx'
import { DashboardOverview } from './pages/DashboardOverview.jsx'
import { DashboardProjectsMinimal } from './pages/DashboardProjects.jsx'
import { DashboardMedia } from './pages/DashboardMedia.jsx'
import { DashboardSkills } from './pages/DashboardSkills.jsx'
import { DashboardExperience } from './pages/DashboardExperience.jsx'
import { DashboardEducation } from './pages/DashboardEducation.jsx'
import { DashboardBlog } from './pages/DashboardBlog.jsx'
import { DashboardMessages } from './pages/DashboardMessages.jsx'
import { DashboardProfile } from './pages/DashboardProfile.jsx'
import { DashboardSettings } from './pages/DashboardSettings.jsx'
import { useAuth } from './context/AuthContext.jsx'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center" style={{ color: 'var(--text-secondary)' }}>Loading dashboard…</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogArticlePage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="projects" element={<DashboardProjectsMinimal />} />
          <Route path="media" element={<DashboardMedia />} />
          <Route path="skills" element={<DashboardSkills />} />
          <Route path="experience" element={<DashboardExperience />} />
          <Route path="education" element={<DashboardEducation />} />
          <Route path="blog" element={<DashboardBlog />} />
          <Route path="messages" element={<DashboardMessages />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="settings" element={<DashboardSettings />} />
          <Route path="*" element={<DashboardOverview />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
