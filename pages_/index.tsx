import { useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { faStoreAlt } from '@fortawesome/free-solid-svg-icons';
import { withRouter, SingletonRouter } from 'next/router';

import Layout from 'src/components/Layout';
import graphqlClient from 'src/graphql-config';
import { route } from 'next/dist/next-server/server/router';

type Props = {
  router: SingletonRouter;
};

const Home = ({ router }: Props) => {
  const { t } = useTranslation();

  const onMyShopClick = () => {
    graphqlClient
      .request(`{ myShop { id } }`)
      .then((data) => {
        router.push('/my-shop');
      })
      .catch((error) => {
        const errorCode = error.response?.errors[0]?.extensions?.code;

        if (['NO_TOKEN_PROVIDED'].includes(errorCode)) {
          return router.push('/form-shop');
        }

        if (['EXPIRED_TOKEN', 'INVALID_TOKEN'].includes(errorCode)) {
          return router.push('/verify-phone');
        }

        return router.push('/generic-error');
      });
  };

  return (
    <Layout>
      <div className="content d-flex flex-column justify-content-between align-items-center h-100">
        <div></div>
        <Card className="cauda_card mt-3 px-3 py-4 p-sm-5 mb-5">
          <Row>
            <Col xs="12">
              <Button
                href="/shops"
                variant="primary"
                size="lg"
                className="mb-4 d-flex justify-content-between align-items-center py-4 p-sm-3"
                block
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} fixedWidth />
                {t('common:nearby-shops')}
                <div></div>
              </Button>
            </Col>
            <Col xs="12">
              <Button
                href="/scan"
                variant="secondary"
                size="lg"
                className="d-flex justify-content-between align-items-center py-4 p-sm-3"
                block
              >
                <FontAwesomeIcon icon={faCamera} fixedWidth />
                {t('common:scan-qr-code')}
                <div></div>
              </Button>
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

export default withRouter(Home);
