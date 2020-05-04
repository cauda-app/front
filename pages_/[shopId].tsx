import { GetServerSideProps } from 'next';

import prismaClient from '../prisma/client';
import ShopCard from 'src/components/ShopCard';
import Layout from 'src/components/Layout';
import { isOpen, shopPhone, status } from '../graphql/shop/helpers';
import { requireLogin } from 'src/utils/next';

const RequestTurn = ({ shop }) => {
  return (
    <Layout>
      <ShopCard shop={shop} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const shopId = context.params?.shopId as string | undefined;
  const token = requireLogin(context);
  if (!token) {
    return { props: {} };
  }

  let shop;

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
