import { ISSUED_NUMBER_STATUS } from './helpers';
import { Context } from 'graphql/context';
import { lastTurns } from 'graphql/shop/helpers';

const IssuedNumberResolver = {
  Query: {},
  Mutation: {},
  IssuedNumber: {},
  TurnResponse: {
    lastTurns: async (parent, args: any, ctx: Context) => {
      return lastTurns(ctx.prisma, parent.rawShopId, parent.rawId);
    },
  },
  IssuedNumberStatus: ISSUED_NUMBER_STATUS,
};

export default IssuedNumberResolver;
