import { ApolloError } from 'apollo-server-core';
import { Context } from '../context';
import {
  MutationRequestAppointmentArgs,
  MutationCancelAppointmentArgs,
  QueryGetAppointmentsArgs,
} from '../../graphql';

const getPendingAppointment = (
  clientId: number,
  shopId: string,
  ctx: Context
) =>
  ctx.prisma.issuedNumber.findMany({
    where: {
      clientId: clientId,
      shopId: shopId,
      status: 0,
    },
  });

const IssuedNumberResolver = {
  Query: {
    getAppointments: (parent, args: QueryGetAppointmentsArgs, ctx: Context) => {
      const where: any = { clientId: args.clientId };
      if (args.shopId) {
        where.shopId = args.shopId;
      }
      return ctx.prisma.issuedNumber.findMany({
        where
      });
    },
  },
  Mutation: {
    requestAppointment: async (
      parent,
      args: MutationRequestAppointmentArgs,
      ctx: Context
    ) => {
      let appointments = await getPendingAppointment(
        args.clientId,
        args.shopId,
        ctx
      );

      if (appointments.length) {
        return new ApolloError('There is already a pending appointment');
      }

      const rawQuery = `CALL increaseShopCounter("${args.shopId}", ${args.clientId});`;
      console.log(rawQuery);
      await ctx.prisma.raw(rawQuery);

      appointments = await getPendingAppointment(
        args.clientId,
        args.shopId,
        ctx
      );
      if (!appointments.length) {
        return new ApolloError(
          'There was an error trying to set the appointment.'
        );
      }
      console.log(appointments);
      return appointments[0];
    },
    cancelAppointment: async (
      parent,
      args: MutationCancelAppointmentArgs,
      ctx: Context
    ) => {
      let appointments = await getPendingAppointment(
        args.clientId,
        args.shopId,
        ctx
      );

      if (!appointments.length) {
        return new ApolloError('There is no pending appointment.');
      }

      await ctx.prisma.issuedNumber.update({
        where: {
          id: appointments[0].id,
        },
        data: {
          status: 3,
        },
      });

      return true;
    },
  },
  IssuedNumber: {},
  IssuedNumberStatus: {
    PENDING: 0,
    ATTENDED: 1,
    SKIPPED: 2,
    CANCELLED: 3,
  },
};

export default IssuedNumberResolver;
