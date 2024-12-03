import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { Button } from "./button.js";

const meta: Meta<typeof Button> = {
  title: "Example/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
    size: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "Button",
    variant: "secondary",
    size: "default",
  },
};

export const Destructive: Story = {
  args: {
    children: "Button",
    variant: "destructive",
    size: "default",
  },
};

export const Ghost: Story = {
  args: {
    children: "Button",
    variant: "ghost",
    size: "default",
  },
};

export const Link: Story = {
  args: {
    children: "Button",
    variant: "link",
    size: "default",
  },
};

export const Outline: Story = {
  args: {
    children: "Button",
    variant: "outline",
    size: "default",
  },
};
