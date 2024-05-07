import type {PropsWithChildren, ReactNode} from 'react';
import {FileIcon, ListIcon, DropdownMenu} from '@elwood/ui';
import {type RendererHeader} from '@elwood/common';

export type NodeBlobProps = {
  sticky?: boolean;
  actions: ReactNode;
  size?: number | null;
  mimeType?: string | null;
  headers?: RendererHeader[];
};

export function NodeBlob(props: PropsWithChildren<NodeBlobProps>) {
  const {children, size, mimeType, actions, headers} = props;

  const headerItems = Array.from(headers ?? []).map(item => {
    return {
      id: item.slug,
      children: <a href={`#${item.slug}`}>{item.title}</a>,
    };
  });

  const icon =
    headerItems.length > 0 ? (
      <DropdownMenu items={headerItems}>
        <button className="cursor-pointer" type="button">
          <ListIcon className="size-3.5" />
        </button>
      </DropdownMenu>
    ) : (
      <FileIcon className="size-3.5 " />
    );

  const header = (
    <div className="border rounded-t-lg px-3 py-1 flex items-center justify-between bg-background">
      <div className="font-mono text-xs text-muted-foreground flex items-center">
        <span className="mr-2">{icon}</span>
        <span>
          {size} Bytes &middot; {mimeType}
        </span>
      </div>
      <div className="flex items-center justify-center space-x-2">
        {actions}
      </div>
    </div>
  );

  return (
    <>
      {props.sticky && (
        <div className="sticky top-0 bg-background z-40">{header}</div>
      )}
      {!props.sticky && header}
      <div className="overflow-y-auto border-l border-r border-b rounded-b-lg min-h-10">
        {children}
      </div>
    </>
  );
}
