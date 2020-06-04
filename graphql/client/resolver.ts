import { ApolloError } from 'apollo-server-core';
import * as Sentry from '@sentry/node';
import { Context } from 'graphql/context';
import { sendMessage } from 'graphql/utils/fcm';
import {
  QueryClientTokensArgs,
  MutationSaveFcMtokenArgs,
  MutationSendNotificationArgs,
} from '../../graphql';
import { sign } from 'graphql/utils/jwt';

const clientResolver = {
  Query: {
    clientTokens: async (parent, args: QueryClientTokensArgs, ctx: Context) => {
      if (process.env.NODE_ENV === 'production') {
        return [];
      }

      const clients = await ctx.prisma.client.findMany({ first: args.limit });
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
        Sentry.setContext('fcm token', { fcmToken: args.token });
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
  },
};

export default clientResolver;
