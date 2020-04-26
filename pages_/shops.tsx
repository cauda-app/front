import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import Layout from '../src/components/Layout';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import useQuery from '../src/hooks/useQuery';

import ShopCard from 'src/components/ShopCard';

import { ShopDetails } from '../graphql';

const SHOPS = /* GraphQL */ `
  {
    shopsDetail {
      shopId
      name
      address
      lat
      lng
      shopPhone
      isOpen
      status {
        opens
        closes
      }
    }
  }
`;

const Shops = () => {
  const { t } = useTranslation();
  const { data, loading, error } = useQuery(SHOPS);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{String(error)}</div>;
  }

  return (
    <Layout>
      <div className="content">
        <Row>
          <Col>
            <h1 className="cauda_title">{t('common:nearby-shops')}</h1>
          </Col>
        </Row>

        {data.shopsDetail?.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </div>
      <style jsx global>{``}</style>
    </Layout>
  );
};

export default Shops;
