import { ApolloServer } from 'apollo-server-micro';
import { makeExecutableSchema } from 'graphql-tools';
import nextCookie from 'next-cookies';

import prismaInstance from '../../graphql/context';
import typeDefs from '../../graphql/typeDefs';
import resolvers from '../../graphql/resolvers';
import { verifyToken, TokenInfo } from '../../graphql/utils/jwt';

export type Context = {
  res: any;
  req: any;
  tokenInfo: TokenInfo;
  prisma: typeof prismaInstance;
};

const processCookie = (req: any): TokenInfo => {
  const { token } = nextCookie({ req });
  if (!token) {
    return { isValid: false };
  }

  return verifyToken(token);

  // if (res.phone) {
  //   try {
  //     await prismaInstance.phoneVerification.update({
  //       where: {
  //         phone: res.phone,
  //       },
  //       data: {
  //         verified: null,
  //       },
  //     });
  //     return undefined;
  //   } catch (error) {
  //     return undefined;
  //   }
  // }
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

export default server.createHandler({ path: '/api/graphql' });
