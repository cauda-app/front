import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export default function ShopCard({ children, className, ...rest }: Props) {
  const { t } = useTranslation();

  return (
    <div className={`root ${className}`} {...rest}>
      {children}

      <Card className="cauda_card cauda_shop">
        <Card.Header>ShopName</Card.Header>
        <div className="shop_map">
          <Card.Img variant="top" src="map.png" alt="ShopMap" />
        </div>
        <ListGroup variant="flush">
          <ListGroup.Item>ShopAddress</ListGroup.Item>
          <ListGroup.Item>ShopPhone</ListGroup.Item>
          <ListGroup.Item>ShopHours</ListGroup.Item>
        </ListGroup>
        <Card.Body>
          <Button variant="primary" size="sm" block>
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
