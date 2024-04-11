import {type PropsWithChildren} from 'react';
import {toArray} from '@elwood/common';
import {Icons} from '@elwood/ui';
import {useProviderContext} from '@/hooks/use-provider-context';
import {MainLayout, type MainLayoutProps} from '@/components/layouts/main';
import {useGetNode} from '@/data/node/use-get-node';
import {Link, NodeLink} from '@/components/link';
import {useSidebarFooter} from './use-sidebar-footer';

export type UseMainLayoutChildProps = Omit<MainLayoutProps, 'sidebarFooter'>;

export interface UseMainLayoutInput {
  showBucketsSidebar?: boolean;
}

export function useMainLayout(
  input: UseMainLayoutInput = {},
): (props: PropsWithChildren<UseMainLayoutChildProps>) => JSX.Element {
  const {workspaceName} = useProviderContext();
  const sidebarFooter = useSidebarFooter();

  const query = useGetNode(
    {path: []},
    {
      enabled: input.showBucketsSidebar,
    },
  );
  const buckets = toArray(query.data?.children);
  const bucketsSidebar = (
    <ul className="space-y-3 mt-6">
      {buckets.map(item => {
        return (
          <li key={`FilesHome-${item.id}`}>
            <NodeLink node={item} className="flex items-center">
              <Icons.Bucket className="w-4 h-4 mr-2 text-muted-foreground" />
              {item.name}
            </NodeLink>
          </li>
        );
      })}
    </ul>
  );

  return function Layout(props: UseMainLayoutChildProps): JSX.Element {
    return (
      <MainLayout
        title={<Link href="/">{workspaceName}</Link>}
        sidebarFooter={sidebarFooter}
        sidebar={bucketsSidebar}
        {...props}
      />
    );
  };
}
