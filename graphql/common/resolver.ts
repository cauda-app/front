import { ApolloError } from 'apollo-server-core';
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date';

import { Context } from 'graphql/context';
import sendSms from 'graphql/utils/smsApi';
import { parsePhone } from 'src/utils/phone-utils';
import { encodeValue } from 'src/utils/hashids';

import { QueryEncodeValueArgs, MutationSendSmsArgs } from '../../graphql';

const shopResolver = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Time: GraphQLTime,
  Query: {
    encodeValue: (parent, args: QueryEncodeValueArgs, ctx: Context) => {
      return encodeValue(args.value, args.secret);
    },
  },
  Mutation: {
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
};

export default shopResolver;
