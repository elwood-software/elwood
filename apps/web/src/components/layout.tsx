import type {PropsWithChildren} from 'react';
import Link from 'next/link';
import {Avatar, Logo} from '@elwood/ui';

export interface RootLayoutProps {
  orgs: {name: string; id: string; active: boolean}[];
}

export function RootLayout(
  props: PropsWithChildren<RootLayoutProps>,
): JSX.Element {
  return (
    <div className="flex flex-row w-screen h-screen">
      <div className="flex flex-col item-center justify-between py-4 px-3 bg-background border-r">
        <div className="flex flex-col items-center space-y-3 w-10">
          <div className="mb-3 h-8 flex justify-center items-center">
            <Logo className="h-8 fill-brand/80" />
          </div>
          {props.orgs.map(org => {
            return (
              <Link href={`/${org.id}`} key={`Dashboard-org-${org.id}`}>
                <Avatar
                  fallback={org.name}
                  variant="primary"
                  className="rounded-lg"
                />
              </Link>
            );
          })}
        </div>
      </div>
      {props.children}
    </div>
  );
}
