import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export default function Shopcard({ children, className, ...rest }: Props) {
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
          <Button variant="primary" size="sm" block>{t('common:request-turn')}</Button>
        </Card.Body>
      </Card>


      <style jsx global>{`
        .root {
        }
        .cauda_shop {
          margin: 0 auto;
          margin-bottom: 2rem;
          width: 100%;
          max-width: 420px;
        }
        .shop_map {
          border-bottom: 1px solid var(--color_divider);
          min-height: 50px;
        }
        .card-header {
          background: none;
          font-size: 1rem;
          border-bottom: 1px solid var(--color_divider);
        }
        .list-group {
          font-size: 0.8rem;
        }
        .list-group-item {
          border: none;
          padding: 0.35rem 1.25rem;
        }
        .card-body {
          padding: 0.5rem;
        }
      `}</style>
    </div>
  );
}
