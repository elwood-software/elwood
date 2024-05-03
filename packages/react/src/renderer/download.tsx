'use client';

import {useState, useEffect} from 'react';

import type {RendererProps} from '@elwood/common';
import {Button} from '@elwood/ui';
import {useGetNodePublicUrl} from '@/data/node/use-get-node-public-url';

export default function RenderDownload(props: RendererProps<{}>): JSX.Element {
  const {data, isLoading} = useGetNodePublicUrl({
    path: props.path.split('/'),
  });

  console.log(data);

  return (
    <div className="flex items-center justify-center py-10">
      <Button
        href={data?.signedUrl ?? ''}
        variant="outline"
        loading={isLoading}>
        Download Raw Content
      </Button>
    </div>
  );
}
