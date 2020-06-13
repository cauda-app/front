import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import Layout from '../src/components/Layout';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'src/components/Spinner';
import useQuery from 'src/hooks/useQuery';
import Location, { Coords } from 'src/components/Location';
import ShopCard from 'src/components/ShopCard';
import GoBack from 'src/components/GoBack';
import useFirebaseMessage from 'src/hooks/useFirebaseMessage';

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
      shop {
        queueSize
      }
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
  useFirebaseMessage();
  const variables = React.useMemo(() => ({ lat, lng }), [lat, lng]);
  const [offset, setOffset] = React.useState(0);
  const { data, loading, error, fetchMore } = useQuery(SHOPS, { variables });
  const [hasNextPage, setHasNextPage] = React.useState(false);

  React.useEffect(() => {
    if (data.nearByShops?.length && data.nearByShops.length % PAGE_ROWS === 0) {
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
    throw error;
  }

  return (
    <Layout>
      <div className="content h-100">
        <Card className="cauda_card cauda_card--clean mb-4 mx-auto">
          <Card.Body className="p-0 text-center d-flex flex-column justify-content-center align-items-center">
            <Row noGutters className="w-100">
              <Col className="d-flex justify-content-center align-items-center">
                <GoBack />
                <h1 className="cauda_title mb-0">{t('common:nearby-shops')}</h1>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {data.nearByShops?.length === 0 ? (
          <Card className="cauda_card mb-4 mx-auto">
            <Card.Body className="text-center d-flex flex-column justify-content-center align-items-center">
              <div className="text-center lead m-auto p-3 py-5">
                {t('common:no-shops')}
              </div>
            </Card.Body>
          </Card>
        ) : null}

        {data.nearByShops?.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}

        {loading ? (
          <Spinner
            className={!data.nearByShops ? 'h-100 align-items-center' : ''}
          />
        ) : null}

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
