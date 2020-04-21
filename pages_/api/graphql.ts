import { ApolloServer } from 'apollo-server-micro';
import { createContext } from '../../graphql/context';
import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from '../../graphql/typeDefs';
import resolvers from '../../graphql/resolvers';

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
  context: (/* { event, context } */) => (    
    {
      // headers: event.headers,
      // event,
      ...createContext(),
    }
  ),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default server.createHandler({ path: '/api/graphql' });
