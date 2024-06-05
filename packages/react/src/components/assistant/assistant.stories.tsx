import type {Meta, StoryObj} from '@storybook/react';

import {Assistant as Component} from './assistant';

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Main: Story = {
  args: {
    messages: [
      {
        id: '1',
        text: 'this is a message',
        role: 'user',
        status: 'sent',
        avatarUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        id: '2',
        text: 'this is an answer',
        role: 'assistant',
        status: 'sent',
        avatarUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
  },
  render: args => (
    <div className="bg-black p-6 h-screen">
      <div className="bg-background w-[400px] h-full">
        <Component {...args} />
      </div>
    </div>
  ),
};
