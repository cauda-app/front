import useTranslation from 'next-translate/useTranslation';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Spinner from 'react-bootstrap/Spinner';
import Layout from '../src/components/Layout';

const Scan = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <div className="content d-flex flex-column justify-content-between h-100">

        <Card className="cauda_card cauda_scan mt-3 p-3 p-sm-4 p-md-5 text-center">
          <Card.Body>
            <Spinner animation="border" variant="primary" role="status">
            <span className="sr-only">{t('common:loading')}</span>
            </Spinner>
            <p className="mb-0">{t('common:processing-qr')}</p>
          </Card.Body>
        </Card>

        <Row>
          <Col>
          </Col>
        </Row>

      </div>
      <style jsx global>{`
        .cauda_scan {
          margin: 0 auto;
          width: 100%;
          max-width: 280px;
          background: green;
        }
      `}</style>
    </Layout>
  );
};

export default Scan;
