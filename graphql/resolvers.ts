import { mergeResolvers } from 'merge-graphql-schemas';
import client from './client/resolver';
import common from './common/resolver';
import shop from './shop/resolver';
import issuedNumber from './issuedNumber/resolver';
import phoneVerification from './phoneVerification/resolver';

const resolvers = [client, common, shop, issuedNumber, phoneVerification];

export default mergeResolvers(resolvers);
