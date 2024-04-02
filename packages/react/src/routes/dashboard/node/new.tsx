import {useParams} from 'react-router-dom';
import {invariant, toArray} from '@elwood/common';
import {useState, type FormEvent} from 'react';
import {PageLayout} from '@/components/layouts/page';
import {Button} from '@/components/button';
import {FileBreadcrumbs} from '@/components/files/breadcrumbs';
import {useCreateNode} from '@/data/node/use-create-node';
import type {FilesRouteParams} from '../types';

export default function FilesNewRoute(): JSX.Element {
  const params = useParams<FilesRouteParams>();
  const [value, setValue] = useState('');

  const bucket = params.bucket;
  const path = params['*'];
  const prefix = [
    bucket,
    ...toArray(path?.split('/')).filter(Boolean),
  ] as string[];

  const action = useCreateNode();

  // this is mostly for type checking
  // the router should handle making sure we have
  // a bucket in the path
  invariant(bucket, 'Must provide a bucket');

  function onSubmit(e: FormEvent): void {
    e.preventDefault();

    action
      .mutateAsync({
        prefix,
        name: value,
        type: 'TREE',
      })
      .then(console.log)
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <PageLayout headerLeft={<FileBreadcrumbs prefix={prefix} />}>
      <div className="p-12">
        <form onSubmit={onSubmit}>
          <div>create a folder</div>
          <input
            className="text-black"
            onChange={e => {
              setValue(e.target.value);
            }}
            type="text"
            value={value}
          />
          <Button type="submit">Create</Button>
        </form>
      </div>
    </PageLayout>
  );
}
