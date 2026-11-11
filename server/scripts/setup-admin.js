import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in the environment or server/.env");
  }

  const existingAdmin = await prisma.adminUser.findUnique({ where: { email } });
  if (existingAdmin) {
    throw new Error(`Administrator with email "${email}" already exists`);
  }

  const passwordHash = await argon2.hash(password);
  await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
      name: process.env.ADMIN_NAME?.trim() || "Administrator",
      role: "admin",
      isActive: true,
    },
  });

  console.log(`Administrator account created for ${email}`);
}

main()
  .catch((error) => {
    console.error("Failed to create administrator account:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
