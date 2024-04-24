import {toArray} from '@elwood/common';
import {Icons} from '@elwood/ui';
import {useGetNode} from '@/data/node/use-get-node';
import {NodeLink} from '@/components/link';
import {FilesTable} from '@/components/files/table';
import {PageLayout} from '@/components/layouts/page';
import {useMainLayout} from '@/hooks/ui/use-main-layout';
import {useChat} from '@/hooks/ui/use-chat';
import {useProviderContext} from '@/hooks/use-provider-context';

export default function FilesHome(): JSX.Element {
  const {member} = useProviderContext();
  const MainLayout = useMainLayout();
  const chat = useChat({
    assetId: 'root',
    assetType: 'PAGE',
  });

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
    <MainLayout sidebar={sidebar}>
      <PageLayout largeTitle={`Hello, ${member.display_name ?? ''}`}>
        <div className="py-6">
          <div>
            <div className="border rounded">
              <FilesTable nodes={tree} prefix={[]} />
            </div>
          </div>
        </div>
      </PageLayout>
    </MainLayout>
  );
}
