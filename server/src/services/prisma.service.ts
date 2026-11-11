/**
 * Prisma Client Singleton
 *
 * Ensures a single Prisma client instance is used throughout the application,
 * preventing unnecessary database connections during development.
 */

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

function getPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV === 'development') {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
      console.log('🔗 Prisma Client initialized (development mode)');
    }
    return global.prisma;
  }

  return new PrismaClient();
}

export const prisma = getPrismaClient();

export async function disconnectPrisma(): Promise<void> {
  if (process.env.NODE_ENV !== 'test' && global.prisma) {
    await global.prisma.$disconnect();
    console.log('🔌 Prisma Client disconnected');
  }
}

export async function connectPrisma(): Promise<void> {
  try {
    if (process.env.NODE_ENV !== 'test' && global.prisma) {
      await global.prisma.$connect();
      console.log('✅ Prisma Client connected to database');
    }
  } catch (error) {
    console.error('❌ Prisma Client connection error:', error);
    throw error;
  }
}
