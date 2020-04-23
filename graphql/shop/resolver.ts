import { ApolloError } from 'apollo-server-core';
import crypto from 'crypto';
import { Context } from '../context';
import {
  Shop,
  QueryShopArgs,
  QueryNearShopsArgs,
  MutationRegisterShopArgs,
  MutationUpdateShopArgs
} from '../../graphql';

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
    nearShops: async (parent, args: QueryNearShopsArgs, ctx: Context) => {
      const MAX_DISTANCE_KM = 1;
      const shopIds = await ctx.prisma.raw`
        SELECT 
          shopId , 
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
      return ctx.prisma.shop.findMany({
        where: {
          id: {
            in: shopIds.map((s) => s.shopId),
          },
        },
      });
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
};

export default shopResolver;
