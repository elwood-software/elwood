import {toArray} from '@elwood/common';
import {ChevronRightIcon, Logo, Spinner} from '@elwood/ui';
import {Link} from '../link';
import {MouseEventHandler} from 'react';

export type WorkspaceSpaceSelectPageProps = {
  loading: boolean;
  onClick: MouseEventHandler<HTMLAnchorElement>;
  workspaces: Array<{
    id: string;
    name: string;
    displayName: string;
  }>;
};

export function WorkspaceSpaceSelectPage(props: WorkspaceSpaceSelectPageProps) {
  return (
    <div className="size-full flex items-center justify-center flex-col">
      <Logo className="size-12 fill-current" />

      <div className="border rounded mt-12 divide-y w-full max-w-lg">
        {props.loading && (
          <div className="flex items-center justify-center p-6">
            <Spinner />
          </div>
        )}

        {toArray(props.workspaces).map(item => {
          return (
            <div key={`Workspace-${item.id}-${item.name}`}>
              <a
                className="py-3 px-6 flex items-center justify-between"
                href={`/${item.name}`}
                onClick={props.onClick}>
                {item.displayName}
                <ChevronRightIcon className="size-6 text-muted-foreground" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
