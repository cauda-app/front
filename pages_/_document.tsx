import Document, { Html, Head, Main, NextScript } from 'next/document';
import * as Sentry from '@sentry/browser';

process.on('unhandledRejection', (err) => {
  Sentry.captureException(err);
});

process.on('uncaughtException', (err) => {
  Sentry.captureException(err);
});

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_PLACES_KEY}&libraries=places&language=es&region=AR"`} // TODO: Fixed for Argentina
            async
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
