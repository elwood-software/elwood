import {useParams, Outlet, useNavigate} from 'react-router-dom';
import {toArray} from '@elwood/common';
import {ChevronDownIcon, DropdownMenu, type DropdownMenuItem} from '@elwood/ui';
import {BucketSidebar} from '@/components/sidebar/bucket';
import {useNodeTree} from '@/hooks/ui/use-node-tree';
import {Link, NodeLink, createNodeLink} from '@/components/link';
import {PageLayout} from '@/components/layouts/page';
import {useGetNode} from '@/data/node/use-get-node';
import {useSetMainLayoutTitle} from '@/hooks/ui/use-main-layout';

import type {FilesRouteParams} from '../types';
import {useMemo} from 'react';

export default function NodeLayout(): JSX.Element {
  const params = useParams<FilesRouteParams>();

  const path = params['*'];
  const prefix = toArray(path?.split('/')).filter(Boolean);
  const tree = useNodeTree(prefix);

  useSetMainLayoutTitle(<DropMenu title={prefix[0]} />, [prefix[0]]);

  const sidebar = <BucketSidebar bucketName={prefix[0]}>{tree}</BucketSidebar>;

  return (
    <PageLayout sidebar={sidebar}>
      <Outlet />
    </PageLayout>
  );
}

function DropMenu(props: {title: string}) {
  const navigate = useNavigate();
  const query = useGetNode({path: []});

  const items: DropdownMenuItem[] = toArray(query.data?.children).map(item => {
    return {
      id: item.id,
      children: <NodeLink node={item}>{item.name}</NodeLink>,
      onSelect(event) {
        event.preventDefault();
        navigate(createNodeLink(item));
      },
    };
  });

  const appendItems: DropdownMenuItem[] = [
    {
      id: 'home-sep',
      type: 'separator',
    },
    {
      id: 'home',
      children: <Link href="/">Home</Link>,
      onSelect(event) {
        event.preventDefault();
        navigate('/');
      },
    },
  ];

  return useMemo(
    () => (
      <DropdownMenu items={[...items, ...appendItems]}>
        <div className="flex items-center justify-between cursor-pointer">
          {props.title}
          <ChevronDownIcon className="size-4 ml-1 stroke-muted-foreground" />
        </div>
      </DropdownMenu>
    ),
    [items.map(item => item.id).join(''), props.title],
  );
}
