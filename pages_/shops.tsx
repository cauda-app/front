import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import Layout from '../src/components/Layout';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Spinner from 'src/components/Spinner';
import useQuery from 'src/hooks/useQuery';
import Location, { Coords } from 'src/components/Location';
import ShopCard from 'src/components/ShopCard';
import GoBack from 'src/components/GoBack';

const PAGE_ROWS = 10;

const SHOPS = /* GraphQL */ `
  query Shops($lat: Float!, $lng: Float!, $offset: Int) {
    nearByShops(lat: $lat, lng: $lng, offset: $offset) {
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

type Props = {
  coords: Coords;
};

const Shops = ({ coords: { lat, lng } }: Props) => {
  const { t } = useTranslation();
  const variables = React.useMemo(() => ({ lat, lng }), [lat, lng]);
  const [offset, setOffset] = React.useState(0);
  const { data, loading, error, fetchMore } = useQuery(SHOPS, { variables });
  const [hasNextPage, setHasNextPage] = React.useState(false);

  React.useEffect(() => {
    if (data.nearByShops && data.nearByShops.length % PAGE_ROWS === 0) {
      setHasNextPage(true);
    } else {
      setHasNextPage(false);
    }
  }, [data.nearByShops]);

  const handleFetchMore = () => {
    const newOffset = offset + PAGE_ROWS;
    setOffset(newOffset);

    fetchMore({
      variables: {
        offset: newOffset,
      },
      updateQuery: (prev, fetchMoreResult) => {
        if (!fetchMoreResult || !fetchMoreResult.nearByShops.length) {
          setHasNextPage(false);
          return prev;
        }
        if (fetchMoreResult.nearByShops.length < PAGE_ROWS) {
          setHasNextPage(false);
        }
        return {
          ...prev,
          nearByShops: [...prev.nearByShops, ...fetchMoreResult.nearByShops],
        };
      },
    });
  };

  if (error) {
    return <div>{String(error)}</div>;
  }

  return (
    <Layout>
      <div className="content">
        <Row>
          <Col xs="1">
            <GoBack />
          </Col>
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
            onClick={handleFetchMore}
          >
            {t('common:load-more')}
          </Button>
        ) : null}
      </div>
    </Layout>
  );
};

export default () => (
  <Location render={({ coords }) => <Shops coords={coords} />} />
);
