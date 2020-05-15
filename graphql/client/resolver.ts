import { ApolloError } from 'apollo-server-core';
import { Context } from '../../pages_/api/graphql';

const clientResolver = {
  Query: {
    client: (parent, args, ctx: Context) => {
      return ctx.prisma.client.findOne({
        where: { id: Number(args.id) },
      });
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
};

export default clientResolver;
