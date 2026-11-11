import { prisma } from "./prisma.service.js";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  featuredImage: z.string().trim().min(1).max(2048).optional(),
  liveUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
  technologyIds: z.array(z.string()).default([]),
  categoryId: z.string().optional(),
});

const projectCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  displayOrder: z.number().int().min(0).default(0),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export async function getProjects(filters?: { published?: boolean; categoryId?: string; featured?: boolean }) {
  const where: Record<string, unknown> = {};
  if (filters?.published !== undefined) where.published = filters.published;
  if (filters?.featured !== undefined) where.featured = filters.featured;
  if (filters?.categoryId) {
    where.category = { slug: filters.categoryId };
  }
  return prisma.project.findMany({
    where,
    include: { category: true, technologies: { include: { technologyRef: true } } },
    orderBy: { displayOrder: "asc" },
  });
}

export async function getProjectsByCategory(slug: string) {
  return prisma.project.findMany({
    where: { published: true, category: { slug } },
    include: { category: true, technologies: { include: { technologyRef: true } } },
    orderBy: { displayOrder: "asc" },
  });
}

export async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { featured: true, published: true },
    include: { category: true, technologies: { include: { technologyRef: true } } },
    orderBy: { displayOrder: "asc" },
  });
}

export async function getTechnologies() {
  return prisma.technology.findMany({ orderBy: { name: "asc" } });
}

export async function getProjectCategories() {
  return prisma.projectCategory.findMany({ orderBy: { displayOrder: "asc" } });
}

export async function createProjectCategory(data: unknown) {
  return prisma.projectCategory.create({ data: projectCategorySchema.parse(data) });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findFirst({
    where: { slug, published: true },
    include: { category: true, technologies: { include: { technologyRef: true } } },
  });
}

export async function createProject(data: z.infer<typeof projectSchema>) {
  const { technologyIds, categoryId, ...projectData } = projectSchema.parse(data);
  return prisma.project.create({
    data: {
      ...projectData,
      category: categoryId ? { connect: { id: categoryId } } : undefined,
      technologies: {
        create: technologyIds.map((technology) => ({ technologyRef: { connect: { id: technology } } })),
      },
    },
    include: { category: true, technologies: { include: { technologyRef: true } } },
  });
}

export async function updateProject(slug: string, data: z.infer<typeof projectSchema>) {
  const { technologyIds, categoryId, ...projectData } = projectSchema.parse(data);
  return prisma.project.update({
    where: { slug },
    data: {
      ...projectData,
      category: categoryId ? { connect: { id: categoryId } } : undefined,
      technologies: {
        deleteMany: {},
        create: technologyIds.map((technology) => ({ technologyRef: { connect: { id: technology } } })),
      },
    },
    include: { category: true, technologies: { include: { technologyRef: true } } },
  });
}

export async function deleteProject(slug: string) {
  return prisma.project.delete({ where: { slug } });
}