import useTranslation from 'next-translate/useTranslation';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Layout from '../src/components/Layout';

const Home = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <div className="content d-flex flex-column justify-content-between h-100">
        <Card className="cauda_card mt-3 p-3 p-sm-4 p-md-5">
          <Row>
            <Col xs="12" sm="6">
              <Button
                href="/shops"
                variant="primary"
                size="lg"
                className="mb-3 mb-sm-0"
                block
              >{t('common:nearby-shops')}</Button>
            </Col>
            <Col xs="12" sm="6">
              <Button
                href="/scan"
                variant="secondary"
                size="lg"
                block
              >{t('common:scan-qr-code')}</Button>
            </Col>
          </Row>
        </Card>

        <Row>
          <Col className="text-center">
            <Button
              href="/my-shop"
              variant="info"
              className="tertiary px-4"
            >{t('common:my-shop')}</Button>
          </Col>
        </Row>
      </div>

      <style jsx>{`

      `}</style>
    </Layout>
  );
};

export default Home;
