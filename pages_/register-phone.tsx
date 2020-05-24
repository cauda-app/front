import React, { useState, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import parseISO from 'date-fns/parseISO';
import Router, { useRouter } from 'next/router';
import * as Sentry from '@sentry/browser';

import Layout from 'src/components/Layout';
import { validatePhoneRequest, getErrorCodeFromApollo } from 'src/utils';
import graphqlClient from 'src/graphqlClient';
import Spinner from 'src/components/Spinner';
import GoBack from 'src/components/GoBack';

const VERIFY_CODE = /* GraphQL */ `
  mutation VerifyCode($code: Int!, $phone: String!) {
    verifyCode(code: $code, phone: $phone)
  }
`;

const VERIFY_PHONE = /* GraphQL */ `
  mutation VerifyPhone($phone: String!) {
    verifyPhone(phone: $phone)
  }
`;

const VerifyPhone = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [sendCodeScreen, setSendCodeScreen] = useState(true);
  const [phone, setPhone] = useState<string>('');
  const [code, setCode] = useState<number>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ phone?: string; code?: string }>({});
  const [expiresIn, setExpiresIn] = useState<Date>();
  const [countDown, setCountDown] = useState('');

  const onChange = (e) => {
    setErrors({});
    e.target.name === 'phone'
      ? setPhone(e.target.value)
      : setCode(e.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (sendCodeScreen) {
      onSendCode();
    } else {
      onVerifyCode();
    }
  };

  const onSendCode = async () => {
    const isValid = await validatePhoneRequest(phone);

    if (!isValid) {
      setErrors({ ...errors, phone: t('common:phone-invalid') });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await graphqlClient.request(VERIFY_PHONE, { phone });
      setExpiresIn(parseISO(res.verifyPhone));
      setIsSubmitting(false);
      setSendCodeScreen(false);
    } catch (error) {
      const code = getErrorCodeFromApollo(error);

      switch (code) {
        case 'LIMIT_CODE_SENT_EXCEEDED':
          setErrors({ ...errors, phone: t('common:limit-code-sent-exceeded') });
          break;
        case 'IN_PROGRESS_VERIFICATION':
          setErrors({ ...errors, phone: t('common:in-progress-verification') });
          break;
        default:
          setErrors({ ...errors, phone: t('common:mutation-error') });
          break;
      }

      Sentry.captureException(error);
      setIsSubmitting(false);
    }
  };

  const onVerifyCode = async () => {
    if (!code) {
      setErrors({ ...errors, code: t('common:code-required') });
      return;
    }

    setIsSubmitting(true);

    try {
      await graphqlClient.request(VERIFY_CODE, { code: Number(code), phone });

      const redirectTo = (router.query.redirectTo as string) || '/';

      Router.push(redirectTo);
    } catch (error) {
      const code = getErrorCodeFromApollo(error);

      if (['PHONE_NOT_REGISTERED', 'CODE_EXPIRED'].includes(code)) {
        setErrors({ ...errors, phone: t('common:verification-failed') });
        setIsSubmitting(false);
        setSendCodeScreen(true);
        return;
      }

      if ('INCORRECT_CODE' === code) {
        setErrors({ ...errors, code: t('common:incorrect-code') });
        setIsSubmitting(false);
      }

      setIsSubmitting(false);
      Sentry.captureException(error);
    }
  };

  useEffect(() => {
    if (!expiresIn) {
      return;
    }

    const interval = setInterval(() => {
      let now = new Date();
      if (expiresIn > now) {
        const totalSeconds = differenceInSeconds(expiresIn, +Date.now());
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const formattedDif = `${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        setCountDown(formattedDif);
      } else {
        setCountDown('');
        setErrors({ ...errors, phone: t('common:expired-code') });
        setSendCodeScreen(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresIn]);

  return (
    <Layout>
      <Card className="cauda_card mb-4 mx-auto text-center">
        <Card.Header className="text-left">
          {sendCodeScreen && <GoBack />}
          {t('common:register')}
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {sendCodeScreen && (
              <>
                <Form.Group controlId="register-cellphone">
                  <Form.Label className="sr-only">
                    {t('common:register-cellphone')}
                  </Form.Label>
                  <InputGroup size="lg">
                    <InputGroup.Prepend>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faPhone} fixedWidth />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      autoFocus
                      placeholder={t('common:enter-cellphone')}
                      type="tel"
                      name="phone"
                      value={phone}
                      onChange={onChange}
                      isInvalid={!!errors.phone}
                      disabled={isSubmitting}
                    />
                    <FormControl.Feedback type="invalid">
                      {errors.phone}
                    </FormControl.Feedback>
                  </InputGroup>
                </Form.Group>

                <Button
                  onClick={onSendCode}
                  variant="primary"
                  size="lg"
                  className="mb-3 mb-sm-1"
                  block
                >
                  {isSubmitting ? <Spinner /> : t('common:send-code')}
                </Button>
              </>
            )}

            {!sendCodeScreen && (
              <>
                <Form.Group controlId="shop-cellphone">
                  <Form.Label className="sr-only">
                    {t('common:enter-code')}
                  </Form.Label>
                  <InputGroup size="lg">
                    <FormControl
                      autoFocus
                      placeholder={t('common:enter-code')}
                      type="tel"
                      name="code"
                      value={code}
                      onChange={onChange}
                      isInvalid={!!errors.code}
                      disabled={isSubmitting}
                    />
                    <FormControl.Feedback type="invalid">
                      {errors.code}
                    </FormControl.Feedback>
                  </InputGroup>
                </Form.Group>

                <Button
                  onClick={onVerifyCode}
                  variant="primary"
                  size="lg"
                  className="mb-3 mb-sm-1"
                  block
                  disabled={isSubmitting}
                >
                  {`${t('common:verify-code')} ${countDown}`}
                </Button>
              </>
            )}

            <small className="text-muted">
              {t('common:accept-by-continue')}{' '}
              <Link href="/terms">
                <a>{t('common:terms-conditions')}</a>
              </Link>
              .
            </small>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default VerifyPhone;
