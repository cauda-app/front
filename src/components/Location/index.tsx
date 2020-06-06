import React, { useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';

import step1 from './assets/step1.png';
import step2 from './assets/step2.png';
import step3 from './assets/step3.png';
import step4 from './assets/step4.png';
import Layout from '../Layout';
import Spinner from '../Spinner';
import Notification from '../Notification';

export type Coords = {
  lat: number;
  lng: number;
};

type Props = {
  render: (props: { coords: Coords }) => any;
};

const RequestGPSNotification = ({ render }: Props) => {
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState<number>();
  const [navigatorNotSupported, setNavigatorNotSupported] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [coords, setCoords] = useState<Coords>();

  const requestAccess = () => {
    setShowNotification(false);
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        setErrorCode(error.code);
        setLoading(false);
        Sentry.captureException(error);
      }
    );
  };

  useEffect(() => {
    const getGpsStatus = async () => {
      const PermissionStatus = await navigator.permissions.query({
        name: 'geolocation',
      });

      switch (PermissionStatus.state) {
        case 'granted':
          requestAccess();
          break;
        case 'prompt':
          setShowNotification(true);
          break;
        case 'denied':
          setErrorCode(1);
          break;
      }

      setLoading(false);
    };

    if (!navigator.geolocation) {
      setNavigatorNotSupported(true);
      return;
    }

    getGpsStatus();
  }, []);

  if (navigatorNotSupported) {
    return (
      <Layout>
        <div>Geolocation is not supported by this device.</div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  if (coords) {
    return render({ coords });
  }

  if (showNotification) {
    return (
      <Layout>
        <Notification
          title="Compartir Ubicación"
          subTitle="Vamos a solicitarte que actives tu Ubicación (GPS)"
          message="Es muy importante que aceptes para poder localizar comercios
              cercanos."
          onConfirm={requestAccess}
          countDown={5_000}
        />
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
              <img src={step1} alt="Paso 1" className="img-fluid border" />
              <br />
              <h3 className="h5">Paso 2</h3>
              <img src={step2} alt="Paso 2" className="img-fluid border" />
              <br />
              <h3 className="h5">Paso 3</h3>
              <img src={step3} alt="Paso 3" className="img-fluid border" />
              <br />
              <h3 className="h5">Paso 4</h3>
              <img src={step4} alt="Paso 4" className="img-fluid border" />

              <style jsx>
                {`
                  .img-fluid {
                    padding: 20px;
                  }
                `}
              </style>
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
