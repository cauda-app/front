import useTranslation from 'next-translate/useTranslation';
import Layout from '../src/components/Layout';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';

const MyShop = () => {
  const { t } = useTranslation();
  return (
    <Layout>

      <Card className="cauda_card mb-4 mx-auto text-center">
        <Card.Header>
          {t('common:shop-details')}
        </Card.Header>
        <Card.Body>

          <Form>

            <Form.Group controlId="shop-cellphone">
              <Form.Label className="sr-only">{t('common:shop-cellphone')}</Form.Label>
              <InputGroup size="lg">
                <InputGroup.Prepend>
                  <InputGroup.Text>Icon</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder={t('common:enter-cellphone')}
                />
              </InputGroup>
            </Form.Group>

            <Button
              href="/edit-shop"
              variant="primary"
              size="lg"
              className="mb-3"
              block
            >{t('common:continue')}</Button>

            <small className="text-muted">
              {t('common:accept-by-continue')} <Link href="/terms"><a>{t('common:terms-conditions')}</a></Link>. 
            </small>

          </Form>

        </Card.Body>
      </Card>

    </Layout>
  );
};

export default MyShop;
