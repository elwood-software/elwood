import {useParams, useSearchParams} from 'react-router-dom';
import {invariant, toArray} from '@elwood/common';
import {PageLayout} from '@/components/layouts/page';
import {FileBreadcrumbs} from '@/components/files/breadcrumbs';
import {ShareContextProvider} from '@/hooks/share/use-share-context';
import {ShareTabs, type ShareTabsProps} from '@/components/share/tabs/tabs';
import {useGetNode} from '@/data/node/use-get-node';
import type {FilesRouteParams} from '../types';

export default function FilesNewRoute(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams<FilesRouteParams>();
  const selected = (searchParams.get('tab') ??
    'people') as ShareTabsProps['selected'];
  const bucket = params.bucket;
  const path = params['*'];
  const prefix = [
    bucket,
    ...toArray(path?.split('/')).filter(Boolean),
  ] as string[];

  // this is mostly for type checking
  // the router should handle making sure we have
  // a bucket in the path
  invariant(bucket, 'Must provide a bucket');

  function onChange(id: string): void {
    setSearchParams(current => {
      current.set('tab', id);
      return current;
    });
  }
  const node = useGetNode({path: prefix});

  return (
    <PageLayout headerLeft={<FileBreadcrumbs prefix={prefix} />}>
      <div className="my-12 mx-auto w-full max-w-[1200px]">
        <div className="mx-12 px-6 pb-6 border rounded bg-sidebar">
          {node.data ? (
            <ShareContextProvider node={node.data.node}>
              <ShareTabs selected={selected} onChange={onChange} />
            </ShareContextProvider>
          ) : null}
        </div>
      </div>
    </PageLayout>
  );
}
