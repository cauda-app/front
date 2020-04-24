import React, { ComponentType } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Layout from '../src/components/Layout';
import { ReaderProps } from '../src/types/react-qr-reader';
import img_templateUrl from '../public/cauda_qrcode@3x.png';
import img_scanningUrl from '../public/cauda_scanqr@3x.png';

const QrReader: ComponentType<ReaderProps> = dynamic(
  () => import('react-qr-reader'),
  {
    ssr: false,
  }
);

const Error = ({ error }) => <div>ERROR: {error}</div>;
const QrTemplate = () => (
  <div>
    <img className="img-fluid" src={img_templateUrl}></img>
  </div>
);
const Loading = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-1 d-flex align-content-center justify-content-center">
      <Spinner animation="border" variant="primary" role="status">
        <span className="sr-only">{t('common:loading')}</span>
      </Spinner>
      <p className="ml-2 mt-1 mb-0">{t('common:loading')}</p>
    </div>
  );
};

const Scan = () => {
  const { t } = useTranslation();
  const [error, setError] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [result, setResult] = React.useState(false);

  const handleError = (error) => setError(error);
  const handleLoad = () => setLoaded(true);
  const handleScan = (result) => {
    if (result) {
      setProcessing(true);
      setResult(result);
      fetch('/api/qr').then(async (response) => {
        const { url } = await response.json();
        Router.push(url);
      });
    }
  };

  return (
    <Layout>
      <div className="content d-flex flex-column justify-content-between h-100">
        <Card className="cauda_card cauda_scan p-4 text-center">
          <Card.Body className="p-0">
            {error ? (
              <Error error={error} />
            ) : (
              <>
                <div className="scanning_bar">
                  <img className="img-fluid" src={img_scanningUrl}></img>
                </div>

                {processing ? (
                  <QrTemplate />
                ) : (
                  <QrReader
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    onLoad={handleLoad}
                    showViewFinder={false}
                  />
                )}
                {loaded ? null : <Loading />}

                {processing ? (
                  <>
                    <p className="mb-0">{result}</p>
                  </>
                ) : null}
              </>
            )}
          </Card.Body>
        </Card>
      </div>
      <style jsx>{`
        .cauda_scan {
        }
      `}</style>
    </Layout>
  );
};

export default Scan;
