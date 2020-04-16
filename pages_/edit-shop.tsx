import useTranslation from 'next-translate/useTranslation';
import Layout from '../src/components/Layout';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';

const EditShop = () => {
  const { t } = useTranslation();
  return (
    <Layout>

      <Card className="cauda_card mb-4 mx-auto">
        <Card.Header className="text-center">
          {t('common:shop-details')}
        </Card.Header>
        <Card.Body>

          <Form>

            <Form.Group controlId="shop-name">
              <Form.Label className="sr-only">{t('common:shop-name')}</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Icon</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder={t('common:shop-name')}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="shop-address">
              <Form.Label className="sr-only">{t('common:shop-address')}</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Icon</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder={t('common:shop-address')}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="shop-phone">
              <Form.Label className="sr-only">{t('common:shop-phone')}</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Icon</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder={t('common:shop-phone')}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="shop-hours">
              <Form.Label className="sr-only">{t('common:shop-hours')}</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Icon</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder={t('common:shop-hours')}
                />
              </InputGroup>
            </Form.Group>
 
            <Button
              href=""
              variant="success"
              size="lg"
              className="mt-4"
              block
            >{t('common:save')}</Button>
          
          </Form>

        </Card.Body>
      </Card>

    </Layout>
  );
};

export default EditShop;
