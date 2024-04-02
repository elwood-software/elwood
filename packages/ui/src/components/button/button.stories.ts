import type {Meta, StoryObj} from '@storybook/react';
import {Button} from './button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    rounded: {
      control: 'radio',
      options: [true, false, 'full'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Button',
    type: 'button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
    type: 'button',
  },
};

export const Danger: Story = {
  args: {
    variant: 'destructive',
    children: 'Button',
    type: 'button',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    variant: 'default',
    children: 'Loading Button',
    type: 'button',
  },
};
