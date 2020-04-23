import useTranslation from 'next-translate/useTranslation';
import Layout from '../src/components/Layout';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Shopcard from '../src/components/ShopCard';
import Location, { Coords } from '../src/components/Location';

type Props = {
  coords: Coords;
};

const Shops = (props: Props) => {
  console.log(props);
  const { t } = useTranslation();
  return (
    <Layout>
      <div className="content">
        <Row>
          <Col>
            <h1 className="cauda_title">{t('common:nearby-shops')}</h1>
          </Col>
        </Row>

        <Shopcard />
        <Shopcard />
        <Shopcard />
      </div>
      <style jsx global>{``}</style>
    </Layout>
  );
};

export default () => (
  <Location render={(coords: Coords) => <Shops coords={coords} />} />
);
