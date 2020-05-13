import { ApolloError } from 'apollo-server-core';
import { Context } from 'graphql/context';
import { MutationSignUpArgs } from '../../graphql';
// import { registerPhone } from '../utils/registerPhone';

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
  Mutation: {
    signUp: async (parent, args: MutationSignUpArgs, ctx: Context) => {
      const client = await ctx.prisma.client.findOne({
        where: { phone: args.client.phone },
      });

      if (client) {
        return new ApolloError(
          'Phone entered is already registered',
          'PHONE_ALREADY_EXISTS'
        );
      }

      const newClient = await ctx.prisma.client.create({
        data: {
          phone: args.client.phone,
        },
      });

      // await registerPhone(args.client.phone, ctx);

      return newClient;
    },
  },
};

export default clientResolver;
