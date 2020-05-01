import { GraphQLClient } from 'graphql-request';

const graphQLClient = new GraphQLClient('/api/graphql' /* , { headers: {} } */);

export default graphQLClient;
