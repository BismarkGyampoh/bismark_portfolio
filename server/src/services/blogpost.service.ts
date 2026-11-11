import { prisma } from "./prisma.service.js";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

const blogCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).min(1),
});

const blogPostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).min(1),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  coverImage: z.string().trim().min(1).max(2048).optional(),
  published: z.boolean().default(true),
  publishedAt: z.coerce.date().optional(),
  categoryId: z.string().optional(),
});

export type BlogCategoryFormValues = z.infer<typeof blogCategorySchema>;
export type BlogPostFormValues = z.infer<typeof blogPostSchema>;

export async function getBlogCategories() {
  return prisma.blogCategory.findMany();
}

export async function createBlogCategory(data: z.infer<typeof blogCategorySchema>) {
  return prisma.blogCategory.create({ data });
}

export async function getBlogPosts(published?: boolean, categoryId?: string) {
  const where: Prisma.BlogPostWhereInput = {
    ...(published !== undefined ? {
      published,
      ...(published ? { publishedAt: { lte: new Date() } } : {}),
    } : {}),
    ...(categoryId && { category: { slug: categoryId } }),
  };
  return prisma.blogPost.findMany({
    where,
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, published: true, publishedAt: { lte: new Date() } },
    include: { category: true },
  });
}

export async function createBlogPost(data: z.infer<typeof blogPostSchema>) {
  const parsed = blogPostSchema.parse(data);
  return prisma.blogPost.create({ data: parsed, include: { category: true } });
}

export async function updateBlogPost(slug: string, data: z.infer<typeof blogPostSchema>) {
  const parsed = blogPostSchema.parse(data);
  return prisma.blogPost.update({ where: { slug }, data: parsed, include: { category: true } });
}

export async function deleteBlogPost(slug: string) {
  return prisma.blogPost.delete({ where: { slug } });
}

export async function getPublishedBlogPosts() {
  return prisma.blogPost.findMany({
    where: { published: true, publishedAt: { lte: new Date() } },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });
}