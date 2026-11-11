import { prisma } from "./prisma.service.js";
import { z } from "zod";

const educationSchema = z.object({
  institution: z.string().min(1).max(200),
  qualification: z.string().min(1).max(200),
  fieldOfStudy: z.string().optional(),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  current: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
});

export type EducationFormValues = z.infer<typeof educationSchema>;

export async function getEducations(currentOnly?: boolean) {
  const where = currentOnly ? { current: true } : {};
  return prisma.education.findMany({ where, orderBy: { displayOrder: "asc" } });
}

export async function getEducationById(id: string) {
  return prisma.education.findUnique({ where: { id } });
}

export async function createEducation(data: z.infer<typeof educationSchema>) {
  return prisma.education.create({ data });
}

export async function updateEducation(id: string, data: z.infer<typeof educationSchema>) {
  return prisma.education.update({ where: { id }, data });
}

export async function deleteEducation(id: string) {
  return prisma.education.delete({ where: { id } });
}