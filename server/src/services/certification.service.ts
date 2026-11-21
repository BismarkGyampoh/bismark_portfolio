import { z } from "zod";
import { prisma } from "./prisma.service.js";

const certificationSchema = z.object({
  name: z.string().trim().min(1).max(200),
  issuer: z.string().trim().min(1).max(200),
  credentialId: z.string().trim().max(200).optional(),
  credentialUrl: z.string().trim().max(2048).refine((value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  }, "Credential URL must use HTTP or HTTPS.").optional(),
  description: z.string().trim().max(3000).optional(),
  issuedAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date().optional(),
  displayOrder: z.number().int().min(0).max(10000).default(0),
});

export async function getCertifications() {
  return prisma.certification.findMany({
    orderBy: [{ displayOrder: "asc" }, { issuedAt: "desc" }],
  });
}

export async function createCertification(input: unknown) {
  return prisma.certification.create({ data: certificationSchema.parse(input) });
}

export async function updateCertification(id: string, input: unknown) {
  return prisma.certification.update({ where: { id }, data: certificationSchema.parse(input) });
}

export async function deleteCertification(id: string) {
  return prisma.certification.delete({ where: { id } });
}

export { certificationSchema };
