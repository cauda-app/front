import { ApolloServer } from 'apollo-server-micro';
import { makeExecutableSchema } from 'graphql-tools';

import prismaInstance from '../../graphql/context';
import typeDefs from '../../graphql/typeDefs';
import resolvers from '../../graphql/resolvers';
import { TokenInfo } from '../../graphql/utils/jwt';
import { processCookie } from 'src/utils/next';
import { Main } from 'next/document';

export type Context = {
  res: any;
  req: any;
  tokenInfo?: TokenInfo;
  prisma: typeof prismaInstance;
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
  context: ({ req, res }): Context => {
    return {
      tokenInfo: processCookie(req),
      req,
      res,
      prisma: prismaInstance,
    };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

process.on('exit', async () => {
  await prismaInstance.disconnect;
});

export default server.createHandler({ path: '/api/graphql' });
