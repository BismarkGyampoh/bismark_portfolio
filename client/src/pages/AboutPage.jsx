import { useProfile } from '../context/ProfileContext.jsx'
import { Button, Container, SectionHeading } from '../components/ui.jsx'

export default function AboutPage() {
  const profile = useProfile()
  return (
    <div className="py-14 sm:py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="about-portrait image-frame">
            <img src={profile.imagePath} alt={`Portrait of ${profile.name}`} className="aspect-[4/5] w-full object-cover" />
          </div>
          <div>
            <SectionHeading eyebrow="About" title="Information systems, technology, and creative work." description={profile.introduction} />
            <div className="space-y-5 text-base leading-8" style={{ color: 'var(--text-secondary)' }}>
              {profile.aboutLong.map((p) => <p key={p}>{p}</p>)}
            </div>
            <div className="about-philosophy mt-8 border-y py-5">
              <h3 className="eyebrow">Working philosophy</h3>
              <p className="mt-2 leading-7" style={{ color: 'var(--text-secondary)' }}>{profile.philosophy}</p>
            </div>
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>Areas of interest</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {profile.interests.map((i) => <li key={i} className="interest-item border px-3 py-2 text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>{i}</li>)}
              </ul>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button as="a" href={profile.cvPath} download="Bismark-Gyampoh-Resume.pdf" variant="primary">Download CV</Button>
              <Button to="/contact" variant="secondary">Contact</Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
