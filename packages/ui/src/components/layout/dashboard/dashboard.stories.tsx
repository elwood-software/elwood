import type { Meta, StoryObj } from "@storybook/react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "#/components/ui/breadcrumb.js";

import { DashboardLayout } from "./dashboard.js";

import { DashboardLayoutSidebar } from "./sidebar.js";

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
  args: {
    sidebar: <DashboardLayoutSidebar nav={[]}>poop</DashboardLayoutSidebar>,
    children: (
      <div className="flex items-center justify-center h-full">
        <div className="p-8 bg-red-200 rounded-2xl">This is awesome!</div>
      </div>
    ),
    header: (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Inbox</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
  },
};
