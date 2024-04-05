import {useParams, Outlet, useNavigate} from 'react-router-dom';
import {toArray} from '@elwood/common';
import {
  ChevronDownIcon,
  DropdownMenu,
  type DropdownMenuItem,
  Icons,
} from '@elwood/ui';
import {BucketSidebar} from '@/components/sidebar/bucket';
import {useNodeTree} from '@/hooks/ui/use-node-tree';
import {Link, NodeLink, createNodeLink} from '@/components/link';
import {useGetNode} from '@/data/node/use-get-node';
import {MainLayout} from '@/components/layouts/main';
import {useSidebarFooter} from '@/hooks/ui/use-sidebar-footer';
import type {FilesRouteParams} from '../types';

export default function NodeLayout(): JSX.Element {
  const params = useParams<FilesRouteParams>();
  const navigate = useNavigate();

  const path = params['*'];
  const prefix = toArray(path?.split('/')).filter(Boolean);
  const tree = useNodeTree(prefix);
  const query = useGetNode({path: []});
  const sidebarFooter = useSidebarFooter();

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

  const title = (
    <DropdownMenu items={[...items, ...appendItems]}>
      <div className="flex items-center justify-between cursor-pointer">
        <strong>{prefix[0]}</strong>
        <ChevronDownIcon className="w-4 h-4" />
      </div>
    </DropdownMenu>
  );

  const sidebar = <BucketSidebar bucketName={prefix[0]}>{tree}</BucketSidebar>;
  const titleActions = (
    <Link href="/" className="border-l pl-2 ml-2 text-muted-foreground">
      <Icons.Home className="w-4 h-4" />
    </Link>
  );

  return (
    <MainLayout
      title={title}
      titleActions={titleActions}
      sidebar={sidebar}
      sidebarFooter={sidebarFooter}>
      <Outlet />
    </MainLayout>
  );
}
