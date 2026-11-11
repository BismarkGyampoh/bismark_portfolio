import { z } from "zod";
import { prisma } from "./prisma.service.js";

const socialLinkSchema = z.object({
  label: z.string().trim().min(1).max(80),
  url: z.string().trim().max(2048).optional().default(""),
  handle: z.string().trim().max(160).optional().default(""),
});

export const profileSchema = z.object({
  name: z.string().trim().min(1).max(160),
  title: z.string().trim().min(1).max(200),
  headline: z.string().trim().min(1).max(300),
  introduction: z.string().trim().min(1).max(3000),
  aboutShort: z.string().trim().min(1).max(2000),
  aboutLong: z.array(z.string().trim().min(1).max(3000)).max(20),
  interests: z.array(z.string().trim().min(1).max(160)).max(40),
  philosophy: z.string().trim().min(1).max(2000),
  location: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(254),
  whatsapp: z.string().trim().max(40),
  whatsappUrl: z.string().trim().max(2048),
  imagePath: z.string().trim().max(2048),
  cvPath: z.string().trim().max(2048),
  socials: z.array(socialLinkSchema).max(30),
});

export async function getSiteProfile() {
  const profile = await prisma.siteProfile.findUnique({ where: { id: "default" } });
  if (!profile) return null;
  return {
    ...profile,
    aboutLong: profile.aboutLong.split("\n").filter(Boolean),
    interests: profile.interests.split("\n").filter(Boolean),
  };
}

export async function updateSiteProfile(input: unknown) {
  const parsed = profileSchema.parse(input);
  const data = {
    ...parsed,
    aboutLong: parsed.aboutLong.join("\n"),
    interests: parsed.interests.join("\n"),
  };
  const profile = await prisma.siteProfile.upsert({
    where: { id: "default" },
    create: { id: "default", ...data },
    update: data,
  });
  return {
    ...profile,
    aboutLong: profile.aboutLong.split("\n").filter(Boolean),
    interests: profile.interests.split("\n").filter(Boolean),
  };
}
