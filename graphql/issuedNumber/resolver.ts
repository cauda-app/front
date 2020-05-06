import { ApolloError } from 'apollo-server-core';
import { Context } from '../../pages_/api/graphql';
import {
  MutationRequestTurnArgs,
  MutationCancelTurnArgs,
  QueryGetTurnsArgs,
} from '../../graphql';

const getPendingTurns = (clientId: number, shopId: string, ctx: Context) =>
  ctx.prisma.issuedNumber.findMany({
    where: {
      clientId: clientId,
      shopId: shopId,
      status: 0,
    },
  });

const IssuedNumberResolver = {
  Query: {
    getTurns: (parent, args: QueryGetTurnsArgs, ctx: Context) => {
      const where: any = { clientId: args.clientId };
      if (args.shopId) {
        where.shopId = args.shopId;
      }
      return ctx.prisma.issuedNumber.findMany({
        where,
      });
    },
  },
  Mutation: {
    requestTurn: async (
      parent,
      args: MutationRequestTurnArgs,
      ctx: Context
    ) => {
      let appointments = await getPendingTurns(args.clientId, args.shopId, ctx);

      if (appointments.length) {
        return new ApolloError(
          'There is already a pending appointment',
          'ACTIVE_APPOINTMENT'
        );
      }

      const rawQuery = `CALL increaseShopCounter("${args.shopId}", ${args.clientId});`;
      console.log(rawQuery);
      await ctx.prisma.raw(rawQuery);

      appointments = await getPendingTurns(args.clientId, args.shopId, ctx);
      if (!appointments.length) {
        return new ApolloError(
          'There was an error trying to set the appointment.',
          'OP_ERROR'
        );
      }
      console.log(appointments);
      return appointments[0];
    },
    cancelTurn: async (parent, args: MutationCancelTurnArgs, ctx: Context) => {
      let appointments = await getPendingTurns(args.clientId, args.shopId, ctx);

      if (!appointments.length) {
        return new ApolloError(
          'There is no pending appointment.',
          'APPOINtMENT_NOT_EXISTS'
        );
      }

      await ctx.prisma.issuedNumber.update({
        where: {
          id: appointments[0].id,
        },
        data: {
          status: 3,
        },
      });

      return true;
    },
  },
  IssuedNumber: {},
  IssuedNumberStatus: {
    PENDING: 0,
    ATTENDED: 1,
    SKIPPED: 2,
    CANCELLED: 3,
  },
};

export default IssuedNumberResolver;
