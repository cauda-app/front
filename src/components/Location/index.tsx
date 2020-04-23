import React, { useState, useEffect } from 'react';
import { geolocated, GeolocatedProps } from 'react-geolocated';

const GPS_STATUS_KEY = 'GPS_STATUS';
const DENIED = 'DENIED';
const APPROVED = 'APPROVED';
const LOADING = 'LOADING';

export type Coords = {
  lat: number;
  lng: number;
};

type Props = {
  render: (props: Coords) => JSX.Element;
} & GeolocatedProps;

function Location({
  isGeolocationAvailable,
  isGeolocationEnabled,
  coords,
  render,
}: Props) {
  const deleteGPSStorageAndRefresh = () => {
    window.localStorage.removeItem(GPS_STATUS_KEY);
    location.reload();
  };

  if (!isGeolocationAvailable) {
    return <div>Tu dispositivo no soporta uso de GPS</div>;
  }

  if (!isGeolocationEnabled) {
    window.localStorage.setItem(GPS_STATUS_KEY, DENIED);
    return (
      <div>
        Permita el uso de GPS
        <button onClick={deleteGPSStorageAndRefresh}>Refrescar</button>
      </div>
    );
  }

  if (!coords) {
    return <div>Loading...</div>;
  }

  window.localStorage.setItem(GPS_STATUS_KEY, APPROVED);
  return render({ lat: coords.latitude, lng: coords.longitude });
}

const GeoLocation = geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 15000,
})(Location);

type RequestGPSNotificationType = {
  render: (props: Coords) => JSX.Element;
};

const RequestGPSNotification = ({ render }: RequestGPSNotificationType) => {
  const [gpsStatus, setGpsStatus] = useState(LOADING);
  const [requestAccess, setRequestAccess] = useState(false);

  const deleteGPSStorageAndRefresh = () => {
    window.localStorage.removeItem(GPS_STATUS_KEY);
    location.reload();
  };

  useEffect(() => {
    setGpsStatus(window.localStorage.getItem(GPS_STATUS_KEY));
  });

  if (gpsStatus === LOADING) {
    return <div>Loading...</div>;
  }

  if (!gpsStatus && !requestAccess) {
    return (
      <div>
        Vamos a solicitarte que actives tu GPS. Si denegas el acceso, no vas a
        poder usar la aplicación.
        <button onClick={() => setRequestAccess(true)}>Continuar</button>
      </div>
    );
  }

  if (gpsStatus === DENIED) {
    return (
      <div>
        Has denegado el acceso al GPS, tenés que habilitarlo antes de continuar
        <button onClick={deleteGPSStorageAndRefresh}>Refrescar</button>
      </div>
    );
  }

  if (requestAccess || gpsStatus === APPROVED) {
    return <GeoLocation render={render} />;
  }
};

export default RequestGPSNotification;
