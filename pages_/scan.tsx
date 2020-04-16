import React, { ComponentType } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Layout from '../src/components/Layout';
import { ReaderProps } from '../src/types/react-qr-reader';
import templateUrl from '../public/qr-template.png';

const QrReader: ComponentType<ReaderProps> = dynamic(
  () => import('react-qr-reader'),
  {
    ssr: false,
  }
);

const Error = ({ error }) => <div>ERROR: {error}</div>;
const QrTemplate = () => (
  <div>
    <img src={templateUrl}></img>
  </div>
);
const Loading = () => {
  const { t } = useTranslation();

  return (
    <Spinner animation="border" variant="primary" role="status">
      <span className="sr-only">{t('common:loading')}</span>
    </Spinner>
  );
};

const Scan = () => {
  const { t } = useTranslation();
  const [error, setError] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  const handleError = (error) => setError(error);
  const handleLoad = () => setLoaded(true);
  const handleScan = (result) => {
    if (result) {
      setProcessing(true);
      fetch('/api/qr').then(async (response) => {
        const { url } = await response.json();
        Router.push(url);
      });
    }
  };

  return (
    <Layout>
      <div className="content d-flex flex-column justify-content-between h-100">
        <Card className="cauda_card cauda_scan mt-3 p-3 p-sm-4 p-md-5 text-center">
          <Card.Body>
            {error ? (
              <Error error={error} />
            ) : (
              <>
                {processing ? (
                  <QrTemplate />
                ) : (
                  <QrReader
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    onLoad={handleLoad}
                  />
                )}
                {loaded ? null : <Loading />}

                {processing ? (
                  <>
                    <Loading />
                    <p className="mb-0">{t('common:processing-qr')}</p>
                  </>
                ) : null}
              </>
            )}
          </Card.Body>
        </Card>
      </div>
      <style jsx>{`
        .cauda_scan {
          margin: 0 auto;
          width: 100%;
          max-width: 280px;
        }
      `}</style>
    </Layout>
  );
};

export default Scan;
