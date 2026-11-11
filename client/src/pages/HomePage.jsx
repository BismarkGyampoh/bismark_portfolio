import { useEffect, useState } from 'react'
import { ArrowDownRight, ArrowRight, Download, MoveUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext.jsx'
import { Button, Container, SectionHeading } from '../components/ui.jsx'
import { BlogCard, ProjectCard } from '../components/cards.jsx'
import { getPortfolioOverview } from '../services/portfolio.js'

export default function HomePage() {
  const profile = useProfile()
  const [featured, setFeatured] = useState([])
  const [latest, setLatest] = useState([])
  const [timeline, setTimeline] = useState([])
  const [skills, setSkills] = useState([])

  useEffect(() => {
    let cancelled = false

    async function loadOverview() {
      const result = await getPortfolioOverview()
      if (cancelled) return

      setFeatured(result.featured)
      setLatest(result.latest)
      setTimeline(result.timeline)
      setSkills(result.skillsPreview)
    }

    loadOverview()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="home-page">
      <section className="home-hero">
        <Container className="home-hero-grid">
          <div className="home-hero-copy">
            <p className="eyebrow">Portfolio · {profile.location}</p>
            <h1 className="display-type home-title">{profile.name}</h1>
            <p className="home-roles">{profile.headline}</p>
            <p className="home-intro">{profile.introduction}</p>
            <div className="home-actions">
              <Button to="/projects" variant="primary">Selected work <ArrowRight size={16} /></Button>
              <Button to="/contact" variant="ghost">Get in touch <ArrowDownRight size={17} /></Button>
            </div>
            <div className="home-socials" aria-label="Social profiles">
              {profile.socials.filter((social) => social.url).map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target={social.url.startsWith('http') ? '_blank' : undefined}
                  rel={social.url.startsWith('http') ? 'noreferrer' : undefined}
                >
                  {social.label}<MoveUpRight size={13} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <figure className="home-portrait">
            <img src={profile.imagePath} alt={`Portrait of ${profile.name}`} fetchPriority="high" />
            <figcaption><span>01</span> {profile.title}</figcaption>
          </figure>
        </Container>
      </section>

      <section className="home-introduction">
        <Container className="home-introduction-grid">
          <div className="section-index">
            <span className="eyebrow">01 / About</span>
            <h2 className="display-type">Technology is most useful when it works for people.</h2>
          </div>
          <div className="introduction-copy">
            <p>{profile.aboutShort}</p>
            <Link className="text-link" to="/about">A little more about me <ArrowRight size={15} /></Link>
          </div>
        </Container>
      </section>

      <section className="home-work" id="work">
        <Container>
          <div className="section-heading-row">
            <SectionHeading eyebrow="02 / Selected work" title="Projects & initiatives" description="A selection of web and creative work." />
            <Button to="/projects" variant="ghost" className="section-more">All projects <ArrowRight size={15} /></Button>
          </div>
          <div className="home-project-grid">
            {featured.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index + 1} />
            ))}
          </div>
        </Container>
      </section>

      <section className="home-background">
        <Container className="home-background-grid">
          <div>
            <p className="eyebrow">03 / What I bring</p>
            <h2 className="display-type background-title">A practical mix of technical and creative skills.</h2>
            <div className="home-skills">
              {skills.map((skill) => <span key={skill}>{skill}</span>)}
            </div>
            <Link className="text-link" to="/skills">Explore skills <ArrowRight size={15} /></Link>
          </div>
          <div className="home-timeline">
            <p className="eyebrow">Experience & education</p>
            {timeline.map((item) => (
              <article className="timeline-preview" key={`${item.type}-${item.title}`}>
                <span className="timeline-dot" aria-hidden="true" />
                <div>
                  <p className="timeline-label">{item.type}{item.dates ? ` · ${item.dates}` : ''}</p>
                  <h3>{item.title}</h3>
                  <p>{item.organization}</p>
                </div>
              </article>
            ))}
            <Link className="text-link" to="/experience">Full background <ArrowRight size={15} /></Link>
          </div>
        </Container>
      </section>

      <section className="home-writing">
        <Container className="home-writing-inner">
          <div>
            <p className="eyebrow">04 / Notes</p>
            <h2 className="display-type">Ideas from the work.</h2>
            <p className="writing-copy">Occasional writing on technology, systems, and creative practice.</p>
            <Button to="/blog" variant="ghost">Visit the blog <ArrowRight size={15} /></Button>
          </div>
          {latest.length ? (
            <div className="home-writing-cards">
              {latest.map((post) => <BlogCard key={post.slug} post={post} />)}
            </div>
          ) : (
            <p className="writing-note">New writing will appear here.</p>
          )}
        </Container>
      </section>

      <section className="home-contact">
        <Container className="home-contact-inner">
          <div>
            <p className="eyebrow">Have a project or a question?</p>
            <h2 className="display-type">Let’s make something useful.</h2>
          </div>
          <div className="home-contact-actions">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <Button to="/contact" variant="primary">Contact me <ArrowRight size={16} /></Button>
            {profile.cvAvailable ? (
              <a className="resume-link" href={profile.cvPath} download="Bismark-Gyampoh-Resume.pdf">
                <Download size={15} /> Résumé
              </a>
            ) : null}
          </div>
        </Container>
      </section>
    </div>
  )
}
