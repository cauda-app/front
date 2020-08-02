import { ApolloError } from 'apollo-server-core';
import addMinutes from 'date-fns/addMinutes';
import addHours from 'date-fns/addHours';
import compareAsc from 'date-fns/compareAsc';

import {
  setCookieToken,
  verifyToken,
  MobileTokenInfo,
} from '../../graphql/utils/jwt';
import { MutationVerifyCodeArgs, MutationVerifyPhoneArgs } from '../../graphql';
import { PhoneVerification } from '@prisma/client';
import { Context } from 'graphql/context';
import generateRandomCode from '../utils/randomCode';
import { PHONE_CODE_EXPIRY } from '../utils/constants';
import sendSms from '../utils/smsApi';
import { formatPhone, getNationalNumber } from 'src/utils/phone-utils';
import validateCaptcha from 'graphql/utils/captcha';

const getCode = (phoneVerification: PhoneVerification | null) => {
  if (process.env.CAUDA_SMS_ENABLED !== '1') {
    return 1234;
  }

  if (!phoneVerification) {
    return generateRandomCode();
  }

  return compareAsc(
    new Date(),
    addMinutes(phoneVerification.updatedAt, PHONE_CODE_EXPIRY * 3)
  ) === 1
    ? generateRandomCode()
    : phoneVerification.code;
};

const phoneVerificationResolver = {
  Mutation: {
    verifyCode: async (parent, args: MutationVerifyCodeArgs, ctx: Context) => {
      const isUSNumber = args.phone === process.env.US_NUMBER;
      const phone = isUSNumber ? args.phone : formatPhone('AR', args.phone); // TODO: Fixed for Argentina
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
        clientId: client.id,
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
      if (
        process.env.CAUDA_SHOP_REGISTRATION_ENABLED !== '1' &&
        process.env.CAUDA_CLIENT_REGISTRATION_ENABLED !== '1'
      ) {
        return new ApolloError(
          'registration disabled',
          'REGISTRATION_DISABLED'
        );
      }

      // Validate token: it can be a recaptcha v3 token if it comes from the web app, or a jwt if it comes from the mobile app
      const isCaptchaValid = await validateCaptcha(args.token);
      if (!isCaptchaValid) {
        const jwt = verifyToken(args.token) as MobileTokenInfo;
        if (!jwt.isValid || !jwt.isMobile)
          return new ApolloError('Invalid token', 'INVALID_TOKEN');
      }

      const isUSNumber = args.phone === process.env.US_NUMBER;

      // verify phone
      let phone;
      try {
        phone = isUSNumber ? args.phone : formatPhone('AR', args.phone);
      } catch (error) {
        return new ApolloError('Invalid phone', 'INVALID_PHONE');
      }

      const localPhone = getNationalNumber(phone);
      if (!localPhone && !isUSNumber) {
        return new ApolloError(
          'Invalid national phone',
          'INVALID_NATIONAL_PHONE'
        );
      }

      const phoneVerification = await ctx.prisma.phoneVerification.findOne({
        where: { phone },
      });

      // If three codes were already sent, wait for 4h before sending another.
      if (
        process.env.NODE_ENV === 'production' &&
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
        process.env.NODE_ENV === 'production' &&
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

      const verificationCode = isUSNumber ? 1234 : getCode(phoneVerification);
      const expiry = addMinutes(new Date(), PHONE_CODE_EXPIRY).toISOString();
      let attempts = (phoneVerification?.attempts || 0) + 1;
      if (attempts > 3) {
        attempts = 1;
      }

      const phoneVerificationRes = await ctx.prisma.phoneVerification.upsert({
        where: { phone },
        create: {
          phone,
          code: verificationCode,
          expiry,
          attempts: 1,
        },
        update: {
          code: verificationCode,
          attempts,
          expiry,
        },
      });

      const message = `${verificationCode} es tu código de verificación CAUDA. ${
        attempts > 1 ? 'intento: ' + attempts : ''
      }`;

      const sentAsShortNumber =
        attempts >=
        Number(process.env.CAUDA_REGISTRATION_SEND_SHORT_SMS_AT_ATTEMPT);

      if (process.env.CAUDA_SMS_ENABLED === '1' && !isUSNumber) {
        await sendSms(
          localPhone!,
          message,
          sentAsShortNumber,
          phoneVerificationRes.id,
          ctx
        );
        console.log(
          `SMS [${
            sentAsShortNumber ? 'short' : 'long'
          }] -(${localPhone}): ${message} `
        );
      } else {
        console.log(
          `SMS_MOCK [${
            sentAsShortNumber ? 'short' : 'long'
          }] -(${localPhone}): ${message}`
        );
      }

      return expiry;
    },
  },
};

export default phoneVerificationResolver;
