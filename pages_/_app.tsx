import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import * as Sentry from '@sentry/browser';
import TagManager from 'react-gtm-module';

import 'src/assets/scss/app.scss';
import Spinner from 'src/components/Spinner';
import ErrorBoundary from 'src/components/ErrorBoundary';
import NotificationProvider from 'src/components/NotificationProvider';
import { firebaseCloudMessaging } from 'src/utils/web-push';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

const tagManagerArgs = {
  gtmId: 'GTM-MBSR3WR',
};

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);

  const setIsLoading = () => setLoading(true);
  const cancelIsLoading = () => setLoading(false);

  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
    firebaseCloudMessaging.init();
  }, []);

  useEffect(() => {
    Router.events.on('routeChangeStart', setIsLoading);
    Router.events.on('routeChangeComplete', cancelIsLoading);

    return () => {
      Router.events.off('routeChangeStart', setIsLoading);
      Router.events.off('routeChangeComplete', cancelIsLoading);
    };
  }, []);

  return (
    <ErrorBoundary>
      {loading ? (
        <div>
          <Spinner />
          <style jsx>
            {`
              div {
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            `}
          </style>
        </div>
      ) : (
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
      )}
    </ErrorBoundary>
  );
}
