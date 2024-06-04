import type {PropsWithChildren, ReactNode} from 'react';

export interface PageLayoutProps {
  sidebar?: ReactNode;
  sidebarFooter?: ReactNode;
}

export function PageLayout(
  props: PropsWithChildren<PageLayoutProps>,
): JSX.Element {
  return (
    <>
      {props.sidebar && (
        <div className="bg-sidebar border-r w-[300px] flex-shrink-0 flex flex-col justify-between">
          <div className="flex-grow overflow-auto px-6">{props.sidebar}</div>
          {props.sidebarFooter ? (
            <footer className="flex flex-col">{props.sidebarFooter}</footer>
          ) : null}
        </div>
      )}
      {props.children}
    </>
  );
}
