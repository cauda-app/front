import { ApolloError } from 'apollo-server-core';

// import { serialize } from 'cookie';
// import { createToken } from '../../graphql/utils/jwt';

import { Context } from '../context';
import { MutationSignUpArgs } from '../../graphql';
import { registerPhone } from '../utils/registerPhone';

const clientResolver = {
  Query: {
    client: (parent, args, ctx: Context) => {
      return ctx.prisma.client.findOne({
        where: { id: Number(args.id) },
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

      await registerPhone(args.client.phone, ctx);

      return newClient;
    },
    // verifyClient: (parent, args: MutationVerifyClientArgs, ctx: Context) => {
    //   const token = createToken('1111');

    //   ctx.res.setHeader(
    //     'Set-Cookie',
    //     serialize('token', token, {
    //       expires: new Date(Date.now() + 1209600000), //14days
    //       secure: process.env.NODE_ENV === 'production',
    //       httpOnly: true,
    //     })
    //   );

    //   // return ctx.prisma.client.update({
    //   //   where: { id: Number(args.id) },
    //   //   data: { phoneValidated: new Date().toISOString() },
    //   // });
    // },
  },
};

export default clientResolver;
