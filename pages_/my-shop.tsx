import useTranslation from 'next-translate/useTranslation';
import Layout from '../src/components/Layout';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';

const MyShop = () => {
  const { t } = useTranslation();
  return (
    <Layout>

      <Card className="cauda_card mt-1 mx-auto text-center">
        <Card.Header>
          {t('common:shop-details')}
        </Card.Header>
        <Card.Body>

          <InputGroup className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text id="user_phone">Icon</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder={t('common:enter-cellphone')}
              aria-label={t('common:enter-cellphone')}
              aria-describedby="user_phone"
            />
          </InputGroup>

          <p className="text-muted">
            <small>{t('common:enter-phone-desc-shop')}</small>
          </p>

          <Button
            href=""
            variant="primary"
            size="lg"
            className="mb-3"
            block
          >{t('common:continue')}</Button>

          <small className="text-muted">
            {t('common:accept-by-continue')} <Link href="/terms"><a>{t('common:terms-conditions')}</a></Link>. 
          </small>

        </Card.Body>
      </Card>




    </Layout>
  );
};

export default MyShop;
