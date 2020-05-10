import { useEffect, useState } from 'react';
import Router from 'next/router';
import '../src/assets/scss/app.scss';
import Spinner from 'src/components/Spinner';

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);

  const setIsLoading = () => setLoading(true);
  const cancelIsLoading = () => setLoading(false);

  useEffect(() => {
    Router.events.on('routeChangeStart', setIsLoading);
    Router.events.on('routeChangeComplete', cancelIsLoading);

    return () => {
      Router.events.off('routeChangeStart', setIsLoading);
      Router.events.off('routeChangeComplete', cancelIsLoading);
    };
  }, []);

  return loading ? (
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
    <Component {...pageProps} />
  );
}
