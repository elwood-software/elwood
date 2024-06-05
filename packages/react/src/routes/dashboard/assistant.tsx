import {toArray} from '@elwood/common';
import {Icons} from '@elwood/ui';
import {useGetNode} from '@/data/node/use-get-node';
import {NodeLink, createNodeLink} from '@/components/link';
import {PageLayout} from '@/components/layouts/page';
import {ContentLayout} from '@/components/layouts/content';
import {useProviderContext} from '@/hooks/use-provider-context';
import {useSetMainLayoutTitle} from '@/hooks/ui/use-main-layout';
import {useAssistant} from '@/hooks/ui/use-assistant';

export default function Assistant(): JSX.Element {
  const {member} = useProviderContext();

  const assistant = useAssistant({});

  useSetMainLayoutTitle(null);

  const query = useGetNode({path: []});
  const buckets = toArray(query.data?.children);

  const treeQuery = useGetNode({
    path: [],
  });

  const tree = toArray(treeQuery.data?.children);

  const nodes = tree.map(node => ({
    ...node,
    href: createNodeLink(node),
  }));

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
    <PageLayout sidebar={sidebar}>
      <ContentLayout>
        <div className="border rounded size-full">{assistant}</div>
      </ContentLayout>
    </PageLayout>
  );
}
