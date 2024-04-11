import {type ReactNode} from 'react';
import {BellIcon, BookMarkedIcon, UploadCloudIcon} from '@elwood/ui';
import {Button} from '@/components/button';

export interface SidebarFooterProps {
  userMenu: ReactNode;
  uploadStatus: ReactNode;
}

export function SidebarFooter(props: SidebarFooterProps): JSX.Element {
  return (
    <footer>
      <div className="mb-3">{props.uploadStatus}</div>

      <div className="flex justify-between items-center">
        {props.userMenu}
        <div className="flex items-center space-x-1">
          <Button href="/bookmarks" size="icon-sm" variant="ghost">
            <BookMarkedIcon className="size-4" />
          </Button>

          <Button href="/notifications" size="icon-sm" variant="ghost">
            <BellIcon className="size-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
