import { ApolloError } from 'apollo-server-core';
import addMinutes from 'date-fns/addMinutes';
import compareAsc from 'date-fns/compareAsc';

import {
  MutationReSendVerificationCodeArgs,
  MutationVerifyCodeArgs,
} from '../../graphql';
import { Context } from '../context';
import randomCode from '../utils/randomCode';

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

      const res = await ctx.prisma.phoneVerification.upsert({
        where: {
          phone: args.phone,
        },
        create: {
          code: randomCode(),
          phone: args.phone,
          expiry: addMinutes(new Date(), PHONE_CODE_EXPIRY).toISOString(),
        },
        update: {
          code: randomCode(),
          expiry: addMinutes(new Date(), PHONE_CODE_EXPIRY).toISOString(),
        },
      });

      return !!res;
    },
  },
};

export default phoneVerificationResolver;
