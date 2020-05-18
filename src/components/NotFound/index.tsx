import useTranslation from 'next-translate/useTranslation';
import Layout from '../Layout';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <Layout>
      <Row>
        <Col xs="auto" className="mx-auto">
          <div className="text-center">
            <h1 className="display-1 text-secondary">404</h1>
            <p className="alert alert-secondary">{t('common:not-found')}</p>
            <Button
              variant="primary"
              href="/"
              block
              className="d-flex justify-content-between align-items-center py-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} fixedWidth />
              {t('common:go-home')}
              <div></div>
            </Button>
          </div>
        </Col>
      </Row>
    </Layout>
  );
}
