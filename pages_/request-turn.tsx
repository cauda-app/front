import useTranslation from 'next-translate/useTranslation';
import Layout from '../src/components/Layout';
import Shopcard from '../src/components/ShopCard';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

const RequestTurn = () => {
  const { t } = useTranslation();
  return (
    <Layout>

      {/* <Shopcard /> */}

      <Card className="cauda_card mt-3 mx-auto text-center">
        <Card.Body>

          <Form>

            <Form.Group controlId="client-cellphone">
              <Form.Label className="sr-only">{t('common:client-cellphone')}</Form.Label>
              <InputGroup size="lg">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faPhone} />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder={t('common:enter-cellphone')}
                />
              </InputGroup>
              <Form.Text className="text-muted">
                {t('common:enter-phone-desc')}
              </Form.Text>
            </Form.Group>

            <Button
              href=""
              variant="primary"
              size="lg"
              className="mb-3 mb-sm-0 d-flex justify-content-between align-items-center"
              block
            >
              <div></div>
              {t('common:continue')}
              <FontAwesomeIcon icon={faChevronRight} />
            </Button>

            <small className="text-muted">
              {t('common:accept-by-continue')} <Link href="/terms"><a>{t('common:terms-conditions')}</a></Link>. 
            </small>

          </Form>

        </Card.Body>
      </Card>

      <Card className="cauda_card mt-3 mx-auto text-center">
        <Card.Body>

          <Form>

            <Form.Group controlId="client-code">
              <Form.Label className="sr-only">{t('common:enter-code')}</Form.Label>
              <InputGroup size="lg">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faHashtag} />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder={t('common:enter-code')}
                />
              </InputGroup>
              <Form.Text className="text-muted">
                {t('common:enter-code-desc')}
              </Form.Text>
            </Form.Group>

            <Button
              href=""
              variant="success"
              size="lg"
              className="mb-2 d-flex justify-content-between align-items-center"
              block
            >
              <FontAwesomeIcon icon={faCalendarCheck} />
              {t('common:confirm-turn')}
              <div></div>
            </Button>

            <small className="text-muted">
              {t('common:enter-code-desc-line2')}
            </small>

          </Form>

        </Card.Body>
      </Card>
 
    </Layout>
  );
};

export default RequestTurn;
