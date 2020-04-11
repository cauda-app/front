import useTranslation from 'next-translate/useTranslation';
import Layout from '../src/components/Layout';
import Shopcard from '../src/components/ShopCard';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';

const RequestTurn = () => {
  const { t } = useTranslation();
  return (
    <Layout>

      <Shopcard />

      <Card className="cauda_card mt-3 p-3 p-sm-4 p-md-5 mx-auto text-center">
        <Card.Body>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="user_phone">Icon</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder={t('common:enter-cellphone')}
              aria-label={t('common:enter-cellphone')}
              aria-describedby="user_phone"
            />
          </InputGroup>

          <Button
            href=""
            variant="primary"
            size="lg"
            className="mb-3 mb-sm-0"
            block
          >{t('common:request-turn')}</Button>

          <p className="mt-3 mb-1">
            {t('common:enter-phone-desc')}
          </p>

          <small className="text-muted">
            {t('common:accept-by-continue')} <Link href="/terms"><a>{t('common:terms-conditions')}</a></Link>. 
          </small>

        </Card.Body>
      </Card>

    </Layout>
  );
};

export default RequestTurn;
