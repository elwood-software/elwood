import type {Preview} from '@storybook/react';
import {withThemeByClassName} from '@storybook/addon-themes';

import '../../ui/style.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    decorators: [
      withThemeByClassName({
        themes: {
          light: 'light',
          dark: 'dark',
        },
        defaultTheme: 'light',
      }),
    ],
  },
};

export default preview;
