import { ApolloError } from 'apollo-server-core';
import getConfig from 'next/config';
import * as Sentry from '@sentry/node';

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
import { isOpen, shopPhone, status, lastTurns } from './helpers';
import { decodeId, encodeId } from 'src/utils/hashids';
import sendSms from 'graphql/utils/smsApi';
import { sendMessage } from 'graphql/utils/fcm';

const { publicRuntimeConfig } = getConfig();
const threshold = Number(publicRuntimeConfig.goToShopThreshold);

const sendFallbackSms = async (phone, message, ctx: Context) => {
  const localPhone = getNationalNumber(phone);

  if (!localPhone) {
    Sentry.setContext('SMS ERROR', { phone });
    return;
  }

  if (process.env.SMS_ENABLED === '1') {
    await sendSms(localPhone, message, true, null, ctx);
    console.log(`SMS-(${localPhone}): ${message}`);
  } else {
    console.log(`SMS-MOCK-(${localPhone}): ${message}`);
  }
};

const sendFcmNotification = async (client, message, title, link, icon) => {
  if (client.fcmToken) {
    const notification = { title, body: message };
    const messageId = await sendMessage(
      notification,
      client.fcmToken,
      link,
      icon
    );
    if (messageId) {
      console.log(
        `FCM Message to Client ID ${client.id} sent with token ${client.fcmToken}. Message ID ${messageId}`
      );
      return messageId;
    }
  }
};

const sendNotification = async (
  client,
  message,
  title = '',
  link,
  icon,
  ctx: Context
) => {
  if (client.fcmToken) {
    const messageId = await sendFcmNotification(
      client,
      message,
      title,
      link,
      icon
    );
    if (messageId) {
      return;
    }
  }

  sendFallbackSms(client.phone, message, ctx);
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

const shopResolver = {
  Query: {
    lastTurns: (parent, args: QueryLastTurnsArgs, ctx: Context) => {
      return lastTurns(ctx.prisma, decodeId(args.shopId) as number);
    },
    shops: (parent, args, ctx: Context) => {
      return ctx.prisma.shop.findMany();
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

      const getShop = () =>
        ctx.prisma.shop.findOne({
          where: { id: ctx.tokenInfo!.shopId },
          include: {
            shopDetails: true,
          },
        });

      // TODO: this won't work for multiple employees attending in parallel
      const nextTurns = await ctx.prisma.issuedNumber.findMany({
        where: { shopId: ctx.tokenInfo!.shopId, AND: { status: 0 } },
        orderBy: { issuedNumber: 'asc' },
        take: threshold + 1,
        include: {
          client: {
            select: {
              id: true,
              phone: true,
              fcmToken: true,
            },
          },
        },
      });

      const shop = await getShop();

      if (!nextTurns.length) {
        return shop;
      }

      const title = 'Cauda';
      const icon = 'https://' + ctx.req.headers.host + '/cauda_blue.png';

      const nextTurn = nextTurns[0];
      if (args.op === 'ATTEND') {
        const link = turnLink(ctx.req.headers.host, nextTurn.id);
        const message = `Es tu turno en ${shop?.shopDetails.name}!`;
        sendFcmNotification(nextTurn.client, message, title, link, icon);
      }

      // If there is a turn after threshold, send a notification
      const nextTurnToNotify = nextTurns[threshold];
      if (nextTurnToNotify && nextTurnToNotify.shouldNotify) {
        const client = nextTurnToNotify.client;

        if (!client) {
          return new ApolloError(
            'Not possible to attend turn, No clientId not found',
            'CLIENT_ID_NOT_FOUND'
          );
        }

        const message = `Tu turno en ${shop?.shopDetails.name} está próximo a ser atendido. Solo hay ${threshold} personas por delante.`;
        const link = turnLink(ctx.req.headers.host, nextTurnToNotify.id);
        sendNotification(client, message, title, link, icon, ctx);
      }

      await ctx.prisma.issuedNumber.update({
        where: { id: nextTurns[0].id },
        data: { status: args.op === 'ATTEND' ? 1 : 2 },
      });

      return getShop();
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
      const res = await ctx.prisma.issuedNumber.findMany({
        where: { shopId: Number(parent.id), AND: { status: 0 } },
        take: 1,
        orderBy: { issuedNumber: 'asc' },
        select: { issuedNumber: true },
      });
      return res.length > 0 ? numberToTurn(res[0].issuedNumber) : null;
    },
    lastTurns: async (parent: Shop, args, ctx: Context) => {
      return await lastTurns(ctx.prisma, Number(parent.id));
    },
    pendingTurnsAmount: (parent: Shop, args, ctx: Context) => {
      return ctx.prisma.issuedNumber.count({
        where: { shopId: Number(parent.id), AND: { status: 0 } },
      });
    },
  },
  ShopDetails: {
    shopId: (parent: ShopDetails, args, ctx: Context) => {
      return encodeId(Number(parent.shopId));
    },
    isOpen: (parent: ShopDetails, args, ctx: Context) => {
      return isOpen(parent);
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
