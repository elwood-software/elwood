import type {Meta, StoryObj} from '@storybook/react';

import {Button} from '@elwood/ui';

import {HeaderSearch as Component} from './search';

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    loading: {
      control: 'boolean',
    },
    results: {
      control: 'object',
    },
    value: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Main: Story = {
  render: args => (
    <div className="p-6">
      <div className="h-[60px] py-2 flex w-full">
        <Component
          {...args}
          results={[
            {
              title: 'Files',
              items: [],
            },
            {
              title: 'Folders',
              items: [],
            },
          ]}
        />
      </div>
    </div>
  ),
};
