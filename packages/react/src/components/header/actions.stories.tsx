import type {Meta, StoryObj} from '@storybook/react';

import {Button} from '@elwood/ui';

import {HeaderActions as Component} from './actions';

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Main: Story = {
  render: () => <Component />,
};
