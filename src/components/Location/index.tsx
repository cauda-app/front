import React, { useState, useEffect } from 'react';

import step1 from './assets/step1.jpeg';
import step2 from './assets/step2.jpeg';
import step3 from './assets/step3.jpeg';
import Layout from '../Layout';
import Spinner from '../Spinner';

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
        <div>
          Vamos a solicitarte que actives tu GPS. Si denegas el acceso, no vas a
          poder usar la aplicación.
          <button onClick={requestAccess}>Continuar</button>
        </div>
      </Layout>
    );
  }

  if (errorCode) {
    switch (errorCode) {
      case 1: //PERMISSION_DENIED
        return (
          <div>
            <div
              style={{
                margin: '15px',
                padding: '30px',
                border: '1px solid black',
                color: 'red',
              }}
            >
              Tu Ubicación está bloqueada, segui estos pasos para desbloquearla
            </div>
            <img src={step1} alt="step1" />
            <img src={step2} alt="step1" />
            <img src={step3} alt="step1" />
          </div>
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
