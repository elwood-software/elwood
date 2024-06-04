import type {PropsWithChildren, ReactNode} from 'react';
import {Spinner} from '@elwood/ui';

export interface MainLayoutProps {
  header?: ReactNode;
  loading?: boolean;
}

export function MainLayout(
  props: PropsWithChildren<MainLayoutProps>,
): JSX.Element {
  const {children} = props;

  return (
    <div className="w-full h-full grid grid-rows-[60px_auto] ">
      <div className="border-b h-full bg-background-inverse">
        {props.header}
      </div>
      <div className="flex flex-row min-h-0">
        {children ? (
          children
        ) : (
          <div className="flex items-center justify-center w-full">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}
