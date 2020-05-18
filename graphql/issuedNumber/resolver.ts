import { ApolloError } from 'apollo-server-core';
import { Context } from 'graphql/context';
import {
  MutationRequestTurnArgs,
  MutationCancelTurnArgs,
  QueryTurnArgs,
} from '../../graphql.d';
import { decodeId } from 'src/utils/hashids';
import { myTurns, ISSUED_NUMBER_STATUS, myPastTurns } from './helpers';
import { numberToTurn } from 'graphql/utils/turn';

const getPendingTurns = (clientId: number, shopId: number, ctx: Context) =>
  ctx.prisma.issuedNumber.findMany({
    where: {
      clientId: clientId,
      shopId: shopId,
      status: 0,
    },
  });

const IssuedNumberResolver = {
  Query: {
    myPastTurns: async (parent, args: any, ctx: Context) => {
      if (!ctx.tokenInfo?.isValid) {
        return new ApolloError('Invalid token', 'INVALID_TOKEN');
      }

      return myPastTurns(ctx.tokenInfo.clientId, ctx.prisma);
    },
    myTurns: async (parent, args: any, ctx: Context) => {
      if (!ctx.tokenInfo?.isValid) {
        return new ApolloError('Invalid token', 'INVALID_TOKEN');
      }

      return myTurns(ctx.tokenInfo.clientId, ctx.prisma);
    },
    turn: async (parent, args: QueryTurnArgs, ctx: Context) => {
      if (!ctx.tokenInfo?.isValid) {
        return new ApolloError('Invalid token', 'INVALID_TOKEN');
      }

      const turnId = decodeId(args.turnId);

      if (!turnId) {
        return new ApolloError('Invalid turn id', 'INVALID_TURN_ID');
      }

      const issuedNumber = await ctx.prisma.issuedNumber.findOne({
        where: { id: turnId as number },
        select: {
          issuedNumber: true,
          clientId: true,
          status: true,
          shopDetails: { select: { name: true } },
        },
      });

      if (!issuedNumber || issuedNumber.clientId !== ctx.tokenInfo.clientId) {
        return new ApolloError('Turn not found', 'TURN_NOT_FOUND');
      }

      return {
        id: args.turnId,
        shopName: issuedNumber.shopDetails.name,
        turn: numberToTurn(issuedNumber.issuedNumber),
        status: issuedNumber.status,
      };
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
      const shopId = decodeId(args.shopId) as number;

      if (!shopId) {
        return new ApolloError('Invalid shop id', 'INVALID_SHOP_ID');
      }

      let appointments = await getPendingTurns(
        ctx.tokenInfo.clientId,
        shopId,
        ctx
      );

      if (appointments.length) {
        return new ApolloError(
          'There is already a pending turn',
          'ACTIVE_TURN'
        );
      }

      const rawQuery = `CALL increaseShopCounter(${shopId}, ${ctx.tokenInfo.clientId});`;
      await ctx.prisma.raw(rawQuery);

      appointments = await getPendingTurns(ctx.tokenInfo.clientId, shopId, ctx);
      if (!appointments.length) {
        return new ApolloError(
          'There was an error trying to set the appointment.',
          'OP_ERROR'
        );
      }

      return {
        id: appointments[0].id,
        pendingTurnsAmount: appointments.length++,
      };
    },
    cancelTurn: async (parent, args: MutationCancelTurnArgs, ctx: Context) => {
      if (!ctx.tokenInfo?.isValid) {
        return new ApolloError('Invalid token', 'INVALID_TOKEN');
      }

      if (!ctx.tokenInfo?.clientId) {
        return new ApolloError('No client id', 'NO_CLIENT_ID');
      }

      const id = decodeId(args.turnId);

      if (!id) {
        return new ApolloError('Invalid id', 'INVALID_TURN_ID');
      }

      const issuedNumber = await ctx.prisma.issuedNumber.findOne({
        where: { id: id as number },
        select: { clientId: true },
      });

      if (!issuedNumber) {
        return new ApolloError('Turn not found', 'TURN_NOT_FOUND');
      }

      if (issuedNumber.clientId !== ctx.tokenInfo.clientId) {
        return new ApolloError('Invalid client', 'INVALID_CLIENT_ID');
      }

      await ctx.prisma.issuedNumber.update({
        where: {
          id: id as number,
        },
        data: {
          status: 3,
        },
        select: { id: true },
      });

      return true;
    },
  },
  IssuedNumber: {},
  IssuedNumberStatus: ISSUED_NUMBER_STATUS,
};

export default IssuedNumberResolver;
