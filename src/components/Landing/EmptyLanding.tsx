import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { faStoreAlt } from '@fortawesome/free-solid-svg-icons';
import Layout from 'src/components/Layout';

const EmptyLanding = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="content d-flex flex-column justify-content-between align-items-center h-100">
        <div></div>
        <Card className="cauda_card mt-3 px-3 py-4 p-sm-5 mb-5">
          <Row>
            <Col xs="12">
              <Link href="/shops" passHref>
                <Button
                  variant="primary"
                  size="lg"
                  className="mb-4 d-flex justify-content-between align-items-center py-4 p-sm-3"
                  block
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} fixedWidth />
                  {t('common:nearby-shops')}
                  <div></div>
                </Button>
              </Link>
            </Col>
            <Col xs="12">
              <Link href="/scan" passHref>
                <Button
                  variant="secondary"
                  size="lg"
                  className="d-flex justify-content-between align-items-center py-4 p-sm-3"
                  block
                >
                  <FontAwesomeIcon icon={faCamera} fixedWidth />
                  {t('common:scan-qr-code')}
                  <div></div>
                </Button>
              </Link>
            </Col>
          </Row>
        </Card>
      </div>
    </Layout>
  );
};

export default EmptyLanding;
