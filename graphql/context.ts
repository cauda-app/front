import { TokenInfo } from './utils/jwt';
import { PrismaClient } from '@prisma/client';

export type Context = {
  res: any;
  req: any;
  tokenInfo?: TokenInfo;
  prisma: PrismaClient;
};
