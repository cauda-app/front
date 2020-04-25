import { ApolloError } from 'apollo-server-core';
import addMinutes from 'date-fns/addMinutes';
import addDays from 'date-fns/addDays';
import compareAsc from 'date-fns/compareAsc';
import { serialize } from 'cookie';

import { createToken } from '../../graphql/utils/jwt';
import {
  MutationReSendVerificationCodeArgs,
  MutationVerifyCodeArgs,
} from '../../graphql';
import { Context } from '../../pages_/api/graphql';
import randomCode from '../utils/randomCode';
import { TOKEN_EXPIRY } from '../utils/constants';

import { PHONE_CODE_EXPIRY } from '../utils/constants';

const phoneVerificationResolver = {
  Mutation: {
    verifyCode: async (parent, args: MutationVerifyCodeArgs, ctx: Context) => {
      const phoneVerification = await ctx.prisma.phoneVerification.findOne({
        where: { phone: args.phone },
      });

      if (!phoneVerification) {
        return false;
      }

      if (compareAsc(new Date(), phoneVerification.expiry) === 1) {
        return new ApolloError('Code is expired', 'CODE_EXPIRED');
      }

      if (phoneVerification.code !== args.code) {
        return new ApolloError('Incorrect code', 'INCORRECT_CODE');
      }

      if (phoneVerification.verified) {
        return true;
      }

      const updated = await ctx.prisma.phoneVerification.update({
        where: {
          phone: args.phone,
        },
        data: {
          verified: new Date().toISOString(),
        },
      });

      const shopDetails = await ctx.prisma.shopDetails.findOne({
        where: {
          ownerPhone: args.phone,
        },
      });

      const client = await ctx.prisma.client.findOne({
        where: {
          phone: args.phone,
        },
      });

      const token = createToken({
        clientId: client?.id,
        shopId: shopDetails?.shopId,
        phone: args.phone,
      });

      ctx.res.setHeader(
        'Set-Cookie',
        serialize('token', token, {
          expires: addDays(new Date(), TOKEN_EXPIRY),
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
        })
      );

      return !!updated;
    },
    reSendVerificationCode: async (
      parent,
      args: MutationReSendVerificationCodeArgs,
      ctx: Context
    ) => {
      const phoneVerification = await ctx.prisma.phoneVerification.findOne({
        where: { phone: args.phone },
      });

      if (phoneVerification && phoneVerification.verified) {
        return new ApolloError(
          'Phone already verified',
          'PHONE_ALREADY_VERIFIED'
        );
      }

      // Do not send before 5 mim
      if (
        phoneVerification &&
        compareAsc(
          new Date(),
          addMinutes(phoneVerification.updatedAt, PHONE_CODE_EXPIRY)
        ) === -1
      ) {
        return new ApolloError(
          'A validation is active',
          'IN_PROGRESS_VALIDATION'
        );
      }

      const code = 1234; //randomCode();
      const res = await ctx.prisma.phoneVerification.upsert({
        where: {
          phone: args.phone,
        },
        create: {
          code,
          phone: args.phone,
          expiry: addMinutes(new Date(), PHONE_CODE_EXPIRY).toISOString(),
        },
        update: {
          code,
          expiry: addMinutes(new Date(), PHONE_CODE_EXPIRY).toISOString(),
        },
      });

      return !!res;
    },
  },
};

export default phoneVerificationResolver;
