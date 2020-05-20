import React, { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';
import Card from 'react-bootstrap/Card';
import Spinner from '../src/components/Spinner';
import Layout from '../src/components/Layout';
import { ReaderProps } from '../src/types/react-qr-reader';
import img_templateUrl from '../public/cauda_qrcode@3x.png';
import img_scanningUrl from '../public/cauda_scanqr@3x.png';
import GoBack from 'src/components/GoBack';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';

const QrReader: ComponentType<ReaderProps> = dynamic(
  () => import('react-qr-reader'),
  {
    ssr: false,
  }
);

const QrTemplate = () => (
  <div>
    <img className="img-fluid" src={img_templateUrl}></img>
  </div>
);
const Loading = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-1 d-flex align-content-center justify-content-center">
      <Spinner />
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
    }
  };

  return (
    <Layout>
      <div className="content d-flex flex-column justify-content-between">
        <Card className="cauda_card cauda_scan p-4 text-center">
          <Card.Body className="p-0">
            {error ? (
              t('common:qr-reader-error')
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
      <div className="p-4">
        <Link href={'/'} passHref>
          <Button
            block
            type="button"
            variant="danger"
            size="lg"
            className="mt-4"
          >
            {t('common:cancel')}
          </Button>
        </Link>
      </div>
      <style jsx>{`
        .cauda_scan {
        }
      `}</style>
    </Layout>
  );
};

export default Scan;
