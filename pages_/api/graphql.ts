import { ApolloServer } from 'apollo-server-micro';
import { makeExecutableSchema } from 'graphql-tools';
import nextCookie from 'next-cookies';

import { createContext } from '../../graphql/context';
import typeDefs from '../../graphql/typeDefs';
import resolvers from '../../graphql/resolvers';
import { verifyToken } from '../../graphql/utils/jwt';


const getUserInfoFromCookie = (req: any) => {
  const { token } = nextCookie({req});
  const res = verifyToken(token);
  console.log(res);
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
  context: ({ req, res }) => {    
    return {
      userInfo: getUserInfoFromCookie(req),
      req,
      res,
      ...createContext(),
    };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default server.createHandler({ path: '/api/graphql' });
