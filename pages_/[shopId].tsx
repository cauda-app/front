import { GetServerSideProps } from 'next';
import Router from 'next/router';

import prismaClient from '../prisma/client';
import ShopCard from 'src/components/ShopCard';
import Layout from 'src/components/Layout';
import NotFound from 'src/components/NotFound';
import { isOpen, shopPhone, status } from '../graphql/shop/helpers';
import { requireLogin } from 'src/utils/next';
import graphqlClient from 'src/graphqlClient';
import { getErrorCodeFromApollo } from 'src/utils';

const REQUEST_TURN = /* GraphQL */ `
  mutation RequestTurn($shopId: String!) {
    requestTurn(shopId: $shopId) {
      id
    }
  }
`;

const RequestTurn = ({ statusCode, shop }) => {
  if (statusCode === 404) {
    return <NotFound />;
  }

  const handleRequestTurn = async (shopId) => {
    try {
      await graphqlClient.request(REQUEST_TURN, { shopId });
      Router.push('/');
    } catch (error) {
      console.log(error);
      const errorCode = getErrorCodeFromApollo(error);
      if (errorCode === 'ACTIVE_TURN') {
        Router.push('/');
      }
    }
  };

  return (
    <Layout>
      <ShopCard shop={shop} onRequestTurn={handleRequestTurn} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = requireLogin(context);
  if (!token) {
    return { props: {} };
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
      return { props: { statusCode: 404 } };
    }
  }

  return { props: { shop } };
};

export default RequestTurn;
