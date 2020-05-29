import { PrismaClient } from '@prisma/client';

const createPrismaClient = () =>
  new PrismaClient({ log: ['query', 'info', 'warn'] });
export default createPrismaClient;
