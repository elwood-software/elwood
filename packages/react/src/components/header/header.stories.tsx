import type {Meta, StoryObj} from '@storybook/react';

import {Button} from '@elwood/ui';

import {Header as Component} from './header';
import {HeaderSearch} from './search';
import {HeaderUserMenu} from './user-menu';

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
export const Main: Story = {
  render: () => (
    <Component
      title="Poop"
      workspaceName="More Poop"
      actions={
        <>
          <Button size="sm" variant="outline-muted" href="/">
            Click me
          </Button>
          <HeaderUserMenu
            name="Travis Kuhl"
            userName="travis"
            items={[
              {
                id: 'sa',
                children: `Some Action`,
              },
            ]}
            theme="light"
            onThemeChange={(value: string) => {}}
            onLogoutClick={() => {}}></HeaderUserMenu>
        </>
      }
      search={
        <HeaderSearch value="" onChange={() => {}} results={[]} />
      }></Component>
  ),
};
