import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Router, { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import * as Sentry from '@sentry/browser';
import { mutate } from 'swr';

import prismaClient from '../prisma/client';
import ShopCard from 'src/components/ShopCard';
import Layout from 'src/components/Layout';
import NotFound from 'src/components/NotFound';
import Spinner from 'src/components/Spinner';
import { isOpen, shopPhone, status } from '../graphql/shop/helpers';
import { getToken } from 'src/utils/next';
import graphqlClient from 'src/graphqlClient';
import { getErrorCodeFromApollo } from 'src/utils';
import { decodeId } from 'src/utils/hashids';
import Notification from 'src/components/Notification';
import getConfig from 'next/config';
import { MY_TURNS } from 'pages_';
import { firebaseCloudMessaging } from 'src/utils/web-push';
import useFirebaseMessage from 'src/hooks/useFirebaseMessage';

const nextConfig = getConfig();

const REQUEST_TURN = /* GraphQL */ `
  mutation RequestTurn($shopId: ID!) {
    requestTurn(shopId: $shopId) {
      id
      pendingTurnsAmount
    }
  }
`;

const RequestTurn = ({ isLoggedIn, statusCode, shop }) => {
  const { t } = useTranslation();
  useFirebaseMessage();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoggedIn) {
      Router.push('/register-phone?redirectTo=' + router.asPath);
    }
  }, [isLoggedIn]);

  const goToHome = () => {
    Router.push('/');
  };

  const handleRequestTurn = async (shopId) => {
    try {
      setError(undefined);
      await firebaseCloudMessaging.requestPermission();
      const res = await graphqlClient.request(REQUEST_TURN, { shopId });
      const goToShopThreshold =
        nextConfig?.publicRuntimeConfig?.goToShopThreshold;
      if (res.requestTurn.pendingTurnsAmount <= goToShopThreshold) {
        setShowModal(true);
      } else {
        await mutate(MY_TURNS); // invalidate cached data
        goToHome();
      }
    } catch (error) {
      console.error(error);
      const errorCode = getErrorCodeFromApollo(error);

      switch (errorCode) {
        case 'ACTIVE_TURN':
          Router.push('/');
          break;
        case 'PENDING_TURNS_QUOTA_EXCEEDED':
          setError(t('common:pending-turns-quota-exceeded'));
          break;
        case 'TODAY_TURNS_QUOTA_EXCEEDED':
          setError(t('common:today-turns-quota-exceeded'));
          break;
        default:
          setError(t('common:mutation-error'));
          Sentry.captureException(error);
          break;
      }
    }
  };

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

  return (
    <Layout>
      <ShopCard shop={shop} onRequestTurn={handleRequestTurn} error={error} />
      {showModal && (
        <Notification
          message={t('common:empty-shop-queue')}
          onConfirm={goToHome}
        />
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = getToken(context);
  if (!token) {
    return { props: { isLoggedIn: false } };
  }

  const encodedShopId = context.params?.shopId as string | undefined;
  const shopId = decodeId(encodedShopId) as number | null;

  if (shopId) {
    const dbShop = await prismaClient.shopDetails.findOne({
      where: { shopId },
    });
    if (dbShop) {
      const shop = {
        shopId: encodedShopId,
        name: dbShop.name,
        address: dbShop.address,
        lat: dbShop.lat,
        lng: dbShop.lng,
        shopPhone: shopPhone(dbShop),
        isOpen: isOpen(dbShop),
        status: status(dbShop),
      };

      return { props: { isLoggedIn: true, shop } };
    }
  }

  context.res.statusCode = 404;
  return { props: { isLoggedIn: true, statusCode: 404 } };
};

export default RequestTurn;
