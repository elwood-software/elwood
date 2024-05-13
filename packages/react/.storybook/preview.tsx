import React from 'react';
import type {Preview} from '@storybook/react';
import {withThemeByClassName} from '@storybook/addon-themes';

import {ElwoodThemeProvider} from '@elwood/ui';

import './style.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story: React.FC) => (
      <ElwoodThemeProvider>
        <div>a</div>
        <Story />
      </ElwoodThemeProvider>
    ),
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'dark',
    }),
  ],
};

export default preview;
