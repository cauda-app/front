import React from 'react';
import { storiesOf } from '@storybook/react';
import Location, { Coords } from '.';

storiesOf('Location', module).add('default', () => {
  return (
    <div style={{ marginTop: '120px' }}>
      <Location
        render={({ coords }: { coords: Coords }) => {
          return (
            <>
              <div>lat: {coords.lat}</div>
              <div>lng: {coords.lng}</div>
            </>
          );
        }}
      />
    </div>
  );
});
