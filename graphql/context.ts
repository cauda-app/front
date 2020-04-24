import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface Context {
  res: any,
  req: any,
  prisma: PrismaClient
}

export function createContext(): Context {
  return { prisma }
}
