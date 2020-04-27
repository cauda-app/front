import { ApolloError } from 'apollo-server-core';
import crypto from 'crypto';
import { Context } from '../context';
import {
  Shop,
  QueryShopArgs,
  QueryShopsDetailArgs,
  QueryNearShopsArgs,
  MutationRegisterShopArgs,
  MutationUpdateShopArgs,
  ShopDetails,
} from '../../graphql';
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
    nearShops: async (parent, args: QueryNearShopsArgs, ctx: Context) => {
      const MAX_DISTANCE_KM = 1;
      return await ctx.prisma.raw`
        SELECT
          * ,
          (
            (3959 * acos(
              cos( radians(${args.lat}) ) * cos( radians( lat ) ) 
                * cos( radians(lng) - radians(${args.lng})) + sin(radians(${args.lat})) 
                * sin( radians(lat))
            ))
          ) AS distance
        FROM ShopDetails
        HAVING distance < ${MAX_DISTANCE_KM}
        ORDER BY distance
      `;
    },
  },
  Mutation: {
    registerShop: (parent, args: MutationRegisterShopArgs, ctx: Context) => {
      return ctx.prisma.shop.create({
        data: {
          id: crypto.randomBytes(20).toString('hex').substring(0, 19),
          isClosed: true,
          lastNumber: 0,
          nextNumber: 0,
          shopDetails: {
            create: {
              ...args.shop,
            },
          },
        },
      });
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
