import React from 'react';
import { GetServerSideProps } from 'next';
import Router, { useRouter } from 'next/router';
import * as Sentry from '@sentry/browser';

import prismaClient from '../prisma/client';
import ShopCard from 'src/components/ShopCard';
import Layout from 'src/components/Layout';
import NotFound from 'src/components/NotFound';
import Spinner from 'src/components/Spinner';
import { isOpen, shopPhone, status } from '../graphql/shop/helpers';
import { getToken } from 'src/utils/next';
import graphqlClient from 'src/graphqlClient';
import { getErrorCodeFromApollo } from 'src/utils';

const REQUEST_TURN = /* GraphQL */ `
  mutation RequestTurn($shopId: ID!) {
    requestTurn(shopId: $shopId) {
      id
    }
  }
`;

const RequestTurn = ({ isLoggedIn, statusCode, shop }) => {
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoggedIn) {
      Router.push('/register-phone?redirectTo=' + router.asPath);
    }
  }, [isLoggedIn]);

  const handleRequestTurn = async (shopId) => {
    try {
      await graphqlClient.request(REQUEST_TURN, { shopId });
      Router.push('/');
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
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = getToken(context);
  if (!token) {
    return { props: { isLoggedIn: false } };
  }

  const shopId = context.params?.shopId as string | undefined;
  let shop;

  if (shopId) {
    const dbShop = await prismaClient.shopDetails.findOne({
      where: { shopId },
    });
    if (dbShop) {
      shop = {
        shopId: dbShop.shopId,
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
