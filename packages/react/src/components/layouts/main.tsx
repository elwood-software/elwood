import type {PropsWithChildren, ReactNode} from 'react';
import {Spinner} from '@elwood/ui';

export interface MainLayoutProps {
  title?: ReactNode;
  titleActions?: ReactNode;
  sidebar?: ReactNode;
  sidebarFooter?: ReactNode;
  loading?: boolean;
}

export function MainLayout(
  props: PropsWithChildren<MainLayoutProps>,
): JSX.Element {
  const {children} = props;

  return (
    <>
      <div className="bg-sidebar border-r w-[300px] flex-shrink-0 flex flex-col justify-between">
        <header className="flex items-center justify-between text-lg border-b px-6 py-4">
          <div className="flex-grow font-bold">{props.title}</div>
          {props.titleActions}
        </header>
        <div className="flex-grow overflow-auto px-6">{props.sidebar}</div>
        {props.sidebarFooter ? (
          <footer className="flex flex-col">{props.sidebarFooter}</footer>
        ) : null}
      </div>

      {children ? (
        children
      ) : (
        <div className="flex items-center justify-center w-full">
          <Spinner />
        </div>
      )}
    </>
  );
}
