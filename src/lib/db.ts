import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient | null = null;

try {
  prismaInstance = globalForPrisma.prisma || new PrismaClient();
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaInstance;
} catch (err) {
  console.warn('[DB] Prisma client initialization failed. Database features will be disabled.', err);
}

export const prisma = prismaInstance;

export function isDbReady() {
  return !!prismaInstance;
}
