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
