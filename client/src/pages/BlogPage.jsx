import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Container, SectionHeading } from '../components/ui.jsx'
import { BlogCard, EmptyState } from '../components/cards.jsx'
import { getBlogContent } from '../services/portfolio.js'

export default function BlogPage() {
  const [category, setCategory] = useState('All')
  const [allPosts, setAllPosts] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadBlog() {
      const result = await getBlogContent()
      if (cancelled) return

      setAllPosts(result.posts)
      setCategories(result.categories)
      setLoading(false)
    }

    loadBlog()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => (category === 'All' ? allPosts : allPosts.filter((p) => p.category === category)), [category, allPosts])
  const featured = filtered.find((p) => p.featured) || filtered[0]
  const rest = filtered.filter((p) => p.slug !== featured?.slug)

  return (
    <div className="py-14 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Writing" title="Blog" description="Articles and notes on technology, systems, and creative work." />
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Blog categories">
          {categories.map((c) => {
            const active = c === category
            return (
              <button key={c} type="button" role="tab" aria-selected={active} onClick={() => setCategory(c)} className="border px-4 py-2 text-sm" style={{ borderColor: active ? 'var(--accent-primary)' : 'var(--border-color)', background: active ? 'var(--accent-soft)' : 'transparent', color: active ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>{c}</button>
            )
          })}
        </div>
        {loading ? <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading blog posts…</p> : null}
        {!loading && !filtered.length ? <EmptyState title="No articles published yet" description="Articles will appear here when they are available." /> : null}
        {!loading && filtered.length ? (
          <>
            {featured ? (
              <Card className="mb-8 grid overflow-hidden lg:grid-cols-2">
                <img src={featured.cover} alt="" className="h-full min-h-56 w-full object-cover" style={{ background: 'var(--bg-section)' }} />
                <div className="p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--accent-primary)' }}>Featured · {featured.category}{featured.isSample ? ' · Sample' : ''}</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight"><Link to={`/blog/${featured.slug}`} className="hover:underline" style={{ color: 'var(--text-primary)' }}>{featured.title}</Link></h2>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{featured.date}</p>
                  <p className="mt-4 leading-7" style={{ color: 'var(--text-secondary)' }}>{featured.excerpt}</p>
                  <Link to={`/blog/${featured.slug}`} className="mt-6 inline-block text-sm font-medium hover:underline" style={{ color: 'var(--accent-primary)' }}>Read article</Link>
                </div>
              </Card>
            ) : null}
            <div className="grid gap-6 md:grid-cols-2">{rest.map((p) => <BlogCard key={p.slug} post={p} />)}</div>
          </>
        ) : null}
      </Container>
    </div>
  )
}
