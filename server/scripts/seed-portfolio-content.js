import { fileURLToPath } from 'node:url'
import { PrismaClient } from '@prisma/client'
import { profile } from '../../client/src/data/profile.js'
import { projects } from '../../client/src/data/projects.js'
import { skillCategories } from '../../client/src/data/skills.js'
import { education, experience } from '../../client/src/data/experience.js'

const prisma = new PrismaClient()

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function seedProfile() {
  await prisma.siteProfile.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      name: profile.name,
      title: profile.title,
      headline: profile.headline,
      introduction: profile.introduction,
      aboutShort: profile.aboutShort,
      aboutLong: profile.aboutLong.join('\n'),
      interests: profile.interests.join('\n'),
      philosophy: profile.philosophy,
      location: profile.location,
      email: profile.email,
      whatsapp: profile.whatsapp,
      whatsappUrl: profile.whatsappUrl,
      imagePath: profile.imagePath,
      cvPath: profile.cvPath,
      socials: profile.socials,
    },
    update: {},
  })
}

async function seedProjects() {
  const categoryIds = new Map()
  for (const project of projects) {
    let category = await prisma.projectCategory.findUnique({ where: { slug: slugify(project.category) } })
    if (!category) {
      category = await prisma.projectCategory.create({
        data: { name: project.category, slug: slugify(project.category) },
      })
    }
    categoryIds.set(project.category, category.id)

    const technologyIds = []
    for (const name of project.tags || []) {
      const slug = slugify(name)
      const technology = await prisma.technology.upsert({
        where: { slug },
        create: { name, slug },
        update: { name },
      })
      technologyIds.push(technology.id)
    }

    await prisma.project.upsert({
      where: { slug: project.slug },
      create: {
        title: project.title,
        slug: project.slug,
        shortDescription: project.summary,
        description: project.solution || project.summary,
        featuredImage: project.image,
        liveUrl: project.liveUrl || null,
        githubUrl: project.sourceUrl || null,
        featured: project.featured,
        published: true,
        category: { connect: { id: category.id } },
        technologies: {
          create: technologyIds.map((id) => ({ technologyRef: { connect: { id } } })),
        },
      },
      update: {},
    })
  }
}

async function seedSkills() {
  for (const [index, category] of skillCategories.entries()) {
    const slug = slugify(category.name)
    const savedCategory = await prisma.skillCategory.upsert({
      where: { slug },
      create: { name: category.name, slug, displayOrder: index },
      update: { name: category.name, displayOrder: index },
    })
    for (const [displayOrder, name] of category.items.entries()) {
      const existing = await prisma.skill.findFirst({
        where: { categoryId: savedCategory.id, name },
      })
      if (!existing) {
        await prisma.skill.create({
          data: { name, categoryId: savedCategory.id, displayOrder },
        })
      }
    }
  }
}

function yearDate(year) {
  return year ? new Date(`${year}-01-01T00:00:00.000Z`) : undefined
}

async function seedExperience() {
  for (const [displayOrder, item] of experience.entries()) {
    const startYear = item.dates.match(/\b(20\d{2})\b/)?.[1]
    const endYear = item.dates.match(/–\s*(20\d{2})/)?.[1]
    const existing = await prisma.experience.findFirst({
      where: { company: item.organization.split(' · ')[0], position: item.title },
    })
    if (existing) continue
    const data = {
      company: item.organization.split(' · ')[0],
      position: item.title,
      employmentType: item.type.toLowerCase().includes('intern') ? 'internship' : 'contract',
      location: item.organization.split(' · ').slice(1).join(' · ') || null,
      description: [item.description, ...(item.achievements || []).map((achievement) => `• ${achievement}`)].filter(Boolean).join('\n'),
      startDate: yearDate(startYear),
      endDate: endYear ? yearDate(endYear) : undefined,
      current: item.dates.includes('Present'),
      displayOrder,
    }
    await prisma.experience.create({ data })
  }
}

async function seedEducation() {
  for (const [displayOrder, item] of education.entries()) {
    const parts = item.organization.split(' · ')
    const startYear = item.dates.match(/\b(20\d{2})\b/)?.[1]
    const endYear = item.dates.match(/–\s*(20\d{2})/)?.[1]
    const existing = await prisma.education.findFirst({
      where: { institution: parts[0], qualification: item.title },
    })
    if (existing) continue
    const data = {
      institution: parts[0],
      qualification: item.title,
      fieldOfStudy: item.title.startsWith('BSc.') ? 'Information Systems and Technology' : null,
      description: item.description || null,
      startDate: yearDate(startYear),
      endDate: endYear ? yearDate(endYear) : undefined,
      current: item.dates.includes('Present'),
      displayOrder,
    }
    await prisma.education.create({ data })
  }
}

async function main() {
  await seedProfile()
  await seedProjects()
  await seedSkills()
  await seedExperience()
  await seedEducation()
  console.log('Initial portfolio content is present; existing edited records were preserved.')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
    .catch((error) => {
      console.error('Unable to seed portfolio content:', error)
      process.exitCode = 1
    })
    .finally(async () => prisma.$disconnect())
}
