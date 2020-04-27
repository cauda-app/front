import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import Layout from '../src/components/Layout';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from '../src/components/Spinner';
import useQuery from '../src/hooks/useQuery';

import ShopCard from 'src/components/ShopCard';

const SHOPS = /* GraphQL */ `
  query Shops($after: String) {
    nearByShops(lat: -36.789655, lng: -59.862112, after: $after) {
      shopId
      name
      address
      lat
      lng
      shopPhone
      isOpen
      createdAt
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
  const [hasNextPage, setHasNextPage] = React.useState(true);

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

        {data.nearByShops?.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}

        {loading ? <Spinner /> : null}

        {data.nearByShops && hasNextPage ? (
          <Button
            variant="primary"
            className="mt-3"
            block
            disabled={loading}
            onClick={() =>
              fetchMore({
                variables: {
                  after:
                    data.nearByShops[data.nearByShops.length - 1].createdAt,
                },
                updateQuery: (prev, fetchMoreResult) => {
                  if (!fetchMoreResult || !fetchMoreResult.nearByShops.length) {
                    setHasNextPage(false);
                    return prev;
                  }
                  return {
                    ...prev,
                    nearByShops: [
                      ...prev.nearByShops,
                      ...fetchMoreResult.nearByShops,
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
