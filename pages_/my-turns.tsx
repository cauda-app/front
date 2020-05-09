import useTranslation from 'next-translate/useTranslation';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
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
      <div className="content d-flex flex-column justify-content-start align-items-center h-100">
        <Row className="home_nav">
          <Col xs="auto">
            <Button
              href={'/shops'}
              variant="primary"
              size="sm"
              className="d-flex justify-content-between align-items-center py-2"
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} fixedWidth />
              {t('common:nearby-shops')}
              <div></div>
            </Button>
          </Col>
          <Col xs="auto">
            <Button
              href="/scan"
              variant="secondary"
              size="sm"
              className="d-flex justify-content-between align-items-center py-2"
            >
              <FontAwesomeIcon icon={faCamera} fixedWidth />
              {t('common:scan-qr-code')}
              <div></div>
            </Button>
          </Col>
        </Row>

        <Card className="cauda_card cauda_shop mt-3 my_turns">
          <Card.Header className="text-center">
            {t('common:my-active-turns')}
          </Card.Header>
          <Card.Body>
            <ul className="list-unstyled">
              <li>
                <Button href={'/shops'} variant="outline-success" size="lg">
                  <div className="primary">Short Shop Name</div>
                  <div className="secondary">
                    <span className="number">A22</span>
                    <FontAwesomeIcon icon={faArrowRight} fixedWidth />
                  </div>
                </Button>
              </li>
              <li>
                <Button href={'/shops'} variant="outline-success" size="lg">
                  <div className="primary">Shop With Two Lines Long Name</div>
                  <div className="secondary">
                    <span className="number">B300</span>
                    <FontAwesomeIcon icon={faArrowRight} fixedWidth />
                  </div>
                </Button>
              </li>
            </ul>
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
