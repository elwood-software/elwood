import type { Meta, StoryObj } from "@storybook/react";

import { DashboardLayout } from "./dashboard.js";

type StoryMeta = Meta<typeof DashboardLayout>;
type Story = StoryObj<StoryMeta>;

const meta: StoryMeta = {
  title: "Layout/DashboardLayout",
  component: DashboardLayout,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies StoryMeta;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {},
};
