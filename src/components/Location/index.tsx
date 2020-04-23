import React from 'react';
import { geolocated, GeolocatedProps } from 'react-geolocated';

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
  if (!isGeolocationAvailable) {
    return <div>Tu dispositivo no soporta uso de GPS</div>;
  }

  if (!isGeolocationEnabled) {
    return <div>Permita el uso de GPS</div>;
  }

  if (!coords) {
    return <div>Loading...</div>;
  }

  return render({ lat: coords.latitude, lng: coords.longitude });
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 15000,
})(Location);
