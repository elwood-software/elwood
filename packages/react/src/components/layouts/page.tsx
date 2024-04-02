import type {PropsWithChildren, ReactNode} from 'react';

export interface PageLayoutProps {
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  mainProps?: React.HTMLProps<HTMLDivElement>;
}

export function PageLayout(
  props: PropsWithChildren<PageLayoutProps>,
): JSX.Element {
  return (
    <div className="flex flex-col min-h-0 h-screen w-full">
      {props.headerLeft ?? props.headerRight ? (
        <header className="flex items-center justify-between px-8 pt-3">
          <div>{props.headerLeft}</div>
          <div>{props.headerRight}</div>
        </header>
      ) : null}
      <div className="flex-grow flex flex-row flex-nowrap min-h-0">
        <div
          {...props.mainProps}
          className="flex-grow flex-nowrap overflow-y-auto overflow-x-hidden min-h-0 mt-3 px-8">
          {props.children}
        </div>
      </div>
    </div>
  );
}
