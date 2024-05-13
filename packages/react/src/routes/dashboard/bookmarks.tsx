import {type NodeType, toArray} from '@elwood/common';
import {useTitle} from 'react-use';
import {PageLayout} from '@/components/layouts/page';
import {FilesTable} from '@/components/files/table';
import {useFollows} from '@/data/follow/use-follows';
import {useMainLayout} from '@/hooks/ui/use-main-layout';
import {createNodeLink} from '@/components/link';

export default function Bookmarks(): JSX.Element {
  useTitle('Bookmarks | Elwood');

  const MainLayout = useMainLayout({showBucketsSidebar: true});
  const query = useFollows({type: 'SAVE'});
  const items = toArray(query.data).map(item => {
    const parts = (item.object_name ?? '').split('/');
    const prefix = [
      item.bucket_name ?? '',
      ...parts.slice(0, parts.length - 1),
    ];
    const name = parts[parts.length - 1] ?? '';
    const type = (item.is_object_blob ? 'BLOB' : 'TREE') as NodeType;

    return {
      object_name: item.object_name,
      id: item.asset_id?.split(':')[4] ?? '',
      type,
      prefix,
      href: createNodeLink({
        type,
        prefix,
        name,
      }),
      name: (
        <span>
          <span className="inline-flex space-x-1 text-muted-foreground">
            {prefix.map(part => (
              <span key={`part-${part}`}>
                {part}
                <span className="ml-1">/</span>
              </span>
            ))}
          </span>
          <span className="ml-1 font-medium">{name}</span>
        </span>
      ),
    };
  });

  const nodes = items.map(node => ({
    ...node,
    href: createNodeLink({
      type: node.type,
      prefix: node.prefix,
      name: node.object_name,
    }),
  }));

  return (
    <MainLayout>
      <PageLayout largeTitle="Bookmarks">
        <div className="border rounded">
          <FilesTable nodes={nodes} />
        </div>
      </PageLayout>
    </MainLayout>
  );
}
