import type {Meta, StoryObj} from '@storybook/react';

import {Tree} from './tree';

const meta: Meta<typeof Tree> = {
  component: Tree,
};

export default meta;
type Story = StoryObj<typeof Tree>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => (
    <div>
      poop
      <Tree tree={[]} rootNodeId={''} />
    </div>
  ),
};
