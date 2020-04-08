import React from 'react';
import withApollo from 'next-with-apollo';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

export default withApollo(
  ({ initialState }) => {
    return new ApolloClient({
      uri: '/graphql',
      cache: new InMemoryCache().restore(initialState || {}),
    });
  },
  {
    render: ({ Page, props }) => {
      return (
        <ApolloProvider client={props.apollo}>
          <Page {...props} />
        </ApolloProvider>
      );
    },
  }
);
