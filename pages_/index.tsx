import Router from 'next/router';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { faStoreAlt } from '@fortawesome/free-solid-svg-icons';

import Layout from 'src/components/Layout';
import graphqlClient from 'src/graphqlClient';
import { getErrorCodeFromApollo } from 'src/utils';

const Home = () => {
  const { t } = useTranslation();

  const onMyShopClick = async () => {
    try {
      const response = await graphqlClient.request('{ myShop { id } }');
      if (response) {
        Router.push('/my-shop');
      }
    } catch (error) {
      const errorCode = getErrorCodeFromApollo(error);

      if (
        ['NO_TOKEN_PROVIDED', 'EXPIRED_TOKEN', 'INVALID_TOKEN'].includes(
          errorCode
        )
      ) {
        return Router.push('/register-phone?redirectTo=/my-shop');
      }

      if (errorCode === 'INVALID_SHOP_ID') {
        return Router.push('/form-shop');
      }

      return Router.push('/generic-error');
    }
  };

  return (
    <Layout>
      <div className="content d-flex flex-column justify-content-between align-items-center h-100">
        <div></div>
        <Card className="cauda_card mt-3 px-3 py-4 p-sm-5 mb-5">
          <Row>
            <Col xs="12">
              <Link href="/shops" passHref>
                <Button
                  as="a"
                  variant="primary"
                  size="lg"
                  className="mb-4 d-flex justify-content-between align-items-center py-4 p-sm-3"
                  block
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} fixedWidth />
                  {t('common:nearby-shops')}
                  <div></div>
                </Button>
              </Link>
            </Col>
            <Col xs="12">
              <Link href="/scan" passHref>
                <Button
                  as="a"
                  variant="secondary"
                  size="lg"
                  className="d-flex justify-content-between align-items-center py-4 p-sm-3"
                  block
                >
                  <FontAwesomeIcon icon={faCamera} fixedWidth />
                  {t('common:scan-qr-code')}
                  <div></div>
                </Button>
              </Link>
            </Col>
          </Row>
        </Card>

        <Row className="w-100">
          <Col className="d-flex justify-content-center align-items-center mx-auto">
            <Button
              onClick={onMyShopClick}
              variant="info"
              size="lg"
              className="btn_myshop tertiary d-flex justify-content-between align-items-center py-2"
            >
              <FontAwesomeIcon icon={faStoreAlt} fixedWidth />
              {t('common:my-shop')}
              <div></div>
            </Button>
          </Col>
        </Row>
      </div>

      <style jsx global>{`
        .btn_myshop {
          width: 100%;
          max-width: 220px;
        }
      `}</style>
    </Layout>
  );
};

export default Home;
