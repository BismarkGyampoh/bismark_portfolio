import { z } from "zod";
import { prisma } from "./prisma.service.js";
import { unlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const uploadDirectory = fileURLToPath(new URL("../../uploads/media/", import.meta.url));

async function removeManagedUpload(imageUrl: string) {
  const match = /^\/uploads\/media\/([a-f0-9-]+\.(?:jpg|png|webp))$/.exec(imageUrl);
  if (!match) return;

  try {
    await unlink(join(uploadDirectory, match[1]));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return;
    console.error("Unable to remove artwork image:", error);
  }
}

const imageUrlSchema = z.string().trim().min(1).max(2048).refine((value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return value.startsWith("/") && !value.startsWith("//") && !value.split("/").includes("..");
  }
}, "Image URL must be an HTTP(S) URL or a site-relative path.");

export const artworkSchema = z.object({
  title: z.string().trim().min(1).max(160),
  altText: z.string().trim().min(1).max(500),
  imageUrl: imageUrlSchema,
  displayOrder: z.number().int().min(0).max(10000).default(0),
  published: z.boolean().default(true),
});

export type ArtworkInput = z.infer<typeof artworkSchema>;

export async function getPublishedArtwork() {
  return prisma.mediaArtwork.findMany({
    where: { published: true },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
  });
}

export async function getAllArtwork() {
  return prisma.mediaArtwork.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
  });
}

export async function createArtwork(input: unknown) {
  const data = artworkSchema.parse(input);
  return prisma.mediaArtwork.create({ data });
}

export async function updateArtwork(id: string, input: unknown) {
  const data = artworkSchema.parse(input);
  const existing = await prisma.mediaArtwork.findUniqueOrThrow({ where: { id } });
  const updated = await prisma.mediaArtwork.update({ where: { id }, data });
  if (existing.imageUrl !== updated.imageUrl) await removeManagedUpload(existing.imageUrl);
  return updated;
}

export async function deleteArtwork(id: string) {
  const artwork = await prisma.mediaArtwork.delete({ where: { id } });
  await removeManagedUpload(artwork.imageUrl);
  return artwork;
}
