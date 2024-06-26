import {MouseEventHandler, useState} from 'react';

import {
  Avatar,
  DropdownMenu,
  DropdownMenuProps,
  LogOutIcon,
  SunMoonIcon,
  AlertDialog,
  UserIcon,
  Button,
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
          <Button type="button" size="sm" variant="outline-muted">
            <UserIcon className="w-4 h-4" />
          </Button>
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
