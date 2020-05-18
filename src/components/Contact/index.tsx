import useTranslation from 'next-translate/useTranslation';
import Layout from '../Layout';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <Layout>
      <Card className="cauda_card mb-4 mx-auto">
        <Card.Header className="text-center">{t('common:contact')}</Card.Header>
        <Card.Body>
          <Form noValidate>
            <Form.Group controlId="contact-name">
              <Form.Label className="sr-only">{t('common:name')}</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faUser} fixedWidth />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  autoFocus
                  type="text"
                  name="name"
                  size="lg"
                  placeholder={t('common:name')}
                />
                <FormControl.Feedback type="invalid"></FormControl.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="contact-phone">
              <Form.Label className="sr-only">{t('common:phone')}</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faPhone} fixedWidth />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  type="tel"
                  name="userPhone"
                  size="lg"
                  placeholder={t('common:phone')}
                />
                <FormControl.Feedback type="invalid"></FormControl.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="contact-email">
              <Form.Label className="sr-only">{t('common:email')}</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faEnvelope} fixedWidth />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  type="email"
                  name="userEmail"
                  size="lg"
                  placeholder={t('common:email')}
                />
                <FormControl.Feedback type="invalid"></FormControl.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="contact-message">
              <Form.Label className="sr-only">{t('common:message')}</Form.Label>
              <Form.Control
                as="textarea"
                placeholder={t('common:enter-message')}
                rows={4}
              />
            </Form.Group>

            <Button
              variant="primary"
              href="#"
              block
              className="d-flex justify-content-between align-items-center py-2"
            >
              <div></div>
              {t('common:send')}
              <FontAwesomeIcon icon={faArrowRight} fixedWidth />
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  );
}
