import React from 'react';
import GoogleMapReact from 'google-map-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

interface MarkerProps {
  lat?: number;
  lng?: number;
}

const Marker = (props: MarkerProps) => (
  <FontAwesomeIcon icon={faMapMarkerAlt} fixedWidth size="lg" />
);

export default function Map({ lat, lng, ...rest }: MarkerProps) {
  const coords = React.useMemo(() => (lat && lng ? { lat, lng } : null), [
    lat,
    lng,
  ]);

  return (
    <div className="root">
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.GOOGLE_PLACES_KEY }}
        defaultCenter={{ lat: -34.603722, lng: -58.381592 }} // TODO: Fixed for Argentina
        center={coords}
        zoom={coords ? 18 : 2}
        {...rest}
      >
        {coords ? <Marker {...coords} /> : null}
      </GoogleMapReact>

      <style jsx>{`
        .root {
          height: 200px;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
