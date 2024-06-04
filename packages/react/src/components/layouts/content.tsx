import type {PropsWithChildren, ReactNode} from 'react';
import {Spinner, cn} from '@elwood/ui';

export interface ContentLayoutProps {
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  mainProps?: React.HTMLProps<HTMLDivElement>;
  mainClassName?: string;
  rail?: ReactNode;
  loading?: boolean;
  largeTitle?: ReactNode;
}

export function ContentLayout(
  props: PropsWithChildren<ContentLayoutProps>,
): JSX.Element {
  const showHeader = props.headerLeft ?? props.headerRight ?? props.largeTitle;
  const headerLeft = props.largeTitle ? (
    <h1 className="text-3xl font-extrabold">{props.largeTitle}</h1>
  ) : (
    props.headerLeft
  );

  const bodyClass = cn(
    'flex-grow flex-nowrap overflow-y-auto overflow-x-hidden min-h-0 pb-4',
    props.mainClassName,
  );

  return (
    <>
      <div className="flex flex-col min-h-0 h-full w-full">
        {showHeader ? (
          <header className="flex items-center justify-between px-8 pt-4">
            <div>{headerLeft}</div>
            <div>{props.headerRight}</div>
          </header>
        ) : null}
        <div className="flex-grow flex flex-row flex-nowrap min-h-0 px-8 pt-3">
          <div {...props.mainProps} className={bodyClass}>
            {props.children}
            {props.loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Spinner />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {props.rail ? (
        <div className="ml-0 w-1/4 min-w-[300px] flex flex-col border rounded m-4">
          {props.rail}
        </div>
      ) : null}
    </>
  );
}
