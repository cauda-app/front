import { PrismaClient } from '@prisma/client';
import { encodeId } from 'src/utils/hashids';
import { numberToTurn } from 'graphql/utils/turn';
import startOfToday from 'date-fns/startOfToday';

export const myPastTurns = async (clientId, prisma: PrismaClient) => {
  const issuedNumbers = await prisma.issuedNumber.findMany({
    where: {
      clientId: clientId,
      status: { in: [1, 2, 3] },
      updatedAt: { gte: startOfToday() },
    },
    orderBy: { updatedAt: 'desc' },
    take: 3,
    select: {
      id: true,
      issuedNumber: true,
      shopId: true,
      status: true,
      shopDetails: { select: { name: true } },
    },
  });

  const turns = issuedNumbers.map(async (issuedNumber) => ({
    id: encodeId(issuedNumber.id),
    rawId: issuedNumber.id,
    rawShopId: issuedNumber.shopId,
    shopId: encodeId(issuedNumber.shopId),
    status: TO_ISSUED_NUMBER_STATUS[issuedNumber.status],
    turn: numberToTurn(issuedNumber.issuedNumber),
    shopName: issuedNumber.shopDetails.name,
  }));

  return turns;
};

export const myTurns = async (clientId, prisma: PrismaClient) => {
  const issuedNumbers = await prisma.issuedNumber.findMany({
    where: { clientId: clientId, status: 0 },
    select: {
      id: true,
      shopId: true,
      issuedNumber: true,
      shopDetails: { select: { name: true } },
    },
  });

  const turns = issuedNumbers.map((issuedNumber) => ({
    id: encodeId(issuedNumber.id),
    rawId: issuedNumber.id,
    rawShopId: issuedNumber.shopId,
    shopId: encodeId(issuedNumber.shopId),
    status: TO_ISSUED_NUMBER_STATUS[ISSUED_NUMBER_STATUS.PENDING],
    turn: numberToTurn(issuedNumber.issuedNumber),
    shopName: issuedNumber.shopDetails.name,
  }));

  return turns;
};

export const ISSUED_NUMBER_STATUS = {
  PENDING: 0,
  ATTENDED: 1,
  SKIPPED: 2,
  CANCELLED: 3,
};

export const TO_ISSUED_NUMBER_STATUS = {
  0: 'PENDING',
  1: 'ATTENDED',
  2: 'SKIPPED',
  3: 'CANCELLED',
};
