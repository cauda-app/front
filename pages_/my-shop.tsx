import useTranslation from 'next-translate/useTranslation';
import Layout from '../src/components/Layout';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
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
              href=""
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


      <Card className="cauda_card mb-4 mx-auto">
        <Card.Header className="text-center">
          {t('common:shop-details')}
        </Card.Header>
        {/* <div className="shop_map">
          <Card.Img variant="top" src="map.png" alt="ShopMap" />
        </div> */}
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

export default MyShop;
