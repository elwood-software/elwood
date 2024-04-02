import type {Preview} from '@storybook/react';

import '../style.css';

document.body.classList.add('light');

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
