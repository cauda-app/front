import React from 'react';
import { storiesOf } from '@storybook/react';
import Notification from '.';

storiesOf('Notification', module).add('default', () => {
  return (
    <Notification
      title="SomeTitle"
      message="asd"
      onConfirm={() => alert('asd')}
    />
  );
});
