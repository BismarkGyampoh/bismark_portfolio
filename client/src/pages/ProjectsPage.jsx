import { useEffect, useMemo, useState } from 'react'
import { Container, SectionHeading } from '../components/ui.jsx'
import { EmptyState, ProjectCard } from '../components/cards.jsx'
import { getProjectsContent } from '../services/portfolio.js'

export default function ProjectsPage() {
  const [category, setCategory] = useState('All')
  const [allProjects, setAllProjects] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadProjects() {
      const result = await getProjectsContent()
      if (cancelled) return

      setAllProjects(result.projects)
      setCategories(result.categories)
      setLoading(false)
    }

    loadProjects()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => (category === 'All' ? allProjects : allProjects.filter((p) => p.category === category)), [category, allProjects])

  return (
    <div className="py-14 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Selected work" title="Projects" description="Web, technology, and creative projects shaped by practical needs and people." />
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Project categories">
          {categories.map((c) => {
            const active = c === category
            return (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(c)}
                className="border px-4 py-2 text-sm transition-colors"
                style={{ borderColor: active ? 'var(--accent-primary)' : 'var(--border-color)', background: active ? 'var(--accent-soft)' : 'transparent', color: active ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
              >
                {c}
              </button>
            )
          })}
        </div>
        {loading ? <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading project data…</p> : null}
        {!loading && filtered.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => <ProjectCard key={p.slug} project={p} />)}
          </div>
        ) : !loading ? (
          <EmptyState title="No projects in this category" description="Try another filter or add verified projects to this category." />
        ) : null}
      </Container>
    </div>
  )
}
