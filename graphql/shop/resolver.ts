import { ApolloError } from 'apollo-server-core';

import { days, serializeTime } from 'src/utils/dates';
import { formatPhone } from 'src/utils/phone-utils';
import { Context } from '../../pages_/api/graphql';
import {
  Shop,
  ShopDetails,
  ShopInput,
  QueryNearByShopsArgs,
  MutationRegisterShopArgs,
  MutationUpdateShopArgs,
  MutationNextTurnArgs,
} from '../../graphql';
import { setCookieToken } from '../utils/jwt';
import { numberToTurn } from '../utils/turn';
import { isOpen, shopPhone, status, lastTurns } from './helpers';
import { decodeId, encodeId } from 'src/utils/hashids';

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
    shops: (parent, args, ctx: Context) => {
      return ctx.prisma.shop.findMany();
    },
    nearByShops: async (parent, args: QueryNearByShopsArgs, ctx: Context) => {
      const MAX_DISTANCE_METERS = 2000;
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
      if (!ctx.tokenInfo?.isValid) {
        return new ApolloError('Invalid token', 'INVALID_TOKEN');
      }

      if (ctx.tokenInfo?.shopId) {
        return new ApolloError('Shop registered for this phone', 'SHOP_EXISTS');
      }

      const newShop = await ctx.prisma.shop.create({
        data: {
          isClosed: false,
          lastNumber: 0,
          nextNumber: 0,
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
        });

      // TODO: this won't work for multiple employees attending in parallel
      const nextTurn = await ctx.prisma.issuedNumber.findMany({
        where: { shopId: ctx.tokenInfo!.shopId, AND: { status: 0 } },
        orderBy: { issuedNumber: 'asc' },
        first: 1,
      });

      if (!nextTurn.length) {
        return getShop();
      }

      await ctx.prisma.issuedNumber.update({
        where: { id: nextTurn[0].id },
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
        where: { shopId: decodeId(parent.id), AND: { status: 0 } },
        first: 1,
        orderBy: { issuedNumber: 'asc' },
        select: { issuedNumber: true },
      });
      return res.length > 0 ? numberToTurn(res[0].issuedNumber) : null;
    },
    lastTurns: async (parent: Shop, args, ctx: Context) => {
      return await lastTurns(ctx.prisma, parent.id);
    },
    pendingTurnsAmount: (parent: Shop, args, ctx: Context) => {
      return ctx.prisma.issuedNumber.count({
        where: { shopId: decodeId(parent.id), AND: { status: 0 } },
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
