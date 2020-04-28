import React, { useState, useEffect } from 'react';
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

type Props = {
  shop: any;
};

export default function ShopCard({ shop, ...rest }: Props) {
  const { t } = useTranslation();

  return (
    <div {...rest}>
      <Card className="cauda_card cauda_shop">
        <Card.Header>{shop.name}</Card.Header>
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
          <Button variant="primary" block>
            <FontAwesomeIcon icon={faCalendarCheck} fixedWidth />{' '}
            {t('common:request-turn')}
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
