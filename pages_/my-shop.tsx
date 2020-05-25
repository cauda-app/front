import { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { GetServerSideProps } from 'next';
import * as Sentry from '@sentry/browser';

import { getToken } from 'src/utils/next';
import Layout from 'src/components/Layout';
import Spinner from 'src/components/Spinner';
import graphqlClient from 'src/graphqlClient';

type Props = {
  isLoggedIn: boolean;
  shopId?: number;
};

const MyShop = ({ isLoggedIn, shopId }: Props) => {
  const { t } = useTranslation();

  const [myShop, setMyShop] = useState<any>();
  const [error, setError] = useState();
  const [actionLoading, setActionLoading] = useState(false);

  const nextTurn = async (op: 'ATTEND' | 'SKIP') => {
    setActionLoading(true);
    const NEXT_TURN = /* GraphQL */ `
      mutation NextTurn($op: NextTurnOperation!) {
        nextTurn(op: $op) {
          nextTurn
          lastTurns {
            status
            turn
          }
          pendingTurnsAmount
        }
      }
    `;

    try {
      const res = await graphqlClient.request(NEXT_TURN, { op });
      setMyShop({ ...myShop, ...res.nextTurn });
      setActionLoading(false);
    } catch (error) {
      setError(error);
      setActionLoading(false);
      Sentry.captureException(error);
    }
  };

  const cancelTurns = async () => {
    setActionLoading(true);
    const CANCEL_TURNS = /* GraphQL */ `
      mutation CancelTurns {
        cancelTurns {
          nextTurn
          lastTurns {
            status
            turn
          }
          pendingTurnsAmount
        }
      }
    `;

    try {
      const res = await graphqlClient.request(CANCEL_TURNS);
      setMyShop({ ...myShop, ...res.cancelTurns });
      setActionLoading(false);
    } catch (error) {
      setError(error);
      setActionLoading(false);
      Sentry.captureException(error);
    }
  };

  const getShopData = async () => {
    if (!shopId) {
      return;
    }

    const MY_SHOP = /* GraphQL */ `
      query MyShop {
        myShop {
          details {
            name
          }
          nextTurn
          lastTurns {
            status
            turn
          }
          pendingTurnsAmount
        }
      }
    `;

    try {
      const res = await graphqlClient.request(MY_SHOP);
      setMyShop(res.myShop);
    } catch (error) {
      setError(error);
      Sentry.captureException(error);
    }
  };

  const getTurnColor = (status: 'ATTENDED' | 'SKIPPED' | 'CANCELLED') => {
    if (status === 'ATTENDED') {
      return 'success';
    }

    if (status === 'SKIPPED') {
      return 'danger';
    }

    if (status === 'CANCELLED') {
      return 'warning';
    }
  };

  // fetch data
  useEffect(() => {
    getShopData();

    const interval = setInterval(() => {
      getShopData();
    }, 15_000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push('/register-phone?redirectTo=/my-shop');
    } else if (!shopId) {
      Router.push('/shop-form');
    }
  }, [isLoggedIn, shopId]);

  if (error) {
    throw error;
  }

  if (!myShop) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <Card className="cauda_card mb-4 mx-auto">
        <Card.Header className="d-flex justify-content-between align-items-center px-0">
          <Link href="/" passHref>
            <Button variant="link" className="py-0 text-dark">
              <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
            </Button>
          </Link>
          <span className="text-truncate">{myShop!.details.name}</span>
          <Link href="/shop-form" passHref>
            <Button variant="link" size="sm">
              <FontAwesomeIcon icon={faPen} className="mr-2" />
            </Button>
          </Link>
        </Card.Header>

        <Card.Body className="p-2 text-center">
          {myShop!.nextTurn ? (
            <>
              <p className="myturn__number display-5 text-uppercase">
                {t('common:next-turn')}
              </p>
              <p className="myturn__number display-1">{myShop!.nextTurn}</p>

              <div className="pl-4 pr-4">
                <Button
                  disabled={actionLoading}
                  onClick={() => nextTurn('ATTEND')}
                  variant="success"
                  size="lg"
                  className="d-flex justify-content-center align-items-center"
                  block
                >
                  {t('common:attend-turn')}
                </Button>

                <Button
                  disabled={actionLoading}
                  onClick={() => nextTurn('SKIP')}
                  variant="danger"
                  size="lg"
                  className="d-flex justify-content-center align-items-center"
                  block
                >
                  {t('common:turn-missed')}
                </Button>
              </div>
            </>
          ) : (
            <p className="myturn__number display-5 text-uppercase">
              {t('common:no-turns')}
            </p>
          )}
        </Card.Body>
      </Card>

      <Card className="cauda_card mb-4 mx-auto">
        <Card.Body className="p-2 text-center">
          <div className="d-flex justify-content-center align-items-center mb-1">
            <span className="h6 text-uppercase font-weight-light mr-1 mb-0 text-light">
              {t('common:pending-turns')}
            </span>
            <span className="h2 text-uppercase font-weight-light ml-2 mb-0 text-light">
              {myShop!.pendingTurnsAmount}
            </span>
          </div>

          {/* <Button
            disabled={myShop.pendingTurnsAmount === 0 || actionLoading}
            onClick={cancelTurns}
            variant="light"
            className="d-flex justify-content-center align-items-center"
            block
          >
            {t('common:cancel-pending')}
          </Button> */}
        </Card.Body>
      </Card>

      {myShop!.lastTurns.length > 0 ? (
        <div className="myturn__turns mb-5 text-center">
          <p className="h6 text-uppercase text-muted font-weight-light">
            {t('common:last-numbers')}
          </p>

          <ul className="list-unstyled list-inline h4 mb-0">
            {myShop!.lastTurns.map((lt, index) => (
              <li
                key={index}
                className={`list-inline-item text-${getTurnColor(lt.status)}`}
              >
                {lt.turn}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = getToken(context);

  if (!token) {
    return { props: { isLoggedIn: false } };
  }

  return { props: { isLoggedIn: true, shopId: token.shopId || '' } };
};

export default MyShop;
