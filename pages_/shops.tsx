import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import Layout from '../src/components/Layout';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from '../src/components/Spinner';
import useQuery from '../src/hooks/useQuery';

import ShopCard from 'src/components/ShopCard';

import { ShopDetails } from '../graphql';

const SHOPS = /* GraphQL */ `
  query Shops($after: String) {
    shopsDetail(after: $after) {
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
  const { data, loading, error, fetchMore } = useQuery(SHOPS);

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

        {loading ? <Spinner /> : null}

        {data.shopsDetail ? (
          <Button
            variant="primary"
            className="mt-3"
            block
            disabled={loading}
            onClick={() =>
              fetchMore({
                variables: {
                  after: data.shopsDetail[data.shopsDetail.length - 1].shopId,
                },
                updateQuery: (prev, fetchMoreResult) => {
                  if (!fetchMoreResult) return prev;
                  return {
                    ...prev,
                    shopsDetail: [
                      ...prev.shopsDetail,
                      ...fetchMoreResult.shopsDetail,
                    ],
                  };
                },
              })
            }
          >
            Cargar Mas
          </Button>
        ) : null}
      </div>
    </Layout>
  );
};

export default Shops;
