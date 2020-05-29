import React from 'react';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStoreAlt } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';

import createPrismaClient from '../prisma/client';
import { getToken } from 'src/utils/next';
import { isEmptyObject, validatePhoneRequest } from 'src/utils';
import GeoSuggest from 'src/components/GeoSuggest';
import DayHourDropDown from 'src/components/DayHourDropDown';
import LoadingButton from 'src/components/LoadingButton';
import Map from 'src/components/Map';
import graphqlClient from 'src/graphqlClient';
import Layout from 'src/components/Layout';
import Spinner from 'src/components/Spinner';
import { days } from 'src/utils/dates';
import { getNationalNumber } from 'src/utils/phone-utils';
import useFirebaseMessage from 'src/hooks/useFirebaseMessage';

const CREATE = /* GraphQL */ `
  mutation createShop($shop: ShopInput!) {
    registerShop(shop: $shop) {
      id
    }
  }
`;

const EDIT = /* GraphQL */ `
  mutation updateShop($shop: ShopInput!) {
    updateShop(shop: $shop) {
      id
    }
  }
`;

interface Shop {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  shopPhone?: string;
  mondayTimeStart?: string;
  mondayTimeEnd?: string;
  tuesdayTimeStart?: string;
  tuesdayTimeEnd?: string;
  wednesdayTimeStart?: string;
  wednesdayTimeEnd?: string;
  thursdayTimeStart?: string;
  thursdayTimeEnd?: string;
  fridayTimeStart?: string;
  fridayTimeEnd?: string;
  saturdayTimeStart?: string;
  saturdayTimeEnd?: string;
  sundayTimeStart?: string;
  sundayTimeEnd?: string;
}

interface FormValues {
  id?: string;
  name?: string;
  address?: string;
  coord?: { lat: number; lng: number };
  shopPhone?: string;
  mondayIsOpen: boolean;
  tuesdayIsOpen: boolean;
  wednesdayIsOpen: boolean;
  thursdayIsOpen: boolean;
  fridayIsOpen: boolean;
  saturdayIsOpen: boolean;
  sundayIsOpen: boolean;
  mondayTimeStart?: string;
  mondayTimeEnd?: string;
  tuesdayTimeStart?: string;
  tuesdayTimeEnd?: string;
  wednesdayTimeStart?: string;
  wednesdayTimeEnd?: string;
  thursdayTimeStart?: string;
  thursdayTimeEnd?: string;
  fridayTimeStart?: string;
  fridayTimeEnd?: string;
  saturdayTimeStart?: string;
  saturdayTimeEnd?: string;
  sundayTimeStart?: string;
  sundayTimeEnd?: string;
}

const initFormValues = (shop?: Shop): FormValues => {
  if (shop) {
    return {
      id: shop.id,
      name: shop.name,
      address: shop.address,
      coord: { lat: shop.lat, lng: shop.lng },
      shopPhone: shop.shopPhone,
      mondayIsOpen: !!shop.mondayTimeStart,
      tuesdayIsOpen: !!shop.tuesdayTimeStart,
      wednesdayIsOpen: !!shop.wednesdayTimeStart,
      thursdayIsOpen: !!shop.thursdayTimeStart,
      fridayIsOpen: !!shop.fridayTimeStart,
      saturdayIsOpen: !!shop.saturdayTimeStart,
      sundayIsOpen: !!shop.sundayTimeStart,
      mondayTimeStart: shop.mondayTimeStart || '09:00:00Z',
      mondayTimeEnd: shop.mondayTimeEnd || '20:00:00Z',
      tuesdayTimeStart: shop.tuesdayTimeStart || '09:00:00Z',
      tuesdayTimeEnd: shop.tuesdayTimeEnd || '20:00:00Z',
      wednesdayTimeStart: shop.wednesdayTimeStart || '09:00:00Z',
      wednesdayTimeEnd: shop.wednesdayTimeEnd || '20:00:00Z',
      thursdayTimeStart: shop.thursdayTimeStart || '09:00:00Z',
      thursdayTimeEnd: shop.thursdayTimeEnd || '20:00:00Z',
      fridayTimeStart: shop.fridayTimeStart || '09:00:00Z',
      fridayTimeEnd: shop.fridayTimeEnd || '20:00:00Z',
      saturdayTimeStart: shop.saturdayTimeStart || '09:00:00Z',
      saturdayTimeEnd: shop.saturdayTimeEnd || '20:00:00Z',
      sundayTimeStart: shop.sundayTimeStart || '09:00:00Z',
      sundayTimeEnd: shop.sundayTimeEnd || '20:00:00Z',
    };
  }

  return {
    name: '',
    address: '',
    coord: undefined,
    shopPhone: '',
    mondayIsOpen: true,
    tuesdayIsOpen: true,
    wednesdayIsOpen: true,
    thursdayIsOpen: true,
    fridayIsOpen: true,
    saturdayIsOpen: true,
    sundayIsOpen: false,
    mondayTimeStart: '09:00:00Z',
    mondayTimeEnd: '20:00:00Z',
    tuesdayTimeStart: '09:00:00Z',
    tuesdayTimeEnd: '20:00:00Z',
    wednesdayTimeStart: '09:00:00Z',
    wednesdayTimeEnd: '20:00:00Z',
    thursdayTimeStart: '09:00:00Z',
    thursdayTimeEnd: '20:00:00Z',
    fridayTimeStart: '09:00:00Z',
    fridayTimeEnd: '20:00:00Z',
    saturdayTimeStart: '09:00:00Z',
    saturdayTimeEnd: '20:00:00Z',
    sundayTimeStart: '09:00:00Z',
    sundayTimeEnd: '20:00:00Z',
  };
};

const reducer = (state, { field, value }) => {
  return {
    ...state,
    [field]: value,
  };
};

interface ShopErrors {
  name?: string;
  address?: string;
  shopPhone?: string;
}

type Props = {
  isLoggedIn: boolean;
  shop?: Shop;
};

const EditShop = ({ isLoggedIn, shop }: Props) => {
  const { t } = useTranslation();
  useFirebaseMessage();
  const [state, dispatch] = React.useReducer(reducer, initFormValues(shop));
  const [submitAttempt, setSubmitAttempt] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<ShopErrors>({});

  const validate = async (values: FormValues) => {
    const errors: ShopErrors = {};

    if (!values.name) {
      errors.name = t('common:shop-name-required');
    }

    if (!values.address) {
      errors.address = t('common:shop-address-required');
    }

    if (values.shopPhone) {
      const isValid = await validatePhoneRequest(values.shopPhone);
      if (!isValid) {
        errors.shopPhone = t('common:phone-invalid');
      }
    }

    return errors;
  };

  React.useEffect(() => {
    async function setErrorsAsync() {
      if (submitAttempt) {
        setErrors(await validate(state));
      }
    }

    setErrorsAsync();
  }, [state]);

  React.useEffect(() => {
    if (!isLoggedIn) {
      Router.push('/register-phone?redirectTo=/shop-form');
    }
  }, [isLoggedIn]);

  const onChange = (e) => {
    dispatch({ field: e.target.name, value: e.target.value });
  };

  const onCheckboxChange = (e) => {
    dispatch({ field: e.target.name, value: e.target.checked });
  };

  const onAddressChange = (address, coord) => {
    dispatch({ field: 'address', value: address });
    dispatch({ field: 'coord', value: coord });
  };

  const onHourChange = (name, value) => {
    dispatch({ field: name, value });
  };

  const upsertShop = async (id?: string) => {
    const shopInput = {
      ...state,
      lat: state.coord.lat,
      lng: state.coord.lng,
    };
    delete shopInput.coord;

    for (const day of days) {
      if (!shopInput[day + 'IsOpen']) {
        shopInput[day + 'TimeStart'] = null;
        shopInput[day + 'TimeEnd'] = null;
      }
      delete shopInput[day + 'IsOpen'];
    }

    const mutation = id ? EDIT : CREATE;
    await graphqlClient.request(mutation, {
      shop: shopInput,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    setIsSubmitting(true);

    const errors = await validate(state);

    if (isEmptyObject(errors)) {
      await upsertShop(state.id);
      Router.push('/my-shop');
      return;
    } else {
      setErrors(errors);
      setSubmitAttempt(true);
    }

    setIsSubmitting(false);
  };

  if (!isLoggedIn) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <Card className="cauda_card mb-4 mx-auto">
        <Card.Header className="text-center">
          {t('common:shop-details')}
        </Card.Header>
        <Card.Body>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group controlId="shop-name">
              <Form.Label className="sr-only">
                {t('common:shop-name')}
              </Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faStoreAlt} fixedWidth />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  autoFocus
                  type="text"
                  name="name"
                  value={state.name}
                  onChange={onChange}
                  placeholder={t('common:shop-name')}
                  isInvalid={!!errors.name}
                  disabled={isSubmitting}
                />
                <FormControl.Feedback type="invalid">
                  {errors.name}
                </FormControl.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="shop-address">
              <Form.Label className="sr-only">
                {t('common:shop-address')}
              </Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faMapMarkerAlt} fixedWidth />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <GeoSuggest
                  initialValue={state.address}
                  isInvalid={!!errors.address}
                  placeholder={t('common:shop-address')}
                  disabled={isSubmitting}
                  onChange={() => onAddressChange('', null)}
                  onSuggestSelect={(suggestion) => {
                    if (suggestion) {
                      onAddressChange(suggestion.label, suggestion.location);
                    } else {
                      onAddressChange('', null);
                    }
                  }}
                />
                <FormControl.Feedback type="invalid">
                  {errors.address}
                </FormControl.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="shop-map">
              <Map {...state.coord} />
            </Form.Group>

            <Form.Group controlId="shop-phone">
              <Form.Label className="sr-only">
                {t('common:shop-phone')}
              </Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faPhone} fixedWidth />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  type="tel"
                  name="shopPhone"
                  value={state.shopPhone}
                  onBlur={onChange}
                  placeholder={t('common:shop-phone')}
                  isInvalid={!!errors.shopPhone}
                  disabled={isSubmitting}
                />
                <FormControl.Feedback type="invalid">
                  {errors.shopPhone}
                </FormControl.Feedback>
              </InputGroup>
            </Form.Group>

            <hr />

            <h6 className="mb-3">{t('common:shop-hours')}</h6>

            <Container className="p-0">
              <DayHourDropDown
                label={t('common:days.monday')}
                active={state.mondayIsOpen}
                dayOfWeek="monday"
                openValue={state.mondayTimeStart}
                closeValue={state.mondayTimeEnd}
                onActiveChange={onCheckboxChange}
                onOpenChange={(value) => onHourChange('mondayTimeStart', value)}
                onCloseChange={(value) => onHourChange('mondayTimeEnd', value)}
                disabled={isSubmitting}
              />

              <DayHourDropDown
                label={t('common:days.tuesday')}
                active={state.tuesdayIsOpen}
                dayOfWeek="tuesday"
                openValue={state.tuesdayTimeStart}
                closeValue={state.tuesdayTimeEnd}
                onActiveChange={onCheckboxChange}
                onOpenChange={(value) =>
                  onHourChange('tuesdayTimeStart', value)
                }
                onCloseChange={(value) => onHourChange('tuesdayTimeEnd', value)}
                disabled={isSubmitting}
              />

              <DayHourDropDown
                label={t('common:days.wednesday')}
                active={state.wednesdayIsOpen}
                dayOfWeek="wednesday"
                openValue={state.wednesdayTimeStart}
                closeValue={state.wednesdayTimeEnd}
                onActiveChange={onCheckboxChange}
                onOpenChange={(value) =>
                  onHourChange('wednesdayTimeStart', value)
                }
                onCloseChange={(value) =>
                  onHourChange('wednesdayTimeEnd', value)
                }
                disabled={isSubmitting}
              />

              <DayHourDropDown
                label={t('common:days.thursday')}
                active={state.thursdayIsOpen}
                dayOfWeek="thursday"
                openValue={state.thursdayTimeStart}
                closeValue={state.thursdayTimeEnd}
                onActiveChange={onCheckboxChange}
                onOpenChange={(value) =>
                  onHourChange('thursdayTimeStart', value)
                }
                onCloseChange={(value) =>
                  onHourChange('thursdayTimeEnd', value)
                }
                disabled={isSubmitting}
              />

              <DayHourDropDown
                label={t('common:days.friday')}
                active={state.fridayIsOpen}
                dayOfWeek="friday"
                openValue={state.fridayTimeStart}
                closeValue={state.fridayTimeEnd}
                onActiveChange={onCheckboxChange}
                onOpenChange={(value) => onHourChange('fridayTimeStart', value)}
                onCloseChange={(value) => onHourChange('fridayTimeEnd', value)}
                disabled={isSubmitting}
              />

              <DayHourDropDown
                label={t('common:days.saturday')}
                active={state.saturdayIsOpen}
                dayOfWeek="saturday"
                openValue={state.saturdayTimeStart}
                closeValue={state.saturdayTimeEnd}
                onActiveChange={onCheckboxChange}
                onOpenChange={(value) =>
                  onHourChange('saturdayTimeStart', value)
                }
                onCloseChange={(value) =>
                  onHourChange('saturdayTimeEnd', value)
                }
                disabled={isSubmitting}
              />

              <DayHourDropDown
                label={t('common:days.sunday')}
                active={state.sundayIsOpen}
                dayOfWeek="sunday"
                openValue={state.sundayTimeStart}
                closeValue={state.sundayTimeEnd}
                onActiveChange={onCheckboxChange}
                onOpenChange={(value) => onHourChange('sundayTimeStart', value)}
                onCloseChange={(value) => onHourChange('sundayTimeEnd', value)}
                disabled={isSubmitting}
              />
            </Container>

            {/* {JSON.stringify(state)} */}

            <LoadingButton
              isLoading={isSubmitting}
              type="submit"
              variant="success"
              size="lg"
              className="mt-4"
            >
              {t('common:save')}
            </LoadingButton>

            <Link href={'/my-shop'} passHref>
              <Button
                block
                type="button"
                disabled={isSubmitting}
                variant="link"
                className="mt-3 text-dark"
              >
                {t('common:cancel')}
              </Button>
            </Link>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = getToken(context);
  if (!token) {
    return { props: { isLoggedIn: false } };
  }

  const shopId = token.shopId;

  if (shopId) {
    const prisma = createPrismaClient();

    const dbShop = await prisma.shopDetails.findOne({
      where: { shopId },
    });

    await prisma.disconnect();

    if (dbShop) {
      const shop = {
        id: dbShop.shopId,
        name: dbShop.name,
        address: dbShop.address,
        lat: dbShop.lat,
        lng: dbShop.lng,
        shopPhone: dbShop.shopPhone
          ? String(getNationalNumber(dbShop.shopPhone))
          : '',
        mondayTimeStart: dbShop.mondayTimeStart,
        mondayTimeEnd: dbShop.mondayTimeEnd,
        tuesdayTimeStart: dbShop.tuesdayTimeStart,
        tuesdayTimeEnd: dbShop.tuesdayTimeEnd,
        wednesdayTimeStart: dbShop.wednesdayTimeStart,
        wednesdayTimeEnd: dbShop.wednesdayTimeEnd,
        thursdayTimeStart: dbShop.thursdayTimeStart,
        thursdayTimeEnd: dbShop.thursdayTimeEnd,
        fridayTimeStart: dbShop.fridayTimeStart,
        fridayTimeEnd: dbShop.fridayTimeEnd,
        saturdayTimeStart: dbShop.saturdayTimeStart,
        saturdayTimeEnd: dbShop.saturdayTimeEnd,
        sundayTimeStart: dbShop.sundayTimeStart,
        sundayTimeEnd: dbShop.sundayTimeEnd,
      };
      return { props: { isLoggedIn: true, shop } };
    } else {
      context.res.statusCode = 404;
      return { props: { isLoggedIn: true, statusCode: 404 } };
    }
  } else {
    return { props: { isLoggedIn: true, shop: null } };
  }
};

export default EditShop;
