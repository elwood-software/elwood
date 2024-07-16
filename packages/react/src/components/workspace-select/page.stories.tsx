import type {Meta, StoryObj} from '@storybook/react';

import {WorkspaceSpaceSelectPage as Component} from './page';

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Main: Story = {
  args: {
    workspaces: [
      {id: '1', name: 'dunder-mifflin', displayName: 'Dunder Mifflin'},
      {id: '2', name: 'stark-industries', displayName: 'Stark Industries'},
      {id: '3', name: 'acme-corporation', displayName: 'Acme Corporation'},
    ],
  },
  render: args => <Component {...args} />,
};
