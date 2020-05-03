import { GetServerSideProps } from 'next';

import prismaClient from '../prisma/client';
import { processCookie } from './api/graphql';
import ShopCard from 'src/components/ShopCard';
import Layout from '../src/components/Layout';
import { isOpen, shopPhone, status } from '../graphql/shop/helpers';

const RequestTurn = ({ shop, ...rest }) => {
  return (
    <Layout>
      <ShopCard shop={shop} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = processCookie(context.req);
  const shopId = context.params?.shopId as string | undefined;
  let shop;

  if (!token || !token.isValid) {
    context.res.writeHead(303, {
      Location: '/register-phone?redirectTo=' + `/${shopId}`,
    });
    context.res.end();
  }

  if (shopId) {
    const dbShop = await prismaClient.shopDetails.findOne({
      where: { shopId },
    });
    if (dbShop) {
      shop = {
        name: dbShop.name,
        address: dbShop.address,
        lat: dbShop.lat,
        lng: dbShop.lng,
        shopPhone: shopPhone(dbShop),
        isOpen: isOpen(dbShop),
        status: status(dbShop),
      };
    }
  }

  return { props: { shop } };
};

export default RequestTurn;
