import React, { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Spinner from '../src/components/Spinner';
import Layout from '../src/components/Layout';
import { ReaderProps } from '../src/types/react-qr-reader';
import img_scanningUrl from '../public/cauda_scanqr@3x.png';
import useFirebaseMessage from 'src/hooks/useFirebaseMessage';

const QrReader: ComponentType<ReaderProps> = dynamic(
  () => import('react-qr-reader'),
  {
    ssr: false,
  }
);

const Scan = () => {
  const { t } = useTranslation();
  useFirebaseMessage();
  const [codeError, setCodeError] = React.useState(false);
  const [readerError, setReaderError] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  const handleError = () => setReaderError(true);
  const handleLoad = () => setLoaded(true);
  const handleScan = (result) => {
    if (result) {
      try {
        const url = new URL(result);
        if (url.origin === window.location.origin) {
          Router.push(url.pathname);
        } else {
          setCodeError(true);
        }
      } catch (error) {
        setCodeError(true);
      }
    }
  };

  return (
    <Layout>
      <Card className="cauda_card cauda_scan p-4 text-center mb-3">
        <Card.Body className="p-0">
          {readerError ? (
            t('common:qr-reader-error')
          ) : (
            <>
              <div className="scanning_bar">
                <img className="img-fluid" src={img_scanningUrl}></img>
              </div>
              <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                onLoad={handleLoad}
                showViewFinder={false}
              />
              {loaded ? null : <Spinner />}
            </>
          )}
        </Card.Body>
      </Card>

      <Card className="cauda_card cauda_card--clean mb-4 mx-auto">
        <Card.Body className="p-0 text-center d-flex flex-column justify-content-center align-items-center">
          {codeError ? (
            <p className="alert alert-secondary">
              {t('common:invalid-code-error')}
            </p>
          ) : null}

          <Link href="/" passHref>
            <Button block type="button" variant="danger" size="lg">
              {t('common:cancel')}
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default Scan;
