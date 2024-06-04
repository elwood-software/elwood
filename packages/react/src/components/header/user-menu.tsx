import {MouseEventHandler, useState} from 'react';

import {
  Avatar,
  DropdownMenu,
  DropdownMenuProps,
  LogOutIcon,
  SunMoonIcon,
  AlertDialog,
} from '@elwood/ui';

export type HeaderUserMenuProps = {
  name: string;
  userName: string;
  avatarUrl: string | null | undefined;
  items: DropdownMenuProps['items'];
  theme: string;
  onThemeChange: (value: string) => void;
  onLogoutClick: MouseEventHandler;
};

export function HeaderUserMenu(props: HeaderUserMenuProps) {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const otherActions = Array.from(props.items);

  const items = [
    {
      id: 'username',
      children: (
        <span className="flex flex-col">
          <span>
            Hi <strong>{props.name}</strong>
          </span>
          <span className="text-muted-foreground text-xs">
            @{props.userName}
          </span>
        </span>
      ),
    },
    otherActions.length > 0 && {
      id: 'separator-user',
      type: 'separator',
    },
    ...otherActions,
    {
      id: 'separator-before-mode',
      type: 'separator',
    },
    {
      id: 'mode',
      type: 'label',
      icon: SunMoonIcon,
      children: 'Theme',
    },
    {
      id: 'separator-mode',
      type: 'separator',
    },
    {
      id: 'mode',
      type: 'radio',
      value: props.theme,
      onValueChange: props.onThemeChange,
      items: [
        {
          value: 'light',
          children: 'Light',
        },
        {
          value: 'dark',
          children: 'Dark',
        },
        {
          value: 'system',
          children: 'System',
        },
      ],
    },
    {
      id: 'separator',
      type: 'separator',
    },
    {
      id: 'logout',
      children: 'Logout',
      icon: LogOutIcon,
      onSelect: () => {
        setIsLogoutOpen(true);
      },
    },
  ].filter(Boolean);

  return (
    <>
      <div className="relative flex">
        <DropdownMenu
          items={items as DropdownMenuProps['items']}
          contentClassName="mr-3">
          <div className="flex text-muted-foreground cursor-pointer">
            <Avatar
              src={
                props.avatarUrl ??
                'https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109?f=y&d=identicon'
              }
              fallback={props.name}
              round
              className="w-8 h-8"
            />
          </div>
        </DropdownMenu>
      </div>{' '}
      <AlertDialog
        open={isLogoutOpen}
        onOpenChange={setIsLogoutOpen}
        onClick={props.onLogoutClick}
        title="Are you sure you want to logout"
        description="You will have to login again, and that might be annoying"
      />
    </>
  );
}
