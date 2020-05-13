import { TokenInfo } from './utils/jwt';
import prisma from 'prisma/client';

export type Context = {
  res: any;
  req: any;
  tokenInfo?: TokenInfo;
  prisma: typeof prisma;
};
