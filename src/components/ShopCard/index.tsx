import React from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import Map from '../Map';
import { formats, parseUTCTime } from 'src/utils/dates';
import LoadingButton from '../LoadingButton';
import GoBack from '../GoBack';

type Props = {
  shop: any;
  error?: string;
  onRequestTurn?: (shopId: String) => Promise<any>;
};

export default function ShopCard({
  shop,
  onRequestTurn,
  error,
  ...rest
}: Props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onRequestTurn!(shop.shopId);
    } catch (error) {
      // TODO: show error
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div {...rest}>
      <Card className="cauda_card cauda_shop">
        <Card.Header>
          {onRequestTurn && <GoBack page="/shops" />}
          {shop.name}
        </Card.Header>
        <div className="shop_map">
          <Map lat={shop.lat} lng={shop.lng} />
        </div>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <FontAwesomeIcon icon={faMapMarkerAlt} fixedWidth /> {shop.address}
          </ListGroup.Item>
          {shop.shopPhone ? (
            <ListGroup.Item>
              <FontAwesomeIcon icon={faPhone} fixedWidth />{' '}
              <a href={'tel:' + shop.shopPhone}>{shop.shopPhone}</a>
            </ListGroup.Item>
          ) : null}
          <ListGroup.Item>
            <FontAwesomeIcon icon={faClock} fixedWidth />{' '}
            {shop.isOpen ? (
              <>
                {t('common:open-now')}:{' '}
                {formats.hourMinute(
                  parseUTCTime(shop.status.opens, new Date())
                )}
                -
                {formats.hourMinute(
                  parseUTCTime(shop.status.closes, new Date())
                )}
              </>
            ) : (
              t('common:close-now')
            )}
          </ListGroup.Item>
        </ListGroup>
        <Card.Body>
          {onRequestTurn ? (
            <LoadingButton
              isLoading={isLoading}
              variant="success"
              block
              disabled={!shop.isOpen}
              onClick={handleConfirm}
            >
              <FontAwesomeIcon icon={faCalendarCheck} fixedWidth />{' '}
              {t('common:confirm-turn')}{' '}
              {!shop.isOpen ? `(${t('common:close-now')})` : ''}
            </LoadingButton>
          ) : (
            <Link href="/[shopId]" as={'/' + shop.shopId} passHref>
              <Button as="a" variant="primary" block disabled={!shop.isOpen}>
                <FontAwesomeIcon icon={faCalendarCheck} fixedWidth />{' '}
                {t('common:request-turn')}{' '}
                {!shop.isOpen ? `(${t('common:close-now')})` : ''}
              </Button>
            </Link>
          )}
          {error && <p className="mt-3 text-center text-secondary">{error}</p>}
        </Card.Body>
      </Card>
    </div>
  );
}
