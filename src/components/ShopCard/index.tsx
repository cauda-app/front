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
import graphqlClient from 'src/graphql-config';

import { Shop, ShopDetails } from '../../../graphql';

type Props = {
  id: string;
  className?: string;
};

export default function ShopCard({ id, className, ...rest }: Props) {
  const { t } = useTranslation();

  const [shop, setShop] = useState<Shop & ShopDetails>();
  const [error, setError] = useState(false);
  useEffect(() => {
    const query = `
    query getShop($id: String!) {
      shop(id: $id) {
        id
        isClosed    
        details {
          name      
          address
          lat
          lng
          shopPhone    
        }
      }
    }
    `;

    graphqlClient
      .request(query, { id })
      .then((data) => (data ? setShop(data.shop) : setError(true)));
  }, []);

  if (!shop && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Some Error</div>;
  }

  return (
    <div className={`root ${className}`} {...rest}>
      <Card className="cauda_card cauda_shop">
        <Card.Header>{shop?.details?.name}</Card.Header>
        <div className="shop_map">
          <Card.Img variant="top" src="map.png" alt="ShopMap" />
        </div>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <FontAwesomeIcon icon={faMapMarkerAlt} fixedWidth /> ShopAddress
          </ListGroup.Item>
          <ListGroup.Item>
            <FontAwesomeIcon icon={faPhone} fixedWidth /> ShopPhone
          </ListGroup.Item>
          <ListGroup.Item>
            <FontAwesomeIcon icon={faClock} fixedWidth /> ShopHours
          </ListGroup.Item>
        </ListGroup>
        <Card.Body>
          <Button variant="primary" block>
            <FontAwesomeIcon icon={faCalendarCheck} fixedWidth />{' '}
            {t('common:request-turn')}
          </Button>
        </Card.Body>
      </Card>

      <style jsx global>{`
        .root {
        }
      `}</style>
    </div>
  );
}
