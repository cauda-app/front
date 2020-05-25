import { GetServerSideProps } from 'next';
import Link from 'next/link';
import useSWR from 'swr';
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
import Layout from 'src/components/Layout';
import EmptyLanding from 'src/components/Landing/EmptyLanding';
import { getToken } from 'src/utils/next';
import prismaClient from 'prisma/client';
import graphqlClient from 'src/graphqlClient';
import { myTurns, myPastTurns } from 'graphql/issuedNumber/helpers';

export const MY_TURNS = /* GraphQL */ `
  query MyTurns {
    myTurns {
      id
      turn
      shopName
    }
  }
`;

export const MY_PAST_TURNS = /* GraphQL */ `
  query MyPastTurns {
    myPastTurns {
      id
      turn
      shopName
    }
  }
`;

type Turn = {
  id: string;
  turn: string;
  shopName: string;
};

type Props = {
  activeTurns: Array<Turn>;
  pastTurns: Array<Turn>;
};

const fetcher = (query) => graphqlClient.request(query);

const MyTurns = ({ activeTurns = [], pastTurns = [] }: Props) => {
  const { t } = useTranslation();
  const { data: myTurnsData, error: myTurnsError } = useSWR(MY_TURNS, fetcher, {
    initialData: { myTurns: activeTurns },
  });
  const { data: myPastTurnsData, error: myPastTurnsError } = useSWR(
    MY_PAST_TURNS,
    fetcher,
    {
      initialData: { myPastTurns: pastTurns },
    }
  );

  if (
    myTurnsData.myTurns.length === 0 &&
    myPastTurnsData.myPastTurns.length === 0
  ) {
    return <EmptyLanding />;
  }

  if (myTurnsError || myPastTurnsError) {
    throw myTurnsError || myPastTurnsError;
  }

  return (
    <Layout>
      <div className="content d-flex flex-column justify-content-start align-items-center h-100">
        <Row className="home_nav">
          <Col xs="auto">
            <Link href={'/shops'} passHref>
              <Button
                variant="primary"
                size="sm"
                className="d-flex justify-content-between align-items-center py-2"
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} fixedWidth />
                {t('common:nearby-shops')}
                <div></div>
              </Button>
            </Link>
          </Col>
          <Col xs="auto">
            <Link href={'/scan'} passHref>
              <Button
                variant="secondary"
                size="sm"
                className="d-flex justify-content-between align-items-center py-2"
              >
                <FontAwesomeIcon icon={faCamera} fixedWidth />
                {t('common:scan-qr-code')}
                <div></div>
              </Button>
            </Link>
          </Col>
        </Row>

        {myTurnsData.myTurns.length === 0 ? null : (
          <Card className="cauda_card cauda_shop mt-3 my_turns">
            <Card.Header className="text-center">
              {t('common:my-active-turns')}
            </Card.Header>
            <Card.Body>
              <ul className="list-unstyled">
                {myTurnsData.myTurns.map((turn) => (
                  <li key={turn.id}>
                    <Link
                      href="/turn/[turnId]"
                      as={'/turn/' + turn.id}
                      passHref
                    >
                      <Button variant="outline-success" size="lg">
                        <div className="primary">{turn.shopName}</div>
                        <div className="secondary">
                          <span className="number">{turn.turn}</span>
                          <FontAwesomeIcon icon={faArrowRight} fixedWidth />
                        </div>
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        )}

        {myPastTurnsData.myPastTurns.length === 0 ? null : (
          <Card className="cauda_card cauda_shop mt-3 my_turns inactive">
            <Card.Body>
              <div className="text-center mb-2">
                {t('common:my-past-turns')}
              </div>

              <ul className="list-unstyled">
                {myPastTurnsData.myPastTurns.map((turn) => (
                  <li key={turn.id}>
                    <Link
                      href="/turn/[turnId]"
                      as={'/turn/' + turn.id}
                      passHref
                    >
                      <Button variant="outline-dark" size="lg">
                        <div className="primary">{turn.shopName}</div>
                        <div className="secondary">
                          <span className="numberbox">{turn.turn}</span>
                          <FontAwesomeIcon icon={faArrowRight} fixedWidth />
                        </div>
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        )}

        <Row className="w-100">
          <Col className="d-flex justify-content-center align-items-center mx-auto">
            <Link href="/my-shop" passHref>
              <Button
                variant="info"
                size="lg"
                className="btn_myshop tertiary d-flex justify-content-between align-items-center py-2"
              >
                <FontAwesomeIcon icon={faStoreAlt} fixedWidth />
                {t('common:my-shop')}
                <div></div>
              </Button>
            </Link>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = getToken(context);
  if (!token) {
    return { props: { isLoggedIn: false } };
  }

  const clientId = token.clientId;
  if (!clientId) {
    return { props: { isLoggedIn: true } };
  }

  const [activeTurns, pastTurns] = await Promise.all([
    myTurns(clientId, prismaClient),
    myPastTurns(clientId, prismaClient),
  ]);

  return {
    props: {
      isLoggedIn: true,
      activeTurns,
      pastTurns,
    },
  };
};

export default MyTurns;
