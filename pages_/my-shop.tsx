import { useState, useEffect } from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { GetServerSideProps } from 'next';

import { requireLogin } from 'src/utils/next';
import Layout from 'src/components/Layout';
import useQuery from 'src/hooks/useQuery';
import Spinner from 'src/components/Spinner';
import graphqlClient from 'src/graphqlClient';

const MyShop = () => {
  const { t } = useTranslation();

  const [myShop, setMyShop] = useState<any>();
  const [error, setError] = useState();
  const [actionLoading, setActionLoading] = useState(false);

  const attendTurn = async () => {
    setActionLoading(true);
    const ATTEND_NEXT_TURN = /* GraphQL */ `
      mutation AttendNextTurn {
        attendNextTurn {
          nextTurn
          lastTurnsAttended
          pendingTurnsAmount
        }
      }
    `;

    try {
      const res = await graphqlClient.request(ATTEND_NEXT_TURN);
      setMyShop({ ...myShop, ...res.attendNextTurn });
      setActionLoading(false);
    } catch (error) {
      setError(error);
      setActionLoading(false);
    }
  };

  const getShopData = async () => {
    const MY_SHOP = /* GraphQL */ `
      query MyShop {
        myShop {
          details {
            name
          }
          nextTurn
          lastTurnsAttended
          pendingTurnsAmount
        }
      }
    `;

    try {
      const res = await graphqlClient.request(MY_SHOP);
      setMyShop(res.myShop);
    } catch (error) {
      setError(error);
    }
  };

  // fetch data
  useEffect(() => {
    getShopData();

    const interval = setInterval(() => {
      getShopData();
    }, 10_000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <Layout>{String(error)}</Layout>;
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
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Button href="/" variant="link" className="py-0">
            <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
          </Button>
          <p>{myShop!.details.name}</p>
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
                  onClick={attendTurn}
                  variant="success"
                  size="lg"
                  className="d-flex justify-content-center align-items-center"
                  block
                >
                  {t('common:attend-turn')}
                </Button>

                <Button
                  disabled={actionLoading}
                  href=""
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

      <div className="mb-5">
        <div className="d-flex justify-content-center align-items-baseline">
          <span className="h6 text-uppercase text-muted font-weight-light mr-1">
            {t('common:pending-turns')}
          </span>
          <span className="h2 text-uppercase text-muted font-weight-light">
            {myShop!.pendingTurnsAmount}
          </span>
        </div>

        <Button
          disabled={myShop.pendingTurnsAmount === 0 || actionLoading}
          href=""
          variant="warning"
          size="lg"
          className="d-flex justify-content-center align-items-center"
          block
        >
          {t('common:cancel-pending')}
        </Button>
      </div>

      {myShop!.lastTurnsAttended.length > 0 ? (
        <div className="myturn__turns mb-5 text-center">
          <p className="h6 text-uppercase text-muted font-weight-light">
            {t('common:last-numbers')}
          </p>

          <ul className="list-unstyled list-inline h4 mb-0">
            {myShop!.lastTurnsAttended.map((turn, index) => (
              <li key={index} className="list-inline-item text-success">
                {turn}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = requireLogin(context);

  if (!token?.shopId) {
    context.res.writeHead(303, {
      Location: '/shop-form',
    });
    context.res.end();
  }

  return { props: {} };
};

export default MyShop;
