import type {Meta, StoryObj} from '@storybook/react';

import {RunList as Component} from './list';

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Main: Story = {
  args: {
    runs: [
      {
        num: 1,
        status: 'running',
        result: 'none',
      },
    ],
  },
  render: args => <Component {...args} />,
};
