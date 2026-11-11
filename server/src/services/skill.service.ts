import { prisma } from "./prisma.service.js";
import { z } from "zod";

const skillCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).min(1),
  displayOrder: z.number().int().min(0).default(0),
});

const skillSchema = z.object({
  name: z.string().min(1).max(100),
  categoryId: z.string().min(1),
  proficiency: z.string().optional(),
  icon: z.string().url().optional(),
  displayOrder: z.number().int().min(0).default(0),
});

export type SkillCategoryFormValues = z.infer<typeof skillCategorySchema>;
export type SkillFormValues = z.infer<typeof skillSchema>;

export async function getSkillCategories() {
  return prisma.skillCategory.findMany({ orderBy: { displayOrder: "asc" } });
}

export async function getSkillsByCategory(categoryId: string) {
  return prisma.skill.findMany({
    where: categoryId ? { categoryId } : undefined,
    include: { category: true },
    orderBy: [{ category: { displayOrder: "asc" } }, { displayOrder: "asc" }],
  });
}

export async function getSkillById(id: string) {
  return prisma.skill.findUnique({ where: { id } });
}

export async function createSkill(data: z.infer<typeof skillSchema>) {
  const { categoryId, ...skillData } = data;
  return prisma.skill.create({
    data: { ...skillData, category: { connect: { id: categoryId } } },
  });
}

export async function updateSkill(id: string, data: z.infer<typeof skillSchema>) {
  const { categoryId, ...skillData } = data;
  return prisma.skill.update({
    where: { id },
    data: { ...skillData, category: { connect: { id: categoryId } } },
  });
}

export async function deleteSkill(id: string) {
  return prisma.skill.delete({ where: { id } });
}

export async function createSkillCategory(data: z.infer<typeof skillCategorySchema>) {
  return prisma.skillCategory.create({ data });
}