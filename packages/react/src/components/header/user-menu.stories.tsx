import type {Meta, StoryObj} from '@storybook/react';

import {HeaderUserMenu as Component} from './user-menu';

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {name: {control: 'text'}, items: {control: 'object'}},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Main: Story = {
  args: {
    name: 'Travis Kuhl',
    userName: 'travis',
    items: [
      {
        id: 'sa',
        children: `Some Action`,
      },
    ],
  },
  render: args => (
    <div className="p-6">
      <div className="h-[60px] relative">
        <Component {...args} />
      </div>
    </div>
  ),
};
