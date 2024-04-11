import {useEffect, type MouseEvent} from 'react';
import {useParams} from 'react-router-dom';
import {
  Icons,
  Button,
  ClipboardCopyIcon,
  LinkIcon,
  Tooltip,
  useSonner,
} from '@elwood/ui';
import {invariant, toArray} from '@elwood/common';
import {useCopyToClipboard} from 'react-use';
import {PageLayout} from '@/components/layouts/page';
import {FileBreadcrumbs} from '@/components/files/breadcrumbs';
import {useRenderedBlob} from '@/hooks/ui/use-rendered-blob';
import {useGetNode} from '@/data/node/use-get-node';
import {useChat} from '@/hooks/ui/use-chat';
import {useFollowButton} from '@/hooks/ui/use-follow-button';
import type {FilesRouteParams} from '../types';

export default function FilesBlobRoute(): JSX.Element {
  const params = useParams<FilesRouteParams>();
  const path = params['*'];
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const toast = useSonner();

  useEffect(() => {
    if (copyState.value) {
      toast('Copied to clipboard', {type: 'success'});
    }
  }, [copyState.value, toast]);

  useEffect(() => {
    if (copyState.error) {
      toast('Error copying to clipboard', {type: 'error'});
    }
  }, [copyState.error, toast]);

  // this is mostly for type checking
  // the router should handle making sure we have
  // a bucket in the path
  invariant(path, 'Must provide a path');

  const prefix = toArray(path.split('/')).filter(Boolean);

  const [blob] = useRenderedBlob({prefix});
  const query = useGetNode({path: prefix});
  const node = query.data?.node;
  const chat = useChat({
    assetId: node?.id ?? '',
    assetType: 'NODE',
  });
  const bookmarkButton = useFollowButton({
    type: 'SAVE',
    assetId: node?.id,
    assetType: 'NODE',
  });

  const subscribeButton = useFollowButton({
    type: 'SUBSCRIBE',
    assetId: node?.id,
    assetType: 'NODE',
  });

  if (query.isLoading) {
    return <PageLayout />;
  }

  if (!node) {
    return <div>node not found</div>;
  }

  const headerLeft = <FileBreadcrumbs prefix={prefix} />;
  const headerRight = (
    <div className="flex items-center justify-center space-x-2">
      {bookmarkButton}
      {subscribeButton}
    </div>
  );
  const rail = <> {chat}</>;

  function onCopyToClipboard(e: MouseEvent, type: 'content' | 'link'): void {
    e.preventDefault();
    copyToClipboard('pooper');
  }

  return (
    <PageLayout headerLeft={headerLeft} headerRight={headerRight} rail={rail}>
      <div className="border rounded-lg">
        <div className="border-b px-3 py-1 flex items-center justify-between">
          <div className="font-mono text-xs text-muted-foreground">
            {node.size} Bytes &middot; {node.mime_type}
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Tooltip label="Download content">
              <Button size="icon-sm" type="button" variant="ghost">
                <Icons.Download className="w-[1em] h-[1em]" />
              </Button>
            </Tooltip>
            <Tooltip label="Copy content to clipboard">
              <Button
                size="icon-sm"
                type="button"
                variant="ghost"
                onClick={e => {
                  onCopyToClipboard(e, 'content');
                }}>
                <ClipboardCopyIcon className="w-[1em] h-[1em]" />
              </Button>
            </Tooltip>
            <Tooltip label="Copy API Link to clipboard">
              <Button
                size="icon-sm"
                type="button"
                variant="ghost"
                onClick={e => {
                  onCopyToClipboard(e, 'link');
                }}>
                <LinkIcon className="w-[1em] h-[1em]" />
              </Button>
            </Tooltip>
          </div>
        </div>
        <div className="p-6">{blob}</div>
      </div>
    </PageLayout>
  );
}
