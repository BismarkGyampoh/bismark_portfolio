import { projects as fallbackProjects, projectCategories as fallbackProjectCategories } from '../data/projects.js'
import { skillCategories as fallbackSkillCategories, skillsPreview as fallbackSkillsPreview } from '../data/skills.js'
import { education as fallbackEducation, experience as fallbackExperience, certifications as fallbackCertifications, getTimeline as getFallbackTimeline } from '../data/experience.js'
import { posts as fallbackPosts } from '../data/blog.js'
import { creativeMedia as fallbackMedia } from '../data/creativeMedia.js'
import { resolveMediaUrl } from './api.js'

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

async function safeRequest(path, fallbackValue, options = {}) {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: { Accept: 'application/json', ...(options.headers || {}) },
    })
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`)

    const payload = await response.json()
    return payload && typeof payload === 'object' && 'data' in payload
      ? payload.data ?? fallbackValue
      : payload ?? fallbackValue
  } catch {
    return fallbackValue
  }
}

function mapProject(project) {
  return {
    ...project,
    category: project.category?.name || 'Uncategorized',
    image: project.featuredImage || '/placeholders/project-1.svg',
    imageAlt: project.title,
    summary: project.shortDescription || project.description || '',
    tags: project.technologies?.map((technology) => technology.technologyRef?.name).filter(Boolean) || [],
    liveUrl: project.liveUrl || '',
    sourceUrl: project.githubUrl || '',
    related: [],
    problem: '',
    objectives: [],
    solution: project.description || '',
    process: [],
    features: [],
    challenges: '',
    gallery: [],
    isSample: false,
  }
}

function formatYear(date) {
  if (!date) return ''
  return String(new Date(date).getFullYear())
}

function mapExperience(item) {
  const [description = '', ...achievementLines] = (item.description || '').split('\n')
  return {
    type: item.employmentType || 'Experience',
    organization: [item.company, item.location].filter(Boolean).join(' · '),
    title: item.position,
    dates: [formatYear(item.startDate), item.current ? 'Present' : formatYear(item.endDate)].filter(Boolean).join(' – '),
    description: description.replace(/\s+$/, ''),
    achievements: achievementLines.map((line) => line.replace(/^[•*-]\s*/, '').trim()).filter(Boolean),
  }
}

function mapEducation(item) {
  return {
    type: 'Education',
    organization: [item.institution, item.fieldOfStudy].filter(Boolean).join(' · '),
    title: item.qualification,
    dates: [formatYear(item.startDate), item.current ? 'Present' : formatYear(item.endDate)].filter(Boolean).join(' – '),
    description: item.description || '',
    achievements: [],
  }
}

function mapPost(post) {
  return {
    ...post,
    category: post.category?.name || '',
    date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '',
    cover: post.coverImage || '/placeholders/blog-1.svg',
    excerpt: post.excerpt || '',
    content: typeof post.content === 'string' ? post.content.split(/\n{2,}/).filter(Boolean) : [],
    featured: Boolean(post.featured),
    isSample: false,
  }
}

export async function getProfileContent() {
  return safeRequest('/profile', null)
}

export async function getProjectsContent() {
  const [records, categoryRecords] = await Promise.all([
    safeRequest('/projects', null),
    safeRequest('/projects/categories', null),
  ])
  if (!Array.isArray(records)) return { projects: fallbackProjects, categories: fallbackProjectCategories }
  if (!Array.isArray(categoryRecords)) return { projects: fallbackProjects, categories: fallbackProjectCategories }
  return {
    projects: records.map(mapProject),
    categories: ['All', ...categoryRecords.map((category) => category.name)],
  }
}

export async function getProjectContent(slug) {
  try {
    const response = await fetch(`${apiBaseUrl}/projects/${encodeURIComponent(slug)}`, {
      headers: { Accept: 'application/json' },
    })
    if (response.status === 404) return null
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
    const payload = await response.json()
    return payload?.data ? mapProject(payload.data) : null
  } catch {
    const fallback = fallbackProjects.find((project) => project.slug === slug)
    return fallback || null
  }
}

export async function getMediaContent() {
  const artwork = await safeRequest('/media', fallbackMedia)
  return Array.isArray(artwork)
    ? artwork.map((item) => ({ ...item, imageUrl: resolveMediaUrl(item.imageUrl) }))
    : fallbackMedia
}

export async function getSkillsContent() {
  const [skills, categories] = await Promise.all([
    safeRequest('/skills', null),
    safeRequest('/skills/categories', null),
  ])
  if (!Array.isArray(skills) || !Array.isArray(categories)) {
    return { categories: fallbackSkillCategories, preview: fallbackSkillsPreview }
  }
  return {
    categories: categories.map((category) => ({
      name: category.name,
      items: skills.filter((skill) => skill.categoryId === category.id).map((skill) => skill.name),
    })),
    preview: skills.slice(0, 8).map((skill) => skill.name),
  }
}

export async function getExperienceContent() {
  const [educationRecords, experienceRecords] = await Promise.all([
    safeRequest('/education', null),
    safeRequest('/experience', null),
  ])

  if (!Array.isArray(educationRecords) || !Array.isArray(experienceRecords)) {
    return {
      education: fallbackEducation,
      experience: fallbackExperience,
      certifications: fallbackCertifications,
      timeline: getFallbackTimeline(),
    }
  }

  const educationItems = educationRecords.map(mapEducation)
  const experienceItems = experienceRecords.map(mapExperience)
  const timeline = [...experienceItems, ...educationItems]

  return {
    education: educationItems,
    experience: experienceItems,
    certifications: fallbackCertifications,
    timeline,
  }
}

export async function getBlogContent() {
  const [records, categories] = await Promise.all([
    safeRequest('/blog/published', null),
    safeRequest('/blog/categories', null),
  ])
  if (!Array.isArray(records) || !Array.isArray(categories)) {
    return { posts: fallbackPosts, categories: ['All'] }
  }
  return {
    posts: Array.isArray(records) ? records.map(mapPost) : fallbackPosts,
    categories: ['All', ...categories.map((category) => category.name)],
  }
}

export async function getBlogPostContent(slug) {
  try {
    const response = await fetch(`${apiBaseUrl}/blog/${encodeURIComponent(slug)}`, {
      headers: { Accept: 'application/json' },
    })
    if (response.status === 404) return null
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
    const payload = await response.json()
    return payload?.data ? mapPost(payload.data) : null
  } catch {
    const fallback = fallbackPosts.find((post) => post.slug === slug)
    return fallback || null
  }
}

export async function getPortfolioOverview() {
  const [projectsResult, blogResult, experienceResult, skillResult] = await Promise.all([
    getProjectsContent(),
    getBlogContent(),
    getExperienceContent(),
    getSkillsContent(),
  ])

  return {
    featured: projectsResult.projects.filter((project) => project.featured).slice(0, 3),
    latest: blogResult.posts.slice(0, 2),
    timeline: experienceResult.timeline.slice(0, 2),
    skillsPreview: skillResult.preview,
  }
}

export async function submitContactMessage(values) {
  try {
    const response = await fetch(`${apiBaseUrl}/contact/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(values),
    })
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}))
      throw new Error(payload?.error?.message || `Submission failed (${response.status})`)
    }
    const payload = await response.json()
    return { success: true, data: payload?.data ?? payload }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unable to submit the message right now.',
    }
  }
}

export { apiBaseUrl }
