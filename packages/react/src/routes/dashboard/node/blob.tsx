import {useParams} from 'react-router-dom';
import {Icons, Button, LinkIcon, Tooltip} from '@elwood/ui';
import {invariant, toArray} from '@elwood/common';
import {useTitle} from 'react-use';
import {PageLayout} from '@/components/layouts/page';
import {FileBreadcrumbs} from '@/components/files/breadcrumbs';
import {useRenderedBlob} from '@/hooks/ui/use-rendered-blob';
import {useGetNode} from '@/data/node/use-get-node';
import {useChat} from '@/hooks/ui/use-chat';
import {useFollowButton} from '@/hooks/ui/use-follow-button';
import {NodeBlob} from '@/components/node/blob';
import {useCopyToClipboardButton} from '@/hooks/ui/use-copy-to-clipboard-button';
import {useDownloadButton} from '@/hooks/ui/use-download-button';
import type {FilesRouteParams} from '../types';

export default function FilesBlobRoute(): JSX.Element {
  const params = useParams<FilesRouteParams>();
  const path = params['*'];

  // this is mostly for type checking
  // the router should handle making sure we have
  // a bucket in the path
  invariant(path, 'Must provide a path');

  const prefix = toArray(path.split('/')).filter(Boolean);

  const [blob, blobData] = useRenderedBlob({prefix});
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

  // const subscribeButton = useFollowButton({
  //   type: 'SUBSCRIBE',
  //   assetId: node?.id,
  //   assetType: 'NODE',
  // });

  useTitle(`${node?.name ?? '...'} | ${prefix.join('/')} | Elwood`);

  const copyContentButton = useCopyToClipboardButton({
    label: 'Copy raw file to clipboard',
    size: 'icon-sm',
    variant: 'ghost',
    copy: {
      type: 'node-blob',
      path: prefix,
      mimeType: node?.mime_type,
    },
  });

  const copyUrlButton = useCopyToClipboardButton({
    children: <LinkIcon className="w-[1em] h-[1em]" />,
    label: 'Copy link to clipboard',
    size: 'icon-sm',
    variant: 'ghost',
    copy: {
      type: 'node-url',
      path: prefix,
      mimeType: node?.mime_type,
    },
  });

  const downloadButton = useDownloadButton({
    label: 'Download raw file',
    size: 'icon-sm',
    variant: 'ghost',
    path: prefix,
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
    </div>
  );
  const rail = <> {chat}</>;

  const actions = (
    <>
      {downloadButton}
      {copyContentButton}
      {copyUrlButton}
    </>
  );

  return (
    <PageLayout headerLeft={headerLeft} headerRight={headerRight} rail={rail}>
      <NodeBlob
        sticky
        headers={blobData?.params?.headings}
        size={Number(node.size)}
        mimeType={node.mime_type}
        actions={actions}>
        {blob}
      </NodeBlob>
    </PageLayout>
  );
}
