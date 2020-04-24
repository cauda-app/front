import { ApolloServer } from 'apollo-server-micro';
import { makeExecutableSchema } from 'graphql-tools';

import { createContext } from '../../graphql/context';
import typeDefs from '../../graphql/typeDefs';
import resolvers from '../../graphql/resolvers';

//import { verifyToken } from '../../graphql/utils/jwt';
// const res = verifyToken(token);

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
  context: ({ req, res }) => {
    return {
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
