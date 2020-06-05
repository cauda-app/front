import React, { useState } from 'react';
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
import Notification from 'src/components/Notification';
import { firebaseCloudMessaging } from 'src/utils/web-push';

type Props = {
  shop: any;
  error?: string;
  onRequestTurn?: () => Promise<any>;
};

export default function ShopCard({
  shop,
  onRequestTurn,
  error,
  ...rest
}: Props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(false);
  const [requestNotification, setRequestNotification] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onRequestTurn!();
    } catch (error) {
      setIsLoading(false);
      // TODO: show error
      console.error(error);
    }
  };

  const checkNotificationsEnabled = async () => {
    try {
      const PermissionStatus = await navigator.permissions.query({
        name: 'notifications',
      });

      if (PermissionStatus.state === 'prompt') {
        await firebaseCloudMessaging.removePermission();
        setRequestNotification(true);
      } else {
        handleConfirm();
      }
    } catch (error) {
      console.error(error);
      handleConfirm();
    }
  };

  if (requestNotification) {
    return (
      <Notification
        title="Habilitar Notificaciones"
        subTitle="Vamos a solicitarte que permitas recibir Notificaciones"
        message="Es muy importante que aceptes para poder notificarte cuando se aproxime tu turno."
        onConfirm={() => {
          setRequestNotification(false);
          handleConfirm();
        }}
        countDown={5_000}
      />
    );
  }

  return (
    <div {...rest}>
      <Card className="cauda_card cauda_shop">
        <Card.Header>
          {onRequestTurn && <GoBack page="/shops" />}
          {shop.name}
        </Card.Header>
        <div className="shop_map mb-3">
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
              size="lg"
              block
              disabled={!shop.isOpen}
              onClick={checkNotificationsEnabled}
              className="py-2"
            >
              <FontAwesomeIcon
                icon={faCalendarCheck}
                fixedWidth
                className="mr-2"
              />{' '}
              {t('common:request-turn')}{' '}
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
