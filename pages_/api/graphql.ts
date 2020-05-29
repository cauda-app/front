import { ApolloServer } from 'apollo-server-micro';
import { makeExecutableSchema } from 'graphql-tools';
import * as Sentry from '@sentry/node';
import admin from 'firebase-admin';

import { Context } from 'graphql/context';
import createPrismaClient from 'prisma/client';
import typeDefs from 'graphql/typeDefs';
import resolvers from 'graphql/resolvers';
import { processCookie } from 'src/utils/next';
import { apolloServerSentryPlugin } from 'graphql/plugins';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

if (admin.apps.length === 0) {
  const firebaseService = (process.env.FIREBASE_CONFIG || '{}').replace(
    /\\\\/g, // escape private_key backslashes
    '\\'
  );
  const firebaseServiceConfig = JSON.parse(firebaseService);

  admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceConfig),
    databaseURL: 'https://cauda-51729.firebaseio.com',
  });
}

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
const prisma = createPrismaClient();

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
  engine: { apiKey: process.env.APOLLO_ENGINE_KEY },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

process.on('exit', async () => {
  await prisma.disconnect();
});

export default sentryHandler(server.createHandler({ path: '/api/graphql' }));
