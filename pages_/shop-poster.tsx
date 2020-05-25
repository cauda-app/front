import { useEffect, useRef } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { GetServerSideProps } from 'next';
import { getToken } from 'src/utils/next';
import Layout from 'src/components/Layout';
import Spinner from 'src/components/Spinner';
import { encodeId } from 'src/utils/hashids';
import logo from 'public/cauda_favicon_black.svg';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

type Props = {
  isLoggedIn: boolean;
  shopId?: number;
};

const ShopPoster = ({ isLoggedIn, shopId }: Props) => {
  const { t } = useTranslation();
  const qrRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push('/register-phone?redirectTo=/flyer');
    } else if (!shopId) {
      Router.push('/');
    }
  }, [isLoggedIn, shopId]);

  useEffect(() => {
    if (!shopId) {
      return;
    }

    const options = {
      dotScale: 0.7,
      width: 1024,
      height: 1024,
      logoHeight: 256,
      logoWidth: 256,
      logo: logo,
      logoBackgroundTransparent: true,
      text: 'https://cauda.app/' + shopId,
    };
    import('easyqrcodejs').then((module) => {
      new module.default(qrRef.current, options);
    });
  }, [shopId, shopId]);

  if (!shopId) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>

      <div className="actions mt-3 d-print-none text-center">
        <Button
          onClick={() => window.print()}
          size="lg"
          variant="primary"
          className="Xd-flex justify-content-between align-items-center py-2"
        >
          <FontAwesomeIcon icon={faPrint} fixedWidth className="mr-2" />
          {t('common:print')}
          <div></div>
        </Button>
      </div>
      <div className="poster">
        <img src="/cauda_poster_empty.png" className="img-fluid" />
        <div className="qr_target" ref={qrRef} />
        <div className="url_target">cauda.app/{shopId}</div>
        <style jsx>{`
          .actions {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .poster {
            margin: 0 auto;
            position: relative;
            max-width: 1190px;
            text-align: center;
          }
          .poster > img {
            user-select: none;
            pointer-events: none;
          }
          .img-fluid {
            max-width: 98%;
            height: auto;
          }
          .qr_target {
            position: absolute;
            top: 40%;
            width: 100%;
          }
          .url_target {
            position: absolute;
            bottom: 9%;
            width: 100%;
            font-size: 3.5vw;
            font-weight: bold;
          }
          @media (min-width: 1190px) {
            .url_target {
              font-size: 42px;
            }
          }
          @media print {
            @page {
              margin: 0;
            }
            body {
              margin: 1.6cm;
            }
          }
        `}</style>
        <style jsx global>{`
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
              'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
              'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
              'Noto Color Emoji';
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: #000;
            text-align: left;
            background: #fff !important;
          }
          .qr_target img {
            width: 38%;
            max-width: 100%;
            height: auto;
            background: lime;
          }
        `}</style>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = getToken(context);

  if (!token) {
    return { props: { isLoggedIn: false } };
  }

  return { props: { isLoggedIn: true, shopId: encodeId(token.shopId) } };
};

export default ShopPoster;
