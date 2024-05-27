import type {MouseEventHandler, PropsWithChildren, ReactNode} from 'react';
import {Input, Spinner} from '@elwood/ui';
import {Link} from '../link';

import {HeaderSearch} from './search';

export interface HeaderProps {
  title?: ReactNode;
  workspaceName?: ReactNode;
  search?: ReactNode;
  actions?: ReactNode;
}

export function Header(props: HeaderProps): JSX.Element {
  return (
    <header className="grid grid-cols-[30%_auto_30%] h-full px-6 py-2">
      <div className="flex items-center text-sm">
        {props.title ? (
          props.workspaceName
        ) : (
          <span className="font-semibold">{props.workspaceName}</span>
        )}
        {props.title && (
          <>
            <span className="text-muted-foreground mx-2">/</span>
            <span className="font-semibold">{props.title}</span>
          </>
        )}
      </div>

      {props.search}

      <div className="flex justify-end items-center space-x-2">
        {props.actions}
      </div>
    </header>
  );
}
