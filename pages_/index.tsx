import { GetServerSideProps } from 'next';
import Link from 'next/link';
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
import GuestLanding from 'src/components/Landing/GuestLanding';
import EmptyLanding from 'src/components/Landing/EmptyLanding';
import { getToken } from 'src/utils/next';
import {
  myTurns as myTurnsFetch,
  myPastTurns as myPastTurnsFetch,
} from 'graphql/issuedNumber/helpers';
import getTurnColor, { Colors } from 'src/utils/colors';
import createPrismaClient from 'prisma/client';
import useFirebaseMessage from 'src/hooks/useFirebaseMessage';

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
  shopId?: string;
  status?: Colors;
  shopName: string;
};

type Props = {
  isLoggedIn: boolean;
  activeTurns: Array<Turn>;
  pastTurns: Array<Turn>;
};

const MyTurns = ({
  activeTurns: myTurns,
  pastTurns: myPastTurns,
  isLoggedIn,
}: Props) => {
  const { t } = useTranslation();
  useFirebaseMessage();

  if (!isLoggedIn) {
    return <GuestLanding />;
  }

  if (myTurns.length === 0 && myPastTurns.length === 0) {
    return <EmptyLanding />;
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

        {myTurns.length === 0 ? null : (
          <Card className="cauda_card cauda_shop mt-3 my_turns">
            <Card.Header className="text-center">
              {t('common:my-active-turns')}
            </Card.Header>
            <Card.Body>
              <ul className="list-unstyled">
                {myTurns.map((turn) => (
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

        {myPastTurns.length === 0 ? null : (
          <Card className="cauda_card cauda_shop mt-3 my_turns inactive">
            <Card.Body>
              <div className="text-center mb-2">
                {t('common:my-past-turns')}
              </div>

              <ul className="list-unstyled">
                {myPastTurns.map((turn) => (
                  <li key={turn.id}>
                    <Link href="/[shopId]" as={'/' + turn.shopId} passHref>
                      <Button variant="outline-dark" size="lg">
                        <div className="primary">
                          <p className="mb-0">
                            {turn.shopName}
                            <br />
                            <strong
                              className={`list-inline-item text-${getTurnColor(
                                turn.status!
                              )}`}
                            >
                              {t(`common:turn-status-${turn.status}`)}
                            </strong>
                          </p>
                        </div>
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
  if (!token || !token.clientId) {
    return { props: { isLoggedIn: false } };
  }

  const prisma = createPrismaClient();

  const clientId = token.clientId;
  const [activeTurns, pastTurns] = await Promise.all([
    myTurnsFetch(clientId, prisma),
    myPastTurnsFetch(clientId, prisma),
  ]);

  await prisma.disconnect();

  return {
    props: {
      isLoggedIn: true,
      activeTurns,
      pastTurns,
    },
  };
};

export default MyTurns;
