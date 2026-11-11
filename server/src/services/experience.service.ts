import { prisma } from "./prisma.service.js";
import { z } from "zod";

const experienceSchema = z.object({
  company: z.string().min(1).max(200),
  position: z.string().min(1).max(200),
  employmentType: z.string().optional().refine(
    (val) => !val || ["full-time", "part-time", "contract", "internship", "volunteer"].includes(val),
    "Invalid employment type"
  ),
  location: z.string().optional(),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  current: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;

export async function getExperiences(currentOnly?: boolean) {
  const where = currentOnly ? { current: true } : {};
  return prisma.experience.findMany({ where, orderBy: { displayOrder: "asc" } });
}

export async function getExperienceById(id: string) {
  return prisma.experience.findUnique({ where: { id } });
}

export async function createExperience(data: z.infer<typeof experienceSchema>) {
  return prisma.experience.create({ data });
}

export async function updateExperience(id: string, data: z.infer<typeof experienceSchema>) {
  return prisma.experience.update({ where: { id }, data });
}

export async function deleteExperience(id: string) {
  return prisma.experience.delete({ where: { id } });
}