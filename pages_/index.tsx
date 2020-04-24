import useTranslation from 'next-translate/useTranslation';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Layout from '../src/components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { faStoreAlt } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <div className="content d-flex flex-column justify-content-between align-items-center h-100">
        <div></div>
        <Card className="cauda_card mt-3 p-3 p-sm-4 p-md-5 mb-5">
          <Row>
            <Col xs="12">
              <Button
                href="/shops"
                variant="primary"
                size="lg"
                className="mb-4 d-flex justify-content-between align-items-center p-sm-3"
                block
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} fixedWidth />{' '}
                {t('common:nearby-shops')}
              </Button>
            </Col>
            <Col xs="12">
              <Button
                href="/scan"
                variant="secondary"
                size="lg"
                className="d-flex justify-content-between align-items-center p-sm-3"
                block
              >
                <FontAwesomeIcon icon={faQrcode} fixedWidth />{' '}
                {t('common:scan-qr-code')}
              </Button>
            </Col>
          </Row>
        </Card>

        <Row>
          <Col className="text-center">
            <Button href="/my-shop" variant="info" className="tertiary px-4">
              <FontAwesomeIcon icon={faStoreAlt} fixedWidth />{' '}
              {t('common:my-shop')}
            </Button>
          </Col>
        </Row>
      </div>

      <style jsx>{``}</style>
    </Layout>
  );
};

export default Home;
