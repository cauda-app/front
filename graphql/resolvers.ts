import { mergeResolvers } from 'merge-graphql-schemas';
import clientResolver from './resolvers/client';
import commonResolver from './resolvers/common';
import shopResolver from './resolvers/shop';

export default mergeResolvers([clientResolver, commonResolver, shopResolver]);
