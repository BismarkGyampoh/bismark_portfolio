import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Card, Container, SectionHeading } from '../components/ui.jsx'
import { BlogCard, EmptyState } from '../components/cards.jsx'
import { getBlogContent, getBlogPostContent } from '../services/portfolio.js'

export default function BlogArticlePage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([getBlogPostContent(slug), getBlogContent()]).then(([article, blog]) => {
      if (!active) return
      setPost(article)
      setRelated(blog.posts.filter((item) => item.slug !== slug && item.category === article?.category).slice(0, 2))
      setLoading(false)
    })
    return () => { active = false }
  }, [slug])

  if (loading) return <div className="py-14 sm:py-20"><Container><p style={{ color: 'var(--text-secondary)' }}>Loading article…</p></Container></div>
  if (!post) return <div className="py-14 sm:py-20"><Container><EmptyState title="Article not found" description="This article does not exist or is not published." /><div className="mt-6 text-center"><Link to="/blog" className="text-sm hover:underline" style={{ color: 'var(--accent-primary)' }}>Back to blog</Link></div></Container></div>

  return (
    <div className="py-14 sm:py-20">
      <Container className="max-w-4xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm hover:underline" style={{ color: 'var(--text-secondary)' }}><ArrowLeft className="h-4 w-4" />Back to blog</Link>
        <header className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--accent-primary)' }}>{[post.category, post.date].filter(Boolean).join(' · ')}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: 'var(--text-primary)' }}>{post.title}</h1>
        </header>
        <Card className="mt-8 overflow-hidden p-2"><img src={post.cover} alt="" className="w-full rounded-xl object-cover" style={{ background: 'var(--bg-section)' }} /></Card>
        <article className="prose-like mt-8 space-y-5 text-base leading-8" style={{ color: 'var(--text-secondary)' }}>
          {post.content.map((p) => <p key={p}>{p}</p>)}
        </article>
        {related.length ? (
          <section className="mt-14">
            <SectionHeading eyebrow="Related" title="Related articles" />
            <div className="grid gap-6 md:grid-cols-2">{related.map((p) => <BlogCard key={p.slug} post={p} />)}</div>
          </section>
        ) : null}
      </Container>
    </div>
  )
}
