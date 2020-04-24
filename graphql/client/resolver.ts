import { serialize } from 'cookie';

import { createToken } from '../../graphql/utils/jwt';
import { Context } from '../context';
import { MutationSignUpArgs, MutationVerifyClientArgs } from '../../graphql';

const clientResolver = {
  Query: {
    client: (parent, args, ctx: Context) => {
      return ctx.prisma.client.findOne({
        where: { id: Number(args.id) },
      });
    },
  },
  Mutation: {
    signUp: (parent, args: MutationSignUpArgs, ctx: Context) => {
      // create code
      // save it to DB
      // send sms with code
      return ctx.prisma.client.create({
        data: {
          phone: args.client.phone,
          phoneValidated: undefined,
        },
      });
    },
    verifyClient: (parent, args: MutationVerifyClientArgs, ctx: Context) => {
      const token = createToken('1111');

      ctx.res.setHeader(
        'Set-Cookie',
        serialize('token', token, {
          expires: new Date(Date.now() + 1209600000), //14days
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
        })
      );

      return ctx.prisma.client.update({
        where: { id: Number(args.id) },
        data: { phoneValidated: new Date().toISOString() },
      });
    },
  },
};

export default clientResolver;
