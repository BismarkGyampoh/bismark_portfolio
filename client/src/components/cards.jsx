import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export function ProjectCard({ project, index }) {
  return (
    <article className="project-preview">
      <Link to={`/projects/${project.slug}`} className="project-preview-image image-frame" aria-label={`View ${project.title}`}>
        <img src={project.image} alt={project.imageAlt || ''} className="h-full w-full object-cover" style={{ background: 'var(--bg-section)' }} loading="lazy" />
      </Link>
      <div className="project-preview-copy">
        <p className="eyebrow">{index ? `${String(index).padStart(2, '0')} / ` : ''}{project.category}</p>
        <h3 className="display-type"><Link to={`/projects/${project.slug}`}>{project.title}</Link></h3>
        <p className="project-preview-summary">{project.summary}</p>
        <div className="project-preview-bottom">
          <ul className="project-tags" aria-label="Technologies">
            {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          <Link to={`/projects/${project.slug}`} className="project-open" aria-label={`View ${project.title}`}>
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
    </article>
  )
}

export function BlogCard({ post }) {
  return (
    <article className="blog-preview">
      <Link to={`/blog/${post.slug}`} className="blog-preview-image image-frame">
        <img src={post.cover} alt="" className="h-full w-full object-cover" style={{ background: 'var(--bg-section)' }} loading="lazy" />
      </Link>
      <div className="blog-preview-copy">
        <p className="eyebrow">{[post.category, post.date].filter(Boolean).join(' · ')}</p>
        <h3 className="display-type"><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
        <p>{post.excerpt}</p>
      </div>
    </article>
  )
}

export function EmptyState({ title, description }) {
  return (
    <div className="empty-state border-y py-10" style={{ borderColor: 'var(--border-color)' }}>
      <h3 className="display-type">{title}</h3>
      <p>{description}</p>
    </div>
  )
}
