import { prisma } from "./prisma.service.js";
import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email("Valid email required").max(254),
  subject: z.string().trim().min(1).max(150),
  message: z.string().trim().min(10).max(5000),
});

export type ContactMessageFormValues = z.infer<typeof contactMessageSchema>;

export async function getContactMessages(unreadOnly?: boolean) {
  const where = unreadOnly ? { read: false } : {};
  return prisma.contactMessage.findMany({ where, orderBy: { createdAt: "desc" } });
}

export async function getContactMessageById(id: string) {
  return prisma.contactMessage.findUnique({ where: { id } });
}

export async function createContactMessage(data: z.infer<typeof contactMessageSchema>) {
  return prisma.contactMessage.create({
    data: { ...data, read: false },
    select: { id: true },
  });
}

export async function updateMessageReadStatus(id: string, read: boolean) {
  return prisma.contactMessage.update({
    where: { id },
    data: { read },
  });
}

export async function countUnreadMessages() {
  return prisma.contactMessage.count({ where: { read: false } });
}