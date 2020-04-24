import React, { useState, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Layout from '../src/components/Layout';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ShopCard from 'src/components/ShopCard';
import graphqlClient from 'src/graphql-config';

import { Shop } from '../graphql';

const Shops = () => {
  const { t } = useTranslation();

  const [shops, setShops] = useState<Shop[]>([]);
  useEffect(() => {
    graphqlClient
      .request(
        /* GraphQL */ `
          {
            shops {
              id
            }
          }
        `
      )
      .then((data) => {
        setShops(data.shops);
      });
  }, []);

  if (!shops.length) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="content">
        <Row>
          <Col>
            <h1 className="cauda_title">{t('common:nearby-shops')}</h1>
          </Col>
        </Row>

        {shops.map((s) => (
          <ShopCard key={s.id} id={s.id} />
        ))}
      </div>
      <style jsx global>{``}</style>
    </Layout>
  );
};

export default Shops;
