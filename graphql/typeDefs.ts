import { mergeTypes } from 'merge-graphql-schemas';
import clientSchema from './client/schema.graphql';
import commonSchema from './common/common.graphql';
import issuedNumberSchema from './issuedNumber/schema.graphql';
import shopSchema from './shop/schema.graphql';
import phoneVerification from './phoneVerification/schema.graphql';


export default mergeTypes(
  [clientSchema, commonSchema, issuedNumberSchema, shopSchema, phoneVerification],
  { all: true }
);
