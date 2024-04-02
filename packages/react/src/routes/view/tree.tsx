import {useCallback, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {invariant, toArray, noOp} from '@elwood/common';
import {FilesTable} from '@/components/files/table';
import {PageLayout} from '@/components/layouts/page';
import {useGetNode} from '@/data/node/use-get-node';

export default function ViewTreeRoute(): JSX.Element {
  const params = useParams();

  const bucket = params.bucket;
  const path = params['*'];
  const prefix = useMemo(
    () => [bucket, ...toArray(path?.split('/')).filter(Boolean)] as string[],
    [bucket, path],
  );

  const treeQuery = useGetNode({
    path: [],
  });

  const tree = toArray(treeQuery.data?.children);

  return (
    <PageLayout headerLeft={<div />} headerRight={<div />}>
      <div className="border rounded">
        <FilesTable nodes={tree} prefix={prefix} />
      </div>
    </PageLayout>
  );
}
