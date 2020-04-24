import { mergeResolvers } from 'merge-graphql-schemas';
import client from './client/resolver';
import common from './common/resolver';
import shop from './shop/resolver';
import issuedNumber from './issuedNumber/resolver';

const resolvers = [client, common, shop, issuedNumber];

export default mergeResolvers(resolvers);
