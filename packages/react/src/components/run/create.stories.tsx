import type {Meta, StoryObj} from '@storybook/react';

import {CreateRun as Component} from './create';

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Main: Story = {
  args: {
    onSubmit: () => {},
    onChange: () => {},
    values: {
      configuration: 'poop',
      variables: JSON.stringify(
        {
          hello: 'world',
        },
        null,
        2,
      ),
    },
  },
  render: args => <Component {...args} />,
};
