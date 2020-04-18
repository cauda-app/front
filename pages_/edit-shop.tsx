import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import Layout from '../src/components/Layout';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import GoogleMapReact from 'google-map-react';
import GeoSuggest from '../src/components/GeoSuggest';
import { isEmptyObject } from '../src/utils';

type MarkerProps = {
  lat: number;
  lng: number;
};

const Marker = (props: MarkerProps) => <div>*</div>;

interface Shop {
  name?: string;
  address?: string;
  coord?: { lat: number; long: number };
  phone?: string;
}

const createEmptyShop = () => ({
  name: '',
  address: '',
  coord: null,
  phone: '',
});

const initialState = (shop: Shop = createEmptyShop()) => {
  return {
    name: shop.name || '',
    address: shop.address || '',
    coord: shop.coord,
    phone: shop.phone || '',
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
  phone?: string;
}

const EditShop = () => {
  const { t } = useTranslation();
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [submitAttempt, setSubmitAttempt] = React.useState(false);
  const [errors, setErrors] = React.useState<ShopErrors>({});

  const validate = (shop: Shop) => {
    const errors: ShopErrors = {};

    if (!shop.name) {
      errors.name = t('common:shop-name-required');
    }

    if (!shop.address) {
      errors.address = t('common:shop-address-required');
    }

    if (!shop.phone) {
      errors.phone = t('common:shop-phone-required');
    }

    return errors;
  };

  React.useEffect(() => {
    if (submitAttempt) {
      setErrors(validate(state));
    }
  }, [state]);

  const onChange = (e) => {
    dispatch({ field: e.target.name, value: e.target.value });
  };

  const onAddressChange = (address, coord) => {
    dispatch({ field: 'address', value: address });
    dispatch({ field: 'coord', value: coord });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const errors = validate(state);

    if (isEmptyObject(errors)) {
      console.log('Form OK');
    } else {
      setErrors(errors);
      setSubmitAttempt(true);
    }
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
                  <InputGroup.Text>Icon</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  autoFocus
                  type="text"
                  name="name"
                  value={state.name}
                  onChange={onChange}
                  placeholder={t('common:shop-name')}
                  isInvalid={!!errors.name}
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
                  <InputGroup.Text>Icon</InputGroup.Text>
                </InputGroup.Prepend>
                <GeoSuggest
                  isInvalid={!!errors.address}
                  placeholder={t('common:shop-address')}
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
              <div style={{ height: '200px', width: '100%' }}>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: process.env.GOOGLE_PLACES_KEY }}
                  defaultCenter={{ lat: -34.603722, lng: -58.381592 }}
                  center={state.coord}
                  zoom={state.coord ? 18 : 2}
                >
                  <Marker {...state.coord} />
                </GoogleMapReact>
              </div>
            </Form.Group>

            <Form.Group controlId="shop-phone">
              <Form.Label className="sr-only">
                {t('common:shop-phone')}
              </Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Icon</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  type="text"
                  name="phone"
                  value={state.phone}
                  onChange={onChange}
                  placeholder={t('common:shop-phone')}
                  isInvalid={!!errors.phone}
                />
                <FormControl.Feedback type="invalid">
                  {errors.phone}
                </FormControl.Feedback>
              </InputGroup>
            </Form.Group>

            {/* <Form.Group controlId="shop-hours">
              <Form.Label className="sr-only">
                {t('common:shop-hours')}
              </Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Icon</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl placeholder={t('common:shop-hours')} />
              </InputGroup>
            </Form.Group> */}

            {/* {JSON.stringify(state)} */}

            <Button
              type="submit"
              variant="success"
              size="lg"
              className="mt-4"
              block
            >
              {t('common:save')}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default EditShop;
