import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import * as Sentry from '@sentry/browser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import createPrismaClient from 'prisma/client';
import Layout from 'src/components/Layout';
import { getToken } from 'src/utils/next';
import { decodeId, encodeId } from 'src/utils/hashids';
import { numberToTurn } from 'graphql/utils/turn';
import { lastTurns } from 'graphql/shop/helpers';
import NotFound from 'src/components/NotFound';
import Spinner from 'src/components/Spinner';
import graphQLClient from 'src/graphqlClient';
import useSWR, { mutate } from 'swr';
import LoadingButton from 'src/components/LoadingButton';
import { TO_ISSUED_NUMBER_STATUS } from 'graphql/issuedNumber/helpers';
import { MY_PAST_TURNS, MY_TURNS } from 'pages_';
import useFirebaseMessage from 'src/hooks/useFirebaseMessage';
import getTurnColor from 'src/utils/colors';

const reload = () => Router.reload();

const QUERY = /* GraphQL */ `
  query Turn($turnId: ID!, $shopId: ID!) {
    turn(turnId: $turnId) {
      turn
      shopName
      status
    }

    lastTurns(shopId: $shopId, priorTo: $turnId) {
      id
      status
      turn
    }
  }
`;

const MyTurn = ({ isLoggedIn, statusCode, turn, lastTurns }) => {
  const { t } = useTranslation();
  useFirebaseMessage();
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState();
  const { data, error } = useSWR(
    [QUERY, router.query.turnId, turn.shopId],
    (query, turnId, shopId) => graphQLClient.request(query, { turnId, shopId }),
    {
      initialData: { turn, lastTurns },
      refreshInterval: turn.status === 'PENDING' ? 10_000 : 0,
    }
  );

  useEffect(() => {
    if (!isLoggedIn) {
      Router.replace('/register-phone?redirectTo=' + router.asPath);
    }
  }, [isLoggedIn]);

  if (statusCode === 404) {
    return <NotFound />;
  }

  if (!isLoggedIn || !data) {
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
        await mutate(MY_TURNS);
        await mutate(MY_PAST_TURNS);
        Router.push('/');
      }
      setCancelling(false);
    } catch (error) {
      setCancelError(error);
      console.error(error);
      setCancelling(false);
      Sentry.captureException(error);
    }
  };

  return (
    <Layout>
      <Card className="cauda_card myturn__card mb-4 mx-auto">
        <Card.Header className="d-flex justify-content-between align-items-center">
          {data.turn.shopName}

          <Link href="/" passHref>
            <Button variant="danger" size="sm">
              {t('common:go-back')}
            </Button>
          </Link>
        </Card.Header>
        <Card.Body className="p-2 text-center">
          {data.turn.status === 'PENDING' ? (
            <Button onClick={reload} variant="link" className="py-0">
              <FontAwesomeIcon icon={faRedo} className="mr-2" />
              {t('common:my-turn')}
            </Button>
          ) : null}

          {/* TODO NICO: Add "myturn__number--disabled" class for disabled myturn__number */}
          <p
            className={`myturn__number display-3 text-${getTurnColor(
              data.turn.status
            )}`}
          >
            {data.turn.turn}
          </p>

          {data.turn.status !== 'PENDING' ? (
            <Badge variant={getTurnColor(data.turn.status)} className="mb-3">
              {t(`common:turn-status-${data.turn.status}`)}
            </Badge>
          ) : null}

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
                {data.lastTurns.length > 0
                  ? data.lastTurns.map(({ id, turn, status }) => (
                      <li
                        key={id}
                        className={`list-inline-item text-${
                          ['SKIPPED', 'CANCELLED'].includes(status)
                            ? 'danger'
                            : 'success'
                        }`}
                      >
                        {turn}
                      </li>
                    ))
                  : '-'}
              </ul>
            </Card.Body>
          </Card>

          {data.turn.status === 'PENDING' ? (
            <LoadingButton
              isLoading={cancelling}
              onClick={cancelTurn}
              variant="danger"
              size="lg"
              className="d-flex justify-content-between align-items-center"
              block
            >
              <FontAwesomeIcon icon={faTimes} />
              {t('common:cancel-turn')}
              <div></div>
            </LoadingButton>
          ) : (
            <Link href="/[shopId]" as={'/' + turn.shopId} passHref>
              <Button as="a" variant="primary" block size="lg">
                <FontAwesomeIcon icon={faCalendarCheck} fixedWidth />{' '}
                {t('common:request-another-turn')}
              </Button>
            </Link>
          )}
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

  const prisma = createPrismaClient();

  const issuedNumber = await prisma.issuedNumber.findOne({
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
    await prisma.disconnect();
    return { props: { statusCode: 404, isLoggedIn: true } };
  }

  const turns = await lastTurns(prisma, issuedNumber.shopId, turnId);

  await prisma.disconnect();

  return {
    props: {
      isLoggedIn: true,
      turn: {
        shopId: encodeId(issuedNumber.shopId),
        shopName: issuedNumber.shopDetails.name,
        turn: numberToTurn(issuedNumber.issuedNumber),
        status: TO_ISSUED_NUMBER_STATUS[issuedNumber.status],
      },
      lastTurns: turns.map((turn) => ({
        turn: turn.turn,
        status: TO_ISSUED_NUMBER_STATUS[turn.status],
      })),
    },
  };
};

export default MyTurn;
