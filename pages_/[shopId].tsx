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

  const [showModal, setShowModal] = useState(false);
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
      console.log(error);
      const errorCode = getErrorCodeFromApollo(error);
      if (errorCode === 'ACTIVE_TURN') {
        Router.push('/');
      } else {
        Sentry.captureException(error);
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
      <ShopCard shop={shop} onRequestTurn={handleRequestTurn} />
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
  const shopId = decodeId(encodedShopId) as number | undefined;
  let shop;

  if (shopId) {
    const dbShop = await prismaClient.shopDetails.findOne({
      where: { shopId },
    });
    if (dbShop) {
      shop = {
        shopId: encodedShopId,
        name: dbShop.name,
        address: dbShop.address,
        lat: dbShop.lat,
        lng: dbShop.lng,
        shopPhone: shopPhone(dbShop),
        isOpen: isOpen(dbShop),
        status: status(dbShop),
      };
    } else {
      context.res.statusCode = 404;
      return { props: { isLoggedIn: true, statusCode: 404 } };
    }
  }

  return { props: { isLoggedIn: true, shop } };
};

export default RequestTurn;
