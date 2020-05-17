import { encodeId } from 'src/utils/hashids';
import { numberToTurn } from 'graphql/utils/turn';

export const myTurns = async (clientId, prisma) => {
  const issuedNumbers = await prisma.issuedNumber.findMany({
    where: { clientId: clientId, status: 0 },
    select: {
      id: true,
      issuedNumber: true,
      shopDetails: { select: { name: true } },
    },
  });

  const turns = issuedNumbers.map((issuedNumber) => ({
    id: encodeId(issuedNumber.id),
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
