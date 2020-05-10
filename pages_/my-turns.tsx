import { useState, useEffect } from 'react';
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
import Spinner from 'src/components/Spinner';

// type Props = {};

const MyTurns = () => {
  const { t } = useTranslation();

  const [myTurns, setMyTurns] = useState<any>();
  const [error, setError] = useState();

  const getTurns = async () => {
    const MY_TURNS = /* GraphQL */ `
      query MyTurns {
        myTurns {
          shopId
          shopName
          turnInfo {
            id
            status
            turn
          }
        }
      }
    `;

    try {
      const res = await graphqlClient.request(MY_TURNS);
      setMyTurns(res.myTurns);
    } catch (error) {
      setError(error);
    }
  };

  // fetch data
  useEffect(() => {
    getTurns();

    const interval = setInterval(() => {
      getTurns();
    }, 10_000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <Layout>{String(error)}</Layout>;
  }

  if (!myTurns) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

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
              {myTurns.map((pendingTurn, index) => {
                return (
                  <li key={index}>
                    <Button href={'/shops'} variant="outline-success" size="lg">
                      <div className="primary">{pendingTurn.shopName}</div>
                      <div className="secondary">
                        <span className="number">
                          {pendingTurn.turnInfo.turn}
                        </span>
                        <FontAwesomeIcon icon={faArrowRight} fixedWidth />
                      </div>
                    </Button>
                  </li>
                );
              })}
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
