import type {Meta, StoryObj} from '@storybook/react';

import {Button} from '@elwood/ui';

import {MainLayout as Component} from './main';

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => (
    <Component sidebar={<div>sidebar</div>}>
      <div>child</div>
    </Component>
  ),
};
