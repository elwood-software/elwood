import {useParams} from 'react-router-dom';
import {Icons, Button} from '@elwood/ui';
import {invariant, toArray} from '@elwood/common';
import {PageLayout} from '@/components/layouts/page';
import {FileBreadcrumbs} from '@/components/files/breadcrumbs';
import {useRenderedBlob} from '@/hooks/ui/use-rendered-blob';
import {useGetNode} from '@/data/node/use-get-node';
import {useShareButton} from '@/hooks/ui/use-share-button';
import type {FilesRouteParams} from '../types';

export default function FilesBlobRoute(): JSX.Element {
  const params = useParams<FilesRouteParams>();
  const path = params['*'];

  // this is mostly for type checking
  // the router should handle making sure we have
  // a bucket in the path
  invariant(path, 'Must provide a path');

  const prefix = toArray(path.split('/')).filter(Boolean);
  const [blob] = useRenderedBlob({prefix});
  const query = useGetNode({path: prefix});
  const node = query.data?.node;

  const shareButton = useShareButton({
    node: query.data?.node,
    variant: 'secondary',
    size: 'sm',
  });

  if (query.isLoading) {
    return <PageLayout />;
  }

  if (!node) {
    return <div>node not found</div>;
  }

  const headerLeft = <FileBreadcrumbs prefix={prefix} />;
  const headerRight = shareButton;

  //
  return (
    <PageLayout headerLeft={headerLeft} headerRight={headerRight}>
      <div className="border rounded-lg">
        <div className="border-b px-3 py-2 flex items-center justify-between">
          <div className="font-mono text-xs text-muted-foreground">
            {node.size} Bytes &middot; {node.mime_type}
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Button size="sm" type="button" variant="ghost" outline>
              <Icons.Download className="w-[1.5em] h-[1.5em]" />
            </Button>
          </div>
        </div>
        <div className="p-6">{blob}</div>
      </div>
    </PageLayout>
  );
}
