import { useEffect, useState } from 'react'
import { certifications } from '../data/experience.js'
import { Card, Container, SectionHeading } from '../components/ui.jsx'
import { getExperienceContent } from '../services/portfolio.js'

function Timeline({ title, items }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      <ol className="mt-6 space-y-4" aria-label={title}>
        {items.map((item) => (
          <li key={item.title + item.organization}>
            <Card className="history-card p-6 sm:p-7">
              <p className="history-type">{item.type}</p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight sm:text-xl" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
              <p className="mt-1 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
                {item.organization}{item.dates ? <><span aria-hidden="true"> · </span><span style={{ color: 'var(--accent-primary)' }}>{item.dates}</span></> : null}
              </p>
              {item.description ? <p className="mt-3 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>{item.description}</p> : null}
              {item.achievements?.length ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {item.achievements.map((a) => <li key={a}>{a}</li>)}
                </ul>
              ) : null}
            </Card>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default function ExperiencePage() {
  const [educationData, setEducationData] = useState([])
  const [experienceData, setExperienceData] = useState([])
  const [certificationData, setCertificationData] = useState(certifications)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadExperience() {
      const result = await getExperienceContent()
      if (cancelled) return

      setEducationData(result.education)
      setExperienceData(result.experience)
      setCertificationData(result.certifications)
      setLoading(false)
    }

    loadExperience()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="py-14 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Background" title="Experience & education" description="Professional experience, education, and professional development." />
        {loading ? <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading background data…</p> : null}
        {!loading ? (
          <div className="grid gap-12">
            <Timeline title="Education" items={educationData} />
            <Timeline title="Experience & activities" items={experienceData} />
            <Timeline title="Certifications" items={certificationData} />
          </div>
        ) : null}
      </Container>
    </div>
  )
}
