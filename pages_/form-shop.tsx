import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import Layout from '../src/components/Layout';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import GoogleMapReact from 'google-map-react';
import GeoSuggest from '../src/components/GeoSuggest';
import { isEmptyObject, validatePhoneRequest } from '../src/utils';
import DayHourDropDown from '../src/components/DayHourDropDown';
import LoadingButton from '../src/components/LoadingButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStoreAlt } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import Map from 'src/components/Map';

interface FormValues {
  name?: string;
  address?: string;
  coord?: { lat: number; long: number };
  phone?: string;
  mondayOpen?: string;
  mondayClose?: string;
  tuesdayOpen?: string;
  tuesdayClose?: string;
  wednesdayOpen?: string;
  wednesdayClose?: string;
  thursdayOpen?: string;
  thursdayClose?: string;
  fridayOpen?: string;
  fridayClose?: string;
  saturdayOpen?: string;
  saturdayClose?: string;
  sundayOpen?: string;
  sundayClose?: string;
}

const resetFormValues = () => ({
  name: '',
  address: '',
  coord: null,
  phone: '',
  mondayIsOpen: true,
  mondayOpen: '09:00',
  mondayClose: '20:00',
  tuesdayIsOpen: true,
  tuesdayOpen: '09:00',
  tuesdayClose: '20:00',
  wednesdayIsOpen: true,
  wednesdayOpen: '09:00',
  wednesdayClose: '20:00',
  thursdayIsOpen: true,
  thursdayOpen: '09:00',
  thursdayClose: '20:00',
  fridayIsOpen: true,
  fridayOpen: '09:00',
  fridayClose: '20:00',
  saturdayIsOpen: true,
  saturdayOpen: '09:00',
  saturdayClose: '20:00',
  sundayOpen: '09:00',
  sundayClose: '20:00',
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
  phone?: string;
}

const EditShop = () => {
  const { t } = useTranslation();
  const [state, dispatch] = React.useReducer(reducer, resetFormValues());
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

    if (!values.phone) {
      errors.phone = t('common:shop-phone-required');
    } else {
      const isValid = await validatePhoneRequest(values.phone);
      if (!isValid) {
        errors.phone = t('common:shop-phone-invalid');
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    setIsSubmitting(true);

    const errors = await validate(state);

    if (isEmptyObject(errors)) {
      console.log('Form OK');
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
                  type="text"
                  name="phone"
                  value={state.phone}
                  onBlur={onChange}
                  placeholder={t('common:shop-phone')}
                  isInvalid={!!errors.phone}
                  disabled={isSubmitting}
                />
                <FormControl.Feedback type="invalid">
                  {errors.phone}
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
                openValue={state.mondayOpen}
                closeValue={state.mondayClose}
                onActiveChange={onCheckboxChange}
                onOpenChange={(value) => onHourChange('mondayOpen', value)}
                onCloseChange={(value) => onHourChange('mondayClose', value)}
                disabled={isSubmitting}
              />

              <DayHourDropDown
                label={t('common:days.tuesday')}
                active={state.tuesdayIsOpen}
                dayOfWeek="tuesday"
                openValue={state.tuesdayOpen}
                closeValue={state.tuesdayClose}
                onActiveChange={onCheckboxChange}
                onOpenChange={(value) => onHourChange('tuesdayOpen', value)}
                onCloseChange={(value) => onHourChange('tuesdayClose', value)}
                disabled={isSubmitting}
              />

              <DayHourDropDown
                label={t('common:days.wednesday')}
                active={state.wednesdayIsOpen}
                dayOfWeek="wednesday"
                openValue={state.wednesdayOpen}
                closeValue={state.wednesdayClose}
                onActiveChange={onCheckboxChange}
                onOpenChange={(value) => onHourChange('wednesdayOpen', value)}
                onCloseChange={(value) => onHourChange('wednesdayClose', value)}
                disabled={isSubmitting}
              />

              <DayHourDropDown
                label={t('common:days.thursday')}
                active={state.thursdayIsOpen}
                dayOfWeek="thursday"
                openValue={state.thursdayOpen}
                closeValue={state.thursdayClose}
                onActiveChange={onCheckboxChange}
                onOpenChange={(value) => onHourChange('thursdayOpen', value)}
                onCloseChange={(value) => onHourChange('thursdayClose', value)}
                disabled={isSubmitting}
              />

              <DayHourDropDown
                label={t('common:days.friday')}
                active={state.fridayIsOpen}
                dayOfWeek="friday"
                openValue={state.fridayOpen}
                closeValue={state.fridayClose}
                onActiveChange={onCheckboxChange}
                onOpenChange={(value) => onHourChange('fridayOpen', value)}
                onCloseChange={(value) => onHourChange('fridayClose', value)}
                disabled={isSubmitting}
              />

              <DayHourDropDown
                label={t('common:days.saturday')}
                active={state.saturdayIsOpen}
                dayOfWeek="saturday"
                openValue={state.saturdayOpen}
                closeValue={state.saturdayClose}
                onActiveChange={onCheckboxChange}
                onOpenChange={(value) => onHourChange('saturdayOpen', value)}
                onCloseChange={(value) => onHourChange('saturdayClose', value)}
                disabled={isSubmitting}
              />

              <DayHourDropDown
                label={t('common:days.sunday')}
                active={state.sundayIsOpen}
                dayOfWeek="sunday"
                openValue={state.sundayOpen}
                closeValue={state.sundayClose}
                onActiveChange={onCheckboxChange}
                onOpenChange={(value) => onHourChange('sundayOpen', value)}
                onCloseChange={(value) => onHourChange('sundayClose', value)}
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
