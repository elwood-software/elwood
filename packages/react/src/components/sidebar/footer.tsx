import {type MouseEvent, type ReactNode} from 'react';
import {CircleUserRound, BellIcon, LogOutIcon, AlertDialog} from '@elwood/ui';
import {Button} from '@/components/button';

export interface SidebarFooterProps {
  userDisplayName: string;
  uploadStatus: ReactNode;
}

export function SidebarFooter(props: SidebarFooterProps): JSX.Element {
  function onLogoutClick(e: MouseEvent): void {
    e.preventDefault();
    window.location.href = '/auth/logout';
  }

  return (
    <footer>
      <div className="mb-3">{props.uploadStatus}</div>

      <div className="flex justify-between items-center">
        <div className="text-muted-foreground text-sm flex items-center">
          <CircleUserRound className="size-5 mr-1" />
          {props.userDisplayName}
        </div>
        <div className="flex items-center space-x-1">
          <Button href="/notifications" size="icon-sm" variant="ghost">
            <BellIcon className="size-4" />
          </Button>

          <AlertDialog
            onClick={onLogoutClick}
            title="Are you sure you want to logout"
            description="You will have to login again, and that might be annoying">
            <Button type="button" size="icon-sm" variant="ghost">
              <LogOutIcon className="size-4" />
            </Button>
          </AlertDialog>
        </div>
      </div>
    </footer>
  );
}
