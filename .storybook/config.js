import '../src/assets/css/fonts.css'; 
import '../src/assets/css/app.css'; 
import { configure } from '@storybook/react';
// automatically import all files ending in *.stories.tsx
configure(
  require.context('../src/components', true, /\.stories\.tsx?$/),
  module
);
