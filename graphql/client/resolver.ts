import { ApolloError } from 'apollo-server-core';

import { Context } from '../../pages_/api/graphql';
import {
  Client,
  MutationRequestTurnArgs,
  MutationCancelTurnArgs,
} from '../../graphql';
import { numberToTurn } from '../utils/turn';
//import { ar } from 'date-fns/locale';

const getPendingTurns = (clientId: number, shopId: string, ctx: Context) =>
  ctx.prisma.issuedNumber.findMany({
    where: {
      clientId: clientId,
      shopId: shopId,
      status: 0,
    },
  });

const clientResolver = {
  Query: {
    myTurns: async (parent: Client, args, ctx: Context) => {
      const pendingTurns = await ctx.prisma.issuedNumber.findMany({
        where: { clientId: ctx.tokenInfo?.clientId },
      });

      if (!pendingTurns.length) {
        return [];
      }

      const shops = await ctx.prisma.shopDetails.findMany({
        select: {
          name: true,
          shopId: true,
        },
        where: { shopId: { in: pendingTurns.map((e) => e.shopId) } },
      });

      const res = shops.map((e) => {
        const turn = pendingTurns.find((t) => e.shopId === t.shopId);

        return {
          shopId: e.shopId,
          shopName: e.name,
          turnInfo: {
            id: turn!.id,
            status: turn!.status,
            turn: numberToTurn(turn!.issuedNumber),
          },
        };
      });

      return res;
    },
  },
  Mutation: {
    requestTurn: async (
      parent,
      args: MutationRequestTurnArgs,
      ctx: Context
    ) => {
      if (!ctx.tokenInfo?.clientId) {
        return new ApolloError('Client Id not provided', 'INVALID_CLIENT_ID');
      }

      let appointments = await getPendingTurns(
        ctx.tokenInfo.clientId,
        args.shopId,
        ctx
      );

      if (appointments.length) {
        return new ApolloError(
          'There is already a pending turn',
          'ACTIVE_TURN'
        );
      }

      const rawQuery = `CALL increaseShopCounter("${args.shopId}", ${ctx.tokenInfo.clientId});`;
      await ctx.prisma.raw(rawQuery);

      appointments = await getPendingTurns(
        ctx.tokenInfo.clientId,
        args.shopId,
        ctx
      );
      if (!appointments.length) {
        return new ApolloError(
          'There was an error trying to set the appointment.',
          'OP_ERROR'
        );
      }

      return appointments[0];
    },
    cancelTurn: async (parent, args: MutationCancelTurnArgs, ctx: Context) => {
      await ctx.prisma.issuedNumber.update({
        where: {
          id: Number(args.turnId),
          clientId: ctx.tokenInfo?.clientId,
        },
        data: {
          status: 3,
        },
      });

      return true;
    },
  },
};

export default clientResolver;
