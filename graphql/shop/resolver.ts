import { ApolloError } from 'apollo-server-core';
import * as Sentry from '@sentry/node';
import { v4 as uuidv4 } from 'uuid';

import { days, serializeTime } from 'src/utils/dates';
import {
  formatPhone,
  getNationalNumber,
  parsePhone,
} from 'src/utils/phone-utils';
import { Context } from 'graphql/context';
import {
  Shop,
  ShopDetails,
  ShopInput,
  QueryLastTurnsArgs,
  QueryNearByShopsArgs,
  MutationRegisterShopArgs,
  MutationUpdateShopArgs,
  MutationNextTurnArgs,
  MutationSendSmsArgs,
} from '../../graphql';
import { setCookieToken } from '../utils/jwt';
import { numberToTurn } from '../utils/turn';
import {
  isOpen,
  shopPhone,
  status,
  lastTurns as getLastTurns,
} from './helpers';
import { decodeId, encodeId } from 'src/utils/hashids';
import sendSms from 'graphql/utils/smsApi';
import { sendMessage } from 'graphql/utils/fcm';

const threshold = Number(process.env.CAUDA_GO_TO_SHOP_THRESHOLD);

const sendFallbackSms = async (phone, message, ctx: Context) => {
  const localPhone = getNationalNumber(phone);

  if (!localPhone) {
    Sentry.setContext('SMS ERROR', { phone });
    return;
  }

  if (process.env.CAUDA_SMS_ENABLED === '1') {
    await sendSms(localPhone, message, true, null, ctx);
    console.log(`SMS-(${localPhone}): ${message}`);
  } else {
    console.log(`SMS-MOCK-(${localPhone}): ${message}`);
  }
};

const sendFcmNotification = async (
  fcmToken,
  phone,
  message,
  title,
  link,
  icon
) => {
  if (fcmToken) {
    const notification = { title, body: message };
    const messageId = await sendMessage(notification, fcmToken, link, icon);
    if (messageId) {
      console.log(
        `FCM Message to phone ${phone} sent with token ${fcmToken}. Message ID ${messageId}`
      );
      return messageId;
    }
  }
};

const sendNotification = async (
  fcmToken,
  phone,
  message,
  title = '',
  link,
  icon,
  ctx: Context
) => {
  if (fcmToken) {
    const messageId = await sendFcmNotification(
      fcmToken,
      phone,
      message,
      title,
      link,
      icon
    );
    if (messageId) {
      return;
    }
  }

  sendFallbackSms(phone, message, ctx);
};

const turnLink = (host, turnId) => {
  return 'https://' + host + '/turn/' + encodeId(turnId);
};

const mapShop = (shop: ShopInput): ShopInput => {
  const updatedShop = { ...shop };

  for (const day of days) {
    const start = day + 'TimeStart';
    const end = day + 'TimeEnd';
    if (updatedShop[start]) {
      updatedShop[start] = serializeTime(updatedShop[start]);
      updatedShop[end] = serializeTime(updatedShop[end]);
    }
  }

  if (updatedShop.shopPhone) {
    updatedShop.shopPhone = formatPhone('AR', updatedShop.shopPhone);
  }

  return updatedShop;
};

const NextTurnOpToStatus = {
  ATTEND: 1,
  SKIP: 2,
};

const shopResolver = {
  Query: {
    lastTurns: (parent, args: QueryLastTurnsArgs, ctx: Context) => {
      return getLastTurns(
        ctx.prisma,
        decodeId(args.shopId) as number,
        args.priorTo ? (decodeId(args.priorTo) as number) : undefined
      );
    },
    nearByShops: async (parent, args: QueryNearByShopsArgs, ctx: Context) => {
      const MAX_DISTANCE_METERS = 2000;
      return await ctx.prisma.queryRaw(`
        SELECT
          * ,
          ST_Distance_Sphere(
            point(${args.lng}, ${args.lat}),
            point(lng, lat)
          ) AS distance
        FROM ShopDetails
        HAVING distance < ${MAX_DISTANCE_METERS}
        ORDER BY distance
        LIMIT 10
        OFFSET ${args.offset}
      `);
    },
    myShop: (parent, args, ctx: Context) => {
      if (!ctx.tokenInfo) {
        return new ApolloError('No Token provided', 'NO_TOKEN_PROVIDED');
      }

      if (!ctx.tokenInfo.isValid) {
        return new ApolloError('Shop not verified', 'INVALID_TOKEN');
      }

      if (
        !ctx.tokenInfo.isValid &&
        ctx.tokenInfo.error.name === 'TokenExpiredError'
      ) {
        return new ApolloError('Expired Token', 'EXPIRED_TOKEN');
      }

      if (!ctx.tokenInfo.shopId) {
        return new ApolloError('Shop Id not provided', 'INVALID_SHOP_ID');
      }

      return ctx.prisma.shop.findOne({
        where: { id: ctx.tokenInfo.shopId },
      });
    },
  },
  Mutation: {
    registerShop: async (
      parent,
      args: MutationRegisterShopArgs,
      ctx: Context
    ) => {
      if (process.env.CAUDA_SHOP_REGISTRATION_ENABLED !== '1') {
        return new ApolloError(
          'Shop registration disabled',
          'SHOP_REGISTRATION_DISABLED'
        );
      }

      if (!ctx.tokenInfo?.isValid) {
        return new ApolloError('Invalid token', 'INVALID_TOKEN');
      }

      if (ctx.tokenInfo?.shopId) {
        return new ApolloError('Shop registered for this phone', 'SHOP_EXISTS');
      }

      const newShop = await ctx.prisma.shop.create({
        data: {
          isClosed: false,
          lastIssued: 0,
          queueSize: 0,
          nextToCall: 0,
          shopDetails: {
            create: {
              ...mapShop(args.shop),
              ownerPhone: formatPhone('AR', ctx.tokenInfo.phone!),
            },
          },
        },
      });

      setCookieToken(ctx.res, {
        clientId: ctx.tokenInfo!.clientId,
        shopId: newShop.id,
        phone: ctx.tokenInfo!.phone!,
      });

      return newShop;
    },
    updateShop: (parent, args: MutationUpdateShopArgs, ctx: Context) => {
      if (!ctx.tokenInfo?.isValid) {
        return new ApolloError('Invalid token', 'INVALID_TOKEN');
      }

      if (!ctx.tokenInfo?.shopId) {
        return new ApolloError(
          'Not possible to modify Shop, No id provided',
          'NO_SHOP_ID'
        );
      }

      const { id, ...shopDetails } = args.shop;

      return ctx.prisma.shop.update({
        where: { id: ctx.tokenInfo!.shopId },
        data: {
          shopDetails: {
            update: { ...mapShop(shopDetails) },
          },
        },
      });
    },
    nextTurn: async (parent, args: MutationNextTurnArgs, ctx: Context) => {
      if (!ctx.tokenInfo?.isValid) {
        return new ApolloError('Invalid token', 'INVALID_TOKEN');
      }

      if (!ctx.tokenInfo?.shopId) {
        return new ApolloError(
          'Not possible to attend turn, No id provided',
          'NO_SHOP_ID'
        );
      }

      const nextTurnResultId = uuidv4();
      const rawQuery = `CALL nextTurn('${nextTurnResultId}', ${
        ctx.tokenInfo.shopId
      }, ${NextTurnOpToStatus[args.op]}, ${threshold})`;
      await ctx.prisma.executeRaw(rawQuery);
      const nextTurnResult = await ctx.prisma.nextTurnResults.findOne({
        where: { id: nextTurnResultId },
      });

      const lastTurns = await getLastTurns(ctx.prisma, ctx.tokenInfo.shopId);

      if (!nextTurnResult || !nextTurnResult.nextID) {
        return { nextTurn: null, queueSize: 0, lastTurns: lastTurns };
      }

      const shop = await ctx.prisma.shop.findOne({
        where: { id: ctx.tokenInfo.shopId },
        select: {
          queueSize: true,
          shopDetails: {
            select: {
              name: true,
            },
          },
        },
      });

      const title = 'Cauda';
      const icon = 'https://' + ctx.req.headers.host + '/cauda_blue.png';

      if (args.op === 'ATTEND') {
        const link = turnLink(ctx.req.headers.host, nextTurnResult.nextID);
        const message = `Es tu turno en ${shop?.shopDetails.name}!`;
        await sendFcmNotification(
          nextTurnResult.nextFcmToken,
          nextTurnResult.nextPhone,
          message,
          title,
          link,
          icon
        );
      }

      // If there is a turn after threshold, send a notification
      if (nextTurnResult.windowShouldNotify) {
        if (!nextTurnResult.windowClientId) {
          return new ApolloError(
            'Not possible to attend turn, No clientId not found',
            'CLIENT_ID_NOT_FOUND'
          );
        }

        const message = `Tu turno en ${shop?.shopDetails.name} está próximo a ser atendido. Solo hay ${threshold} personas por delante.`;
        const link = turnLink(ctx.req.headers.host, nextTurnResult.nextID);
        await sendNotification(
          nextTurnResult.windowFcmToken,
          nextTurnResult.windowPhone,
          message,
          title,
          link,
          icon,
          ctx
        );
      }

      return {
        nextTurn: nextTurnResult.nextNumber
          ? numberToTurn(nextTurnResult.nextNumber)
          : null,
        queueSize: shop?.queueSize,
        lastTurns: lastTurns,
      };
    },
    cancelTurns: async (parent, args, ctx: Context) => {
      if (!ctx.tokenInfo?.isValid) {
        return new ApolloError('Invalid token', 'INVALID_TOKEN');
      }

      if (!ctx.tokenInfo?.shopId) {
        return new ApolloError(
          'Not possible to attend turn, No id provided',
          'NO_SHOP_ID'
        );
      }

      await ctx.prisma.issuedNumber.updateMany({
        where: { shopId: ctx.tokenInfo.shopId, AND: { status: 0 } },
        data: { status: 3 },
      });

      return ctx.prisma.shop.findOne({
        where: { id: ctx.tokenInfo!.shopId },
      });
    },
    sendSms: async (parent, args: MutationSendSmsArgs, ctx: Context) => {
      if (process.env.NODE_ENV === 'production') {
        return false;
      }

      try {
        parsePhone(args.phone);
      } catch (error) {
        return new ApolloError('Invalid phone', 'INVALID_PHONE');
      }

      try {
        await sendSms(args.phone, args.message, args.short, null, ctx);
        return true;
      } catch (error) {
        return new ApolloError('Error sending message', 'ERROR');
      }
    },
  },
  Shop: {
    id: (parent: Shop, args, ctx: Context) => {
      return encodeId(Number(parent.id));
    },
    details: (parent: Shop, args, ctx: Context) => {
      return ctx.prisma.shopDetails.findOne({
        where: { shopId: Number(parent.id) },
      });
    },
    nextTurn: async (parent: Shop, args, ctx: Context) => {
      if (parent.nextToCall === null || parent.nextToCall === undefined) {
        return null;
      }
      return numberToTurn(parent.nextToCall);
    },
    lastTurns: async (parent: Shop, args, ctx: Context) => {
      return await getLastTurns(ctx.prisma, Number(parent.id));
    },
  },
  ShopDetails: {
    shopId: (parent: ShopDetails, args, ctx: Context) => {
      return encodeId(Number(parent.shopId));
    },
    isOpen: (parent: ShopDetails, args, ctx: Context) => {
      return isOpen(parent);
    },
    shop: (parent: ShopDetails, args, ctx: Context) => {
      return ctx.prisma.shop.findOne({
        where: { id: Number(parent.shopId) }, // shopId is still a number from the db, it hasn't be resolved and encoded
      });
    },
    shopPhone: (parent: ShopDetails, args, ctx: Context) => {
      return shopPhone(parent);
    },
    status: (parent: ShopDetails, args, ctx: Context) => {
      return status(parent);
    },
  },
};

export default shopResolver;
