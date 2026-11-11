import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ExternalLink, ArrowLeft } from 'lucide-react'
import { projects as fallbackProjects } from '../data/projects.js'
import { Button, Card, Container, SectionHeading } from '../components/ui.jsx'
import { EmptyState, ProjectCard } from '../components/cards.jsx'
import { getProjectContent, getProjectsContent, getMediaContent } from '../services/portfolio.js'

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [relatedProjects, setRelatedProjects] = useState(fallbackProjects)
  const [loading, setLoading] = useState(true)
  const [remoteGallery, setRemoteGallery] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setRemoteGallery(null)
    Promise.all([getProjectContent(slug), getProjectsContent()]).then(([result, projectsResult]) => {
      if (cancelled) return
      setProject(result)
      setRelatedProjects(projectsResult.projects)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [slug])

  useEffect(() => {
    if (slug !== 'flikbi-media') return undefined
    let cancelled = false
    getMediaContent().then((artwork) => {
      if (!cancelled) {
        setRemoteGallery(artwork.map((item) => ({
          src: item.imageUrl,
          alt: item.altText,
          title: item.title,
        })))
      }
    })
    return () => { cancelled = true }
  }, [slug])
  const gallery = slug === 'flikbi-media' && remoteGallery !== null
    ? remoteGallery
    : project?.gallery || []
  if (loading) {
    return <div className="py-14 sm:py-20"><Container><p style={{ color: 'var(--text-secondary)' }}>Loading project…</p></Container></div>
  }
  if (!project) {
    return (
      <div className="py-14 sm:py-20"><Container><EmptyState title="Project not found" description="This project does not exist or has been moved." /><div className="mt-6 text-center"><Button to="/projects" variant="secondary">Back to projects</Button></div></Container></div>
    )
  }
  const related = relatedProjects.filter((item) => project.related?.includes(item.slug))

  return (
    <div className="py-14 sm:py-20">
      <Container>
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm hover:underline" style={{ color: 'var(--text-secondary)' }}><ArrowLeft className="h-4 w-4" />Back to projects</Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--accent-primary)' }}>{project.category}{project.isSample ? ' · Sample' : ''}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: 'var(--text-primary)' }}>{project.title}</h1>
            <p className="mt-4 text-lg leading-8" style={{ color: 'var(--text-secondary)' }}>{project.summary}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {project.liveUrl ? <Button as="a" href={project.liveUrl} target="_blank" rel="noreferrer" variant="primary">Live project <ExternalLink className="h-4 w-4" /></Button> : null}
              {project.sourceUrl ? <Button as="a" href={project.sourceUrl} target="_blank" rel="noreferrer" variant="secondary">Source code</Button> : null}
              {!project.liveUrl && !project.sourceUrl ? <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Live demo/source links hidden (not provided).</p> : null}
            </div>
          </div>
          <Card className="overflow-hidden p-2"><img src={project.image} alt={project.imageAlt || ''} className="w-full object-contain" style={{ background: 'var(--bg-section)' }} /></Card>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {project.problem ? <DetailBlock title="Problem statement" body={project.problem} /> : null}
          {project.solution ? <DetailBlock title="Proposed solution" body={project.solution} /> : null}
          {project.objectives?.length ? <Card className="p-6"><h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Objectives</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>{project.objectives.map((o) => <li key={o}>{o}</li>)}</ul></Card> : null}
          {project.process?.length ? <Card className="p-6"><h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Implementation process</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>{project.process.map((s) => <li key={s}>{s}</li>)}</ol></Card> : null}
          {project.features?.length ? <Card className="p-6"><h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Key features</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>{project.features.map((f, index) => <li key={`${index}-${f}`}>{f}</li>)}</ul></Card> : null}
          <Card className="p-6"><h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Technologies & areas</h2><div className="mt-3 flex flex-wrap gap-2">{project.tags.map((t) => <span key={t} className="rounded-full border px-3 py-1 text-sm" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{t}</span>)}</div>{project.challenges ? <><h3 className="mt-6 text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>Challenges & lessons</h3><p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>{project.challenges}</p></> : null}</Card>
        </div>

        <section className="mt-12">
          <h2 className="display-type text-3xl sm:text-4xl" style={{ color: 'var(--text-primary)' }}>Selected design work</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((artwork) => (
              <figure key={artwork.src} className="portfolio-card overflow-hidden border" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                <a href={artwork.src} target="_blank" rel="noreferrer" aria-label={`Open full-size artwork: ${artwork.title}`}>
                  <img src={artwork.src} alt={artwork.alt} className="creative-gallery-image w-full object-contain" loading="lazy" />
                </a>
                <figcaption className="px-3 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{artwork.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {related.length ? (
          <section className="mt-14">
            <SectionHeading eyebrow="Related" title="Related projects" description="Sample related items." />
            <div className="grid gap-6 md:grid-cols-2">{related.map((p) => <ProjectCard key={p.slug} project={p} />)}</div>
          </section>
        ) : null}
      </Container>
    </div>
  )
}

function DetailBlock({ title, body }) {
  return <Card className="p-6"><h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h2><p className="mt-3 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>{body}</p></Card>
}
