import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Router, { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import * as Sentry from '@sentry/browser';
import { mutate } from 'swr';

import createPrismaClient from '../prisma/client';
import ShopCard from 'src/components/ShopCard';
import Layout from 'src/components/Layout';
import NotFound from 'src/components/NotFound';
import Spinner from 'src/components/Spinner';
import { isOpen, shopPhone, status } from '../graphql/shop/helpers';
import { getToken } from 'src/utils/next';
import graphqlClient from 'src/graphqlClient';
import { getErrorCodeFromApollo, getErrorFromApollo } from 'src/utils';
import { decodeId } from 'src/utils/hashids';
import Notification from 'src/components/Notification';
import { MY_TURNS } from 'pages_';
import { firebaseCloudMessaging } from 'src/utils/web-push';
import useFirebaseMessage from 'src/hooks/useFirebaseMessage';

const REQUEST_TURN = /* GraphQL */ `
  mutation RequestTurn($shopId: ID!) {
    requestTurn(shopId: $shopId) {
      id
      queueSize
    }
  }
`;

type Props = {
  isLoggedIn: boolean;
  goToShopThreshold: number;
  statusCode?: number;
  shop?: any;
};

const RequestTurn = ({ isLoggedIn, statusCode, shop, goToShopThreshold }) => {
  const { t } = useTranslation();
  useFirebaseMessage();
  const [showModal, setShowModal] = useState(false);
  const [newTurnId, setNewTurnId] = useState(false);
  const [error, setError] = useState();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoggedIn) {
      Router.replace('/register-phone?redirectTo=' + router.asPath);
    }
  }, [isLoggedIn]);

  const goToTurnDetail = (id = newTurnId) => {
    Router.push('/turn/' + id);
  };

  const handleRequestTurn = async () => {
    try {
      setError(undefined);
      await firebaseCloudMessaging.requestPermission();
      const res = await graphqlClient.request(REQUEST_TURN, {
        shopId: shop.shopId,
      });

      setNewTurnId(res.requestTurn.id);

      if (res.requestTurn.queueSize <= goToShopThreshold) {
        setShowModal(true);
      } else {
        await mutate(MY_TURNS); // invalidate cached data
        goToTurnDetail(res.requestTurn.id);
      }
    } catch (error) {
      console.error(error);
      const errorCode = getErrorCodeFromApollo(error);

      switch (errorCode) {
        case 'ACTIVE_TURN':
          const turnId = getErrorFromApollo(error).turnId;
          goToTurnDetail(turnId);
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

      return Promise.reject(error);
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

  if (showModal) {
    return (
      <Layout>
        <Notification
          title="CAUDA"
          message={t('common:empty-shop-queue')}
          onConfirm={goToTurnDetail}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <ShopCard shop={shop} onRequestTurn={handleRequestTurn} error={error} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const goToShopThreshold = Number(process.env.CAUDA_GO_TO_SHOP_THRESHOLD);

  const token = getToken(context);
  if (!token) {
    return { props: { isLoggedIn: false, goToShopThreshold } };
  }

  const encodedShopId = context.params?.shopId as string | undefined;
  let shopId;
  try {
    shopId = decodeId(encodedShopId) as number | null;
  } catch (error) {
    return { props: { isLoggedIn: true, statusCode: 404, goToShopThreshold } };
  }

  const prisma = createPrismaClient();

  if (shopId) {
    const dbShop = await prisma.shopDetails.findOne({
      where: { shopId },
      include: { shop: { select: { queueSize: true } } },
    });

    await prisma.disconnect();

    if (dbShop) {
      const shop = {
        shopId: encodedShopId,
        name: dbShop.name,
        address: dbShop.address,
        lat: dbShop.lat,
        lng: dbShop.lng,
        shopPhone: shopPhone(dbShop),
        shop: { queueSize: dbShop.shop.queueSize },
        isOpen: isOpen(dbShop),
        status: status(dbShop),
      };
      return { props: { isLoggedIn: true, shop, goToShopThreshold } };
    }
  }

  context.res.statusCode = 404;
  return { props: { isLoggedIn: true, statusCode: 404, goToShopThreshold } };
};

export default RequestTurn;
