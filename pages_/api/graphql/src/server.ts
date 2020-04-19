import { GraphQLServer } from 'graphql-yoga'
import { makeExecutableSchema } from 'graphql-tools';

import { createContext } from './context'
import typeDefs from './typeDefs';
import resolvers from './resolvers';

const schema = makeExecutableSchema({ typeDefs, resolvers });


new GraphQLServer({ schema, context: createContext }).start(() =>
  console.log(
    `🚀 Server ready at: http://localhost:4000\n⭐️ See sample queries: http://pris.ly/e/ts/graphql-sdl-first#using-the-graphql-api`,
  ),
)
