import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import prismaClient from 'prisma/client';
import Layout from 'src/components/Layout';
import { getToken } from 'src/utils/next';
import { decodeId } from 'src/utils/hashids';
import { numberToTurn } from 'graphql/utils/turn';
import { lastTurns } from 'graphql/shop/helpers';
import NotFound from 'src/components/NotFound';
import Spinner from 'src/components/Spinner';
import graphQLClient from 'src/graphqlClient';

const reload = () => Router.reload();

const MyTurn = ({
  isLoggedIn,
  statusCode,
  turn,
  status,
  lastTurns,
  shopName,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push('/register-phone?redirectTo=' + router.asPath);
    }
  }, [isLoggedIn]);

  if (statusCode === 404) {
    return <NotFound />;
  }

  if (!isLoggedIn) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  const cancelTurn = async () => {
    setCancelling(true);
    const CANCEL_TURN = /* GraphQL */ `
      mutation CancelTurn($turnId: ID!) {
        cancelTurn(turnId: $turnId)
      }
    `;

    try {
      const { cancelTurn } = await graphQLClient.request(CANCEL_TURN, {
        turnId: router.query.turnId,
      });
      if (cancelTurn) {
        Router.push('/');
      }
      setCancelling(false);
    } catch (error) {
      setError(error);
      console.log(error);
      setCancelling(false);
    }
  };

  return (
    <Layout>
      <Card className="cauda_card myturn__card mb-4 mx-auto">
        <Card.Header className="d-flex justify-content-between align-items-center">
          {shopName}

          <Link href="/" passHref>
            <Button variant="danger" size="sm">
              {t('common:go-back')}
            </Button>
          </Link>
        </Card.Header>
        <Card.Body className="p-2 text-center">
          <Button onClick={reload} variant="link" className="py-0">
            <FontAwesomeIcon icon={faRedo} className="mr-2" />
            {t('common:my-turn')}
          </Button>

          <p className="myturn__number display-3">{turn}</p>

          {/* <p className="myturn__timebox h2 font-weight-light mb-1">
            <span className="myturn__time font-weight-bold">25</span>{' '}
            {t('common:minutes')}
          </p>

          <p className="h6 mb-3 text-uppercase text-muted font-weight-light">
            Tiempo Restante Estimado
          </p> */}

          <Card className="myturn__turns mb-5">
            <Card.Body className="text-center">
              <p className="h6 text-uppercase text-muted font-weight-light">
                {t('common:last-numbers')}
              </p>

              <ul className="list-unstyled list-inline h4 mb-0">
                {lastTurns.length > 0
                  ? lastTurns.map(({ turn, status }) => (
                      <li
                        key={turn}
                        className={`list-inline-item text-${
                          [2, 3].includes(status) ? 'danger' : 'success'
                        }`}
                      >
                        {turn}
                      </li>
                    ))
                  : '-'}
              </ul>
            </Card.Body>
          </Card>

          <Button
            onClick={cancelTurn}
            disabled={status !== 0 || cancelling}
            variant="danger"
            size="lg"
            className="d-flex justify-content-between align-items-center"
            block
          >
            <FontAwesomeIcon icon={faTimes} />
            {t('common:cancel-turn')}
            <div></div>
          </Button>
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

  const turnId = decodeId(context.params?.turnId as string);

  if (!turnId) {
    context.res.statusCode = 404;
    return { props: { statusCode: 404, isLoggedIn: true } };
  }

  const issuedNumber = await prismaClient.issuedNumber.findOne({
    where: { id: turnId as number },
    select: {
      issuedNumber: true,
      shopId: true,
      clientId: true,
      status: true,
      shopDetails: { select: { name: true } },
    },
  });

  if (!issuedNumber || issuedNumber?.clientId !== token.clientId) {
    context.res.statusCode = 404;
    return { props: { statusCode: 404, isLoggedIn: true } };
  }

  const turns = await lastTurns(prismaClient, issuedNumber.shopId);

  return {
    props: {
      isLoggedIn: true,
      shopName: issuedNumber.shopDetails.name,
      turn: numberToTurn(issuedNumber.issuedNumber),
      status: issuedNumber.status,
      lastTurns: turns,
    },
  };
};

export default MyTurn;
