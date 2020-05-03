import useTranslation from 'next-translate/useTranslation';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { faStoreAlt } from '@fortawesome/free-solid-svg-icons';
import Router from 'next/router';

import Layout from 'src/components/Layout';
import graphqlClient from 'src/graphqlClient';
import { getErrorCodeFromApollo } from 'src/utils';

// type Props = {};

const MyTurns = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="content d-flex flex-column justify-content-between align-items-center h-100">
        <Row>
          <Col xs="12">
            <Button
              href={'/shops'}
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

        <Card className="cauda_card cauda_shop">
          <Card.Header>{t('common:my-active-turns')}</Card.Header>
          <Card.Body>
            <div>Comercio 1 A21</div>
            <div>Comercio 2 B32</div>
          </Card.Body>
        </Card>
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

export default MyTurns;
