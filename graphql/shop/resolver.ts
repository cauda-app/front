import { ApolloError } from 'apollo-server-core';
import crypto from 'crypto';

import { Context } from '../../pages_/api/graphql';
import {
  Shop,
  ShopDetails,
  QueryShopArgs,
  QueryShopsDetailArgs,
  QueryNearByShopsArgs,
  MutationRegisterShopArgs,
  MutationUpdateShopArgs,
} from '../../graphql';

// import { registerPhone } from '../utils/registerPhone';
import { nowFromCoordinates, todayIs, isOpen } from 'src/utils/dates';
import { parseUTCTime } from '../../src/utils/dates';
import { parsePhone } from '../../src/utils/phone-utils';

const todaysStatus = (shopDetails: ShopDetails) => {
  const now = nowFromCoordinates(shopDetails.lat, shopDetails.lng);
  const today = todayIs(now).toLowerCase();
  const timeStart = shopDetails[today + 'TimeStart'];
  const timeEnd = shopDetails[today + 'TimeEnd'];
  if (!timeStart || !timeEnd) {
    return null;
  }

  return { start: timeStart, end: timeEnd, now };
};

const shopResolver = {
  Query: {
    shop: (parent, args: QueryShopArgs, ctx: Context) => {
      return ctx.prisma.shop.findOne({
        where: { id: args.id },
      });
    },
    shops: (parent, args, ctx: Context) => {
      return ctx.prisma.shop.findMany();
    },
    shopsDetail: (parent, args: QueryShopsDetailArgs, ctx: Context) => {
      const after = args.after ? { after: { shopId: args.after } } : undefined;
      return ctx.prisma.shopDetails.findMany({
        first: 10,
        ...after,
      });
    },
    nearByShops: async (parent, args: QueryNearByShopsArgs, ctx: Context) => {
      const MAX_DISTANCE_METERS = 1000;
      return await ctx.prisma.raw(`
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
    myShop: (parent, args: QueryShopArgs, ctx: Context) => {
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
      const newShop = await ctx.prisma.shop.create({
        data: {
          id: crypto.randomBytes(20).toString('hex').substring(0, 19),
          isClosed: false,
          lastNumber: 0,
          nextNumber: 0,
          shopDetails: {
            create: {
              ...args.shop,
            },
          },
        },
      });

      await ctx.prisma.client.upsert({
        where: { phone: args.shop.ownerPhone },
        create: { phone: args.shop.ownerPhone },
        update: {},
      });

      // await registerPhone(args.shop.ownerPhone, ctx);

      return newShop;
    },
    updateShop: (parent, args: MutationUpdateShopArgs, ctx: Context) => {
      if (!args.shop.id) {
        return new ApolloError('Parameter id is required');
      }

      const { id, isClosed, ...shopDetails } = args.shop;

      return ctx.prisma.shop.update({
        where: { id },
        data: {
          isClosed,
          shopDetails: {
            update: { ...shopDetails },
          },
        },
      });
    },
  },
  Shop: {
    details: (parent: Shop, args, ctx: Context) => {
      return ctx.prisma.shopDetails.findOne({
        where: { shopId: parent.id },
      });
    },
  },
  ShopDetails: {
    isOpen: (parent: ShopDetails, args, ctx: Context) => {
      const status = todaysStatus(parent);
      if (!status) {
        return false;
      }
      const open = parseUTCTime(status.start, status.now);
      const close = parseUTCTime(status.end, status.now);

      return isOpen(status.now, open, close);
    },
    shopPhone: (parent: ShopDetails, args, ctx: Context) => {
      if (parent.shopPhone) {
        const phone = parsePhone(parent.shopPhone);
        return phone.number;
      }

      return null;
    },
    status: (parent: ShopDetails, args, ctx: Context) => {
      const status = todaysStatus(parent);
      if (!status) {
        return null;
      }

      return { opens: status.start, closes: status.end };
    },
  },
};

export default shopResolver;
