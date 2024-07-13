import React from 'react';
import type {Preview} from '@storybook/react';
import {withThemeByClassName} from '@storybook/addon-themes';
import {HashRouter} from 'react-router-dom';
import {ElwoodThemeProvider} from '@elwood/ui';

import 'tailwindcss/tailwind.css';
import '@elwood/ui/dist/style.css';

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
      <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0">
        <HashRouter>
          <ElwoodThemeProvider>
            <Story />
          </ElwoodThemeProvider>
        </HashRouter>
      </div>
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
