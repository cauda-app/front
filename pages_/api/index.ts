//import { ApolloServer } from 'apollo-server-micro';
import { ApolloServer } from 'apollo-server-lambda';
import { createContext } from '../../graphql/context';

import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from '../../graphql/typeDefs';
import resolvers from '../../graphql/resolvers';

const schema = makeExecutableSchema({ typeDefs, resolvers });

// const apolloServer = new ApolloServer({ schema, context: createContext });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default apolloServer.createHandler({ path: '/api/graphql' });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
    ...createContext()
  }),
});

exports.handler = server.createHandler();
