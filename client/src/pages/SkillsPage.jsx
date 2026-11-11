import { useEffect, useState } from 'react'
import { Card, Container, SectionHeading } from '../components/ui.jsx'
import { getSkillsContent } from '../services/portfolio.js'

export default function SkillsPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadSkills() {
      const result = await getSkillsContent()
      if (cancelled) return

      setCategories(result.categories)
      setLoading(false)
    }

    loadSkills()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="py-14 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Capabilities" title="Skills" description="A practical blend of technical, problem-solving, and creative skills." />
        {loading ? <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading skills…</p> : null}
        {!loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {categories.map((cat) => (
              <Card key={cat.name} className="p-6">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{cat.name}</h2>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label={cat.name}>
                  {cat.items.map((item) => (
                    <li key={item} className="rounded-full border px-3 py-1.5 text-sm" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{item}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        ) : null}
      </Container>
    </div>
  )
}
