import * as Sentry from '@sentry/node';
import { Context } from './context';

export const apolloServerSentryPlugin = {
  // For plugin definition see the docs: https://www.apollographql.com/docs/apollo-server/integrations/plugins/
  requestDidStart() {
    return {
      didEncounterErrors(rc) {
        Sentry.withScope((scope) => {
          scope.addEventProcessor((event) =>
            Sentry.Handlers.parseRequest(event, (rc.context as Context).req)
          );

          const tokenInfo = (rc.context as Context).tokenInfo;
          if (tokenInfo) {
            scope.setUser({
              clientId: String(tokenInfo.clientId),
              shopId: String(tokenInfo.shopId),
              phone: tokenInfo.phone,
              ip_address: (rc.context as any).req?.ip,
            });
          }

          scope.setTags({
            graphql: rc.operation?.operation || 'parse_err',
            graphqlName:
              (rc.operationName as any) || (rc.request.operationName as any),
          });

          rc.errors.forEach((error) => {
            if (error.path || error.name !== 'GraphQLError') {
              scope.setExtras({
                path: error.path,
              });
              Sentry.captureException(error);
            } else {
              scope.setExtras({});
              Sentry.captureMessage(`GraphQLWrongQuery: ${error.message}`);
            }
          });
        });
      },
    };
  },
};
