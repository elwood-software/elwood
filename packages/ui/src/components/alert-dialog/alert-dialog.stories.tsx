import type {Meta, StoryObj} from '@storybook/react';
import {AlertDialog} from './alert-dialog';

const meta = {
  title: 'Alert Dialog',
  component: AlertDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: {action: 'clicked'},
  },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    defaultOpen: true,
    title: 'Are you sure?',
    description: 'This action cannot be undone.',
    onClick: () => {},
  },
};
