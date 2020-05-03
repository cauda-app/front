import React from 'react';
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
import Router from 'next/router';

import { isEmptyObject, validatePhoneRequest } from 'src/utils';
import GeoSuggest from 'src/components/GeoSuggest';
import DayHourDropDown from 'src/components/DayHourDropDown';
import LoadingButton from 'src/components/LoadingButton';
import Map from 'src/components/Map';
import graphqlClient from 'src/graphqlClient';
import Layout from 'src/components/Layout';
import { days } from 'src/utils/dates';

const MUTATION = /* GraphQL */ `
  mutation createShop($shop: ShopInput!) {
    registerShop(shop: $shop) {
      id
    }
  }
`;

interface FormValues {
  name?: string;
  address?: string;
  coord?: { lat: number; long: number };
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

const resetFormValues = () => ({
  name: '',
  address: '',
  coord: null,
  shopPhone: '',
  mondayIsOpen: true,
  tuesdayIsOpen: true,
  wednesdayIsOpen: true,
  thursdayIsOpen: true,
  fridayIsOpen: true,
  saturdayIsOpen: true,
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
});

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

const EditShop = () => {
  const { t } = useTranslation();
  const [state, dispatch] = React.useReducer(reducer, resetFormValues());
  const [submitAttempt, setSubmitAttempt] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<ShopErrors>({});
  const [creationError, setCreationError] = React.useState();

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

  const createShop = async () => {
    const shopInput = {
      ...state,
      lat: state.coord.lat,
      lng: state.coord.lng,
    };
    delete shopInput.coord;

    for (const day of days) {
      if (!shopInput[day + 'IsOpen']) {
        delete shopInput[day + 'TimeStart'];
        delete shopInput[day + 'TimeEnd'];
      }
      delete shopInput[day + 'IsOpen'];
    }

    try {
      await graphqlClient.request(MUTATION, {
        shop: shopInput,
      });
      Router.push('/my-shop');
    } catch (error) {
      Router.push('/generic-error');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    setIsSubmitting(true);

    const errors = await validate(state);

    if (isEmptyObject(errors)) {
      createShop();
    } else {
      setErrors(errors);
      setSubmitAttempt(true);
    }

    setIsSubmitting(false);
  };

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
                  type="number"
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

            <LoadingButton isLoading={isSubmitting} label={t('common:save')} />
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default EditShop;
