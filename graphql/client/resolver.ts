import { ApolloError } from 'apollo-server-core';
import * as Sentry from '@sentry/node';
import compareAsc from 'date-fns/compareAsc';
import startOfDay from 'date-fns/startOfDay';

import { Context } from 'graphql/context';
import { sendMessage } from 'graphql/utils/fcm';
import { sign } from 'graphql/utils/jwt';
import { numberToTurn } from 'graphql/utils/turn';
import { encodeId, decodeId } from 'src/utils/hashids';

import { myTurns, myPastTurns } from '../issuedNumber/helpers';
import {
  MutationRequestTurnArgs,
  MutationCancelTurnArgs,
  QueryTurnArgs,
} from '../../graphql.d';
import {
  QueryClientTokensArgs,
  MutationSaveFcMtokenArgs,
  MutationSendNotificationArgs,
} from '../../graphql';

const getTurns = (clientId: number, ctx: Context) => {
  return ctx.prisma.issuedNumber.findMany({
    where: {
      clientId: clientId,
      status: { in: [0, 1, 2] },
    },
    orderBy: {
      id: 'desc',
    },
    take: 5,
  });
};

const clientResolver = {
  Query: {
    clientTokens: async (parent, args: QueryClientTokensArgs, ctx: Context) => {
      if (process.env.NODE_ENV === 'production') {
        return [];
      }

      const clients = await ctx.prisma.client.findMany({
        take: args?.limit || undefined,
      });
      return clients.map((client) => sign({ clientId: client.id }));
    },
    myTurn: (parent, args, ctx: Context) => {
      if (!ctx.tokenInfo) {
        return new ApolloError('No Token provided', 'NO_TOKEN_PROVIDED');
      }

      if (!ctx.tokenInfo.isValid) {
        return new ApolloError('Client not verified', 'INVALID_TOKEN');
      }

      if (
        !ctx.tokenInfo.isValid &&
        ctx.tokenInfo.error.name === 'TokenExpiredError'
      ) {
        return new ApolloError('Expired Token', 'EXPIRED_TOKEN');
      }

      if (!ctx.tokenInfo.clientId) {
        return new ApolloError('Client Id not provided', 'INVALID_CLIENT_ID');
      }

      return ctx.prisma.client.findOne({
        where: { id: ctx.tokenInfo.clientId },
      });
    },
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
          id: true,
          issuedNumber: true,
          shopId: true,
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
        rawId: issuedNumber.id,
        rawShopId: issuedNumber.shopId,
        shopId: encodeId(issuedNumber.shopId),
        shopName: issuedNumber.shopDetails.name,
        turn: numberToTurn(issuedNumber.issuedNumber),
        status: issuedNumber.status,
      };
    },
  },
  Mutation: {
    saveFCMtoken: async (
      parent,
      args: MutationSaveFcMtokenArgs,
      ctx: Context
    ) => {
      if (!ctx.tokenInfo?.isValid) {
        return new ApolloError('Invalid token', 'INVALID_TOKEN');
      }

      try {
        await ctx.prisma.client.update({
          where: { id: ctx.tokenInfo.clientId },
          data: {
            fcmToken: args.token,
          },
        });

        return true;
      } catch (error) {
        Sentry.setContext('user token', ctx.tokenInfo);
        Sentry.setContext('fcm token', { fcmToken: args.token });
        Sentry.captureException(error);
        return false;
      }
    },
    removeFCMtoken: async (parent, args, ctx: Context) => {
      if (!ctx.tokenInfo?.isValid) {
        return new ApolloError('Invalid token', 'INVALID_TOKEN');
      }

      try {
        await ctx.prisma.client.update({
          where: { id: ctx.tokenInfo.clientId },
          data: {
            fcmToken: null,
          },
        });

        return true;
      } catch (error) {
        Sentry.setContext('user token', ctx.tokenInfo);
        Sentry.setContext('fcm token', { fcmToken: null });
        Sentry.captureException(error);
        return false;
      }
    },
    sendNotification: async (
      parent,
      args: MutationSendNotificationArgs,
      ctx: Context
    ) => {
      if (process.env.NODE_ENV === 'production') {
        return;
      }

      const client = await ctx.prisma.client.findOne({
        where: { id: args.clientId },
        select: {
          fcmToken: true,
        },
      });

      if (!client || !client.fcmToken) {
        return null;
      }

      const notification = {
        title: args.data.title,
        body: args.data.body,
      };

      return sendMessage(
        notification,
        client?.fcmToken,
        args.data.link,
        args.data.icon
      );
    },
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

      let turns = await getTurns(ctx.tokenInfo.clientId, ctx);

      // limit to 1 pending turn per shopId
      const pendingTurnForShop = turns.find(
        (a) => a.shopId === shopId && a.status === 0
      );
      if (pendingTurnForShop) {
        return new ApolloError(
          'There is already a pending turn',
          'ACTIVE_TURN',
          { turnId: encodeId(pendingTurnForShop.id) }
        );
      }

      // Prevent more than 3 active turns.
      const pendingTurns = turns.filter((a) => a.status === 0);
      if (process.env.NODE_ENV === 'production' && pendingTurns.length >= 3) {
        return new ApolloError(
          'Pending turns quota exceeded.',
          'PENDING_TURNS_QUOTA_EXCEEDED'
        );
      }

      // Prevent more than 5 turns per day
      const todayAppointments = turns.filter(
        (a) => compareAsc(a.createdAt, startOfDay(new Date())) >= 0
      );
      if (
        process.env.NODE_ENV === 'production' &&
        todayAppointments.length >= 5
      ) {
        return new ApolloError(
          'Today turns quota exceeded',
          'TODAY_TURNS_QUOTA_EXCEEDED'
        );
      }

      // const rawQuery = `CALL increaseShopCounterNew(
      //   ${shopId},
      //   ${ctx.tokenInfo.clientId},
      //   ${Number(process.env.CAUDA_GO_TO_SHOP_THRESHOLD)}
      // );`;

      const rawQuery = `select funcRequestTurn()`;

      try {
        const response = await ctx.prisma.queryRaw(rawQuery);
        //console.log("RESPONSE: ", response)
        const parsedResponse = response[0]['funcRequestTurn()'].split('-');
        return {
          // id: encodeId(response[0].issuedNumberId),
          id: encodeId(Number(parsedResponse[0])),
          // queueSize: response[0].queueSize || 1,
          queueSize: Number(parsedResponse[1]),
        };
      } catch (error) {
        Sentry.captureException(error);
        console.log(error);
        return new ApolloError(
          'There was an error trying to set the appointment.',
          'OP_ERROR'
        );
      }
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
};

export default clientResolver;
