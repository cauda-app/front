import { useEffect, useRef } from 'react';
import Router from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Card from 'react-bootstrap/Card';
import { GetServerSideProps } from 'next';
import { getToken } from 'src/utils/next';
import Layout from 'src/components/Layout';
import Spinner from 'src/components/Spinner';
import { encodeId } from 'src/utils/hashids';
import logo from 'public/favicon.ico';

type Props = {
  isLoggedIn: boolean;
  shopId?: number;
};

const Flyer = ({ isLoggedIn, shopId }: Props) => {
  const { t } = useTranslation();
  const qrRef = useRef(null);
  const shopUrl = 'https://cauda.app/' + shopId;

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
      colorDark: '#0075db',
      dotScale: 0.7,
      width: 256,
      height: 256,
      logoHeight: 64,
      logoWidth: 64,
      logo: logo,
      logoBackgroundTransparent: true,
      text: shopUrl,
    };
    import('easyqrcodejs').then((module) => {
      new module.default(qrRef.current, options);
    });
  }, [shopId, shopUrl]);

  if (!shopId) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <Card className="cauda_card mb-4 mx-auto">
        <Card.Body className="p-2 text-center">
          <div ref={qrRef} />
          {shopUrl}
        </Card.Body>
      </Card>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = getToken(context);

  if (!token) {
    return { props: { isLoggedIn: false } };
  }

  return { props: { isLoggedIn: true, shopId: encodeId(token.shopId) } };
};

export default Flyer;
