import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Location, { Coords } from '.';

storiesOf('Location', module).add('default', () => {
  return (
    <div style={{ marginTop: '120px' }}>
      <Location
        render={({ lat, lng }: Coords) => (
          <>
            <div>lat: {lat}</div>
            <div>lng: {lng}</div>
          </>
        )}
      />
    </div>
  );
});
