import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn'] });

export interface Context {
  prisma: PrismaClient;
}

export function createContext(): Context {
  return { prisma };
}
