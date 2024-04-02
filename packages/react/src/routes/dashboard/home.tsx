import {toArray} from '@elwood/common';
import {Icons} from '@elwood/ui';
import {useGetNode} from '@/data/node/use-get-node';
import {NodeLink} from '@/components/link';
import {FilesTable} from '@/components/files/table';
import {MainLayout} from '@/components/layouts/main';
import {PageLayout} from '@/components/layouts/page';
import {useProviderContext} from '@/hooks/use-provider-context';

export default function FilesHome(): JSX.Element {
  const {workspaceName} = useProviderContext();
  const query = useGetNode({path: []});
  const buckets = toArray(query.data?.children);

  const treeQuery = useGetNode({
    path: [],
  });

  const tree = toArray(treeQuery.data?.children);

  const sidebar = (
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

  return (
    <MainLayout title={workspaceName} sidebar={sidebar}>
      <PageLayout>
        <div className="border rounded">
          <FilesTable nodes={tree} prefix={[]} />
        </div>
      </PageLayout>
    </MainLayout>
  );
}
