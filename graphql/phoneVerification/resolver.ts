import { ApolloError } from 'apollo-server-core';
import addMinutes from 'date-fns/addMinutes';
import addHours from 'date-fns/addHours';
import compareAsc from 'date-fns/compareAsc';

import { setCookieToken } from '../../graphql/utils/jwt';
import { MutationVerifyCodeArgs, MutationVerifyPhoneArgs } from '../../graphql';
import { Context } from 'graphql/context';
import randomCode from '../utils/randomCode';
import { PHONE_CODE_EXPIRY } from '../utils/constants';
import sendSms from '../utils/smsApi';
import { formatPhone, getNationalNumber } from 'src/utils/phone-utils';

const phoneVerificationResolver = {
  Mutation: {
    verifyCode: async (parent, args: MutationVerifyCodeArgs, ctx: Context) => {
      const phone = formatPhone('AR', args.phone); // TODO: Fixed for Argentina
      const phoneVerification = await ctx.prisma.phoneVerification.findOne({
        where: { phone },
      });

      if (!phoneVerification) {
        return new ApolloError('Phone not registered', 'PHONE_NOT_REGISTERED');
      }

      if (compareAsc(new Date(), phoneVerification.expiry) === 1) {
        return new ApolloError('Code is expired', 'CODE_EXPIRED');
      }

      if (phoneVerification.code !== args.code) {
        return new ApolloError('Incorrect code', 'INCORRECT_CODE');
      }

      const updatedPhoneVerification = await ctx.prisma.phoneVerification.update(
        {
          where: {
            phone,
          },
          data: {
            verified: new Date().toISOString(),
          },
        }
      );

      const client = await ctx.prisma.client.upsert({
        where: {
          phone,
        },
        create: {
          phone: updatedPhoneVerification.phone,
        },
        update: {},
      });

      const shopDetails = await ctx.prisma.shopDetails.findOne({
        where: {
          ownerPhone: phone,
        },
      });

      setCookieToken(ctx.res, {
        clientId: client?.id,
        shopId: shopDetails?.shopId,
        phone: phone,
      });

      return true;
    },
    verifyPhone: async (
      parent,
      args: MutationVerifyPhoneArgs,
      ctx: Context
    ) => {
      const phone = formatPhone('AR', args.phone);
      const phoneVerification = await ctx.prisma.phoneVerification.findOne({
        where: { phone },
      });

      // If three codes were already sent, wait for 4h before sending another.
      if (
        phoneVerification &&
        phoneVerification.attempts >= 3 &&
        compareAsc(new Date(), addHours(phoneVerification.updatedAt, 4)) === -1
      ) {
        return new ApolloError(
          'Limit code sent exceeded',
          'LIMIT_CODE_SENT_EXCEEDED'
        );
      }

      // Do not send before PHONE_CODE_EXPIRY
      if (
        phoneVerification &&
        compareAsc(
          new Date(),
          addMinutes(phoneVerification.updatedAt, PHONE_CODE_EXPIRY)
        ) === -1
      ) {
        return new ApolloError(
          'A validation is active',
          'IN_PROGRESS_VERIFICATION'
        );
      }

      const code =
        process.env.SMS_VERIFICATION_ENABLED === '1' ? randomCode() : 1234;
      const expiry = addMinutes(new Date(), PHONE_CODE_EXPIRY).toISOString();

      await ctx.prisma.phoneVerification.upsert({
        where: { phone },
        create: {
          phone,
          code,
          expiry,
          attempts: 1,
        },
        update: {
          code,
          attempts: (phoneVerification?.attempts || 0) + 1,
          expiry,
        },
      });

      if (process.env.SMS_VERIFICATION_ENABLED === '1') {
        const localPhone = getNationalNumber(phone);
        await sendSms(localPhone, code.toString());
      }

      return expiry;
    },
  },
};

export default phoneVerificationResolver;
