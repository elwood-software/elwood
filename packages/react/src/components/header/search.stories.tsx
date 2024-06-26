import type {Meta, StoryObj} from '@storybook/react';

import {FolderIcon, FileIcon, Icons} from '@elwood/ui';

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
  args: {
    value: 'Test',
    results: [
      {
        title: 'Bucket 1',
        items: [
          {
            id: '1',
            icon: FileIcon,
            title: 'this is a file name',
          },
          {
            id: '2',
            icon: FolderIcon,
            title: 'this is a folder name',
          },
        ],
      },
      {
        title: ' Bucket 2',
        items: [
          {
            id: '1',
            icon: FileIcon,
            title: 'this is a file name',
          },
          {
            id: '2',
            icon: FolderIcon,
            title: 'this is a folder name',
          },
        ],
      },
    ],
  },
  render: args => (
    <div className="p-6">
      <div className="h-[60px] py-2 flex w-full">
        <Component {...args} />
      </div>
    </div>
  ),
};
