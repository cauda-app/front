import { ApolloServer } from 'apollo-server-micro';
import { makeExecutableSchema } from 'graphql-tools';
import * as Sentry from '@sentry/node';

import { Context } from 'graphql/context';
import prisma from 'prisma/client';
import typeDefs from 'graphql/typeDefs';
import resolvers from 'graphql/resolvers';
import { processCookie } from 'src/utils/next';
import { apolloServerSentryPlugin } from 'graphql/plugins';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

function sentryHandler(handler) {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      Sentry.captureException(error);
      await Sentry.flush(2000);
      return error;
    }
  };
}

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
  context: ({ req, res }): Context => {
    return {
      tokenInfo: processCookie(req),
      req,
      res,
      prisma,
    };
  },
  plugins: [apolloServerSentryPlugin],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

process.on('exit', async () => {
  await prisma.disconnect;
});

export default sentryHandler(server.createHandler({ path: '/api/graphql' }));
