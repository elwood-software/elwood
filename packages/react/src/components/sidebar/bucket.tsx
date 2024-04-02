import type {PropsWithChildren} from 'react';
import type {NodeRecord} from '@elwood/common';
import {ArrowLeft} from '@elwood/ui';
import {Link} from '../link';

export interface BucketSidebarProps {
  bucketName: string | undefined;
}

export function BucketSidebar(
  props: PropsWithChildren<BucketSidebarProps>,
): JSX.Element {
  return (
    <div className="mt-6">
      <div className="">{props.children}</div>
    </div>
  );
}
