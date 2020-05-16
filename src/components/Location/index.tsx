import React, { useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';

import step1 from './assets/step1.jpeg';
import step2 from './assets/step2.jpeg';
import step3 from './assets/step3.jpeg';
import Layout from '../Layout';
import Spinner from '../Spinner';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export type Coords = {
  lat: number;
  lng: number;
};

type Props = {
  render: (props: { coords: Coords }) => any;
};

const GPS_STATUS_KEY = 'GPS_STATUS';
const GPS_GRANTED = 'GPS_GRANTED';

const RequestGPSNotification = ({ render }: Props) => {
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState<number>();
  const [coords, setCoords] = useState<Coords>();
  const [notificationAccepted, setNotificationAccepted] = useState(false);

  const requestAccess = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        window.localStorage.setItem(GPS_STATUS_KEY, GPS_GRANTED);
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setNotificationAccepted(true);
        setLoading(false);
      },
      (error) => {
        window.localStorage.removeItem(GPS_STATUS_KEY);
        setNotificationAccepted(false);
        setLoading(false);
        setErrorCode(error.code);
        Sentry.captureException(error);
      }
    );
  };

  useEffect(() => {
    const res = window.localStorage.getItem(GPS_STATUS_KEY);
    if (res) {
      setNotificationAccepted(true);
      requestAccess();
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  if (!navigator.geolocation) {
    return (
      <Layout>
        <div>Geolocation is not supported by this device.</div>
      </Layout>
    );
  }

  if (coords) {
    return render({ coords });
  }

  if (!coords && !notificationAccepted && !errorCode) {
    return (
      <Layout>
        <div className="card cauda_card mt-3 mx-auto mb-5 px-3 py-4 p-sm-5 text-center">
          <p>
            <strong className="d-block mb-3">
              Por favor activa tu Ubicación (GPS)
            </strong>
            <span className="text-muted">
              Debes compartir tu ubicación actual para localizar comercios
              cercanos.
            </span>
          </p>
          <Button
            onClick={requestAccess}
            variant="primary"
            size="lg"
            className="d-flex justify-content-between align-items-center"
            block
          >
            <div></div>
            Continuar
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </div>
      </Layout>
    );
  }

  if (errorCode) {
    switch (errorCode) {
      case 1: //PERMISSION_DENIED
        return (
          <Layout>
            <div className="card Xcauda_card mt-0 mx-auto mb-5 px-2 py-3 p-sm-4 text-center">
              <div className="alert alert-warning mb-3">
                <strong>Tu Ubicación está bloqueada</strong> <br /> sigue estos
                pasos para activarla:
              </div>
              <p>
                <strong>
                  Debes compartir tu ubicación actual para usar esta aplicación.
                </strong>
              </p>
              <hr />
              <h3 className="h5">Paso 1</h3>
              <img src={step1} alt="Paso 1" className="img-fluid mb-4 border" />
              <h3 className="h5">Paso 2</h3>
              <img src={step2} alt="Paso 2" className="img-fluid mb-4 border" />
              <h3 className="h5">Paso 3</h3>
              <img src={step3} alt="Paso 3" className="img-fluid border" />
            </div>
          </Layout>
        );
      case 2: //POSITION_UNAVAILABLE
        return <div>"Location information is unavailable."</div>;
      case 3: // TIMEOUT
        return <div>"The request to get user location timed out."</div>;
      default:
        return <div>"An unknown error occurred."</div>;
    }
  }
};

export default RequestGPSNotification;
