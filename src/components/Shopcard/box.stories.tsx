import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Shopcard from '.';

storiesOf('Shopcard', module).add('default', () => {
  return <Shopcard>Shopcard</Shopcard>;
});
