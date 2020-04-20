import { mergeResolvers } from 'merge-graphql-schemas';
import client from './client/resolver';
import common from './common/resolver';
import shop from './shop/resolver';

const resolvers = [client, common, shop];

export default mergeResolvers(resolvers);
