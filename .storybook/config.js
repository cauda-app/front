import '../src/assets/scss/app.scss'; 
import { configure } from '@storybook/react';
// automatically import all files ending in *.stories.tsx
configure(
  require.context('../src/components', true, /\.stories\.tsx?$/),
  module
);
