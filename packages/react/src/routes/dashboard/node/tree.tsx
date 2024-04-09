import {useCallback, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import Dropzone from 'react-dropzone';
import {UploadCloudIcon} from '@elwood/ui';
import {toArray, noOp} from '@elwood/common';
import {FilesTable} from '@/components/files/table';
import {PageLayout} from '@/components/layouts/page';
import {FileBreadcrumbs} from '@/components/files/breadcrumbs';
import {useUploadButton} from '@/hooks/ui/use-upload-button';
import {useGetNode} from '@/data/node/use-get-node';
import {useProviderContext} from '@/hooks/use-provider-context';
import {useCreateFolderButton} from '@/hooks/ui/use-create-folder-button';
import {useBookmarkButton} from '@/hooks/ui/use-bookmark-button';
import type {FilesRouteParams} from '../types';

export default function FilesTreeRoute(): JSX.Element {
  const params = useParams<FilesRouteParams>();
  const {uploadManager} = useProviderContext();

  const path = params['*'];
  const prefix = useMemo(
    () => toArray(path?.split('/')).filter(Boolean),
    [path],
  );

  const onDrop = useCallback(
    (files: File[]) => {
      files.forEach(file => {
        uploadManager?.addFile({
          name: file.name,
          type: file.type,
          data: file,
          meta: {
            bucketName: prefix[0],
            objectName: [...prefix.slice(1), file.name].join('/'),
            contentType: file.type,
          },
          source: 'Local',
          isRemote: false,
        });
      });
      uploadManager?.upload().then(noOp).catch(noOp).finally(noOp);
    },
    [prefix, uploadManager],
  );

  const treeQuery = useGetNode({
    path: prefix,
  });

  const tree = toArray(treeQuery.data?.children);

  const createFolderButton = useCreateFolderButton({
    prefix,
    variant: 'outline',
    size: 'sm',
  });
  const uploadButton = useUploadButton({
    prefix,
    variant: 'outline',
    size: 'sm',
  });
  const bookmarkButton = useBookmarkButton({
    assetId: treeQuery.data?.node.id,
    assetType: 'NODE',
  });

  const headerLeft = <FileBreadcrumbs prefix={prefix} />;
  const headerRight = (
    <div className="flex items-center justify-center space-x-2">
      {createFolderButton}
      {uploadButton}
      {bookmarkButton}
    </div>
  );

  return (
    <Dropzone onDrop={onDrop} noClick>
      {({getRootProps, getInputProps, isDragActive}) => (
        <>
          <PageLayout
            headerLeft={headerLeft}
            headerRight={headerRight}
            mainProps={{...getRootProps(), style: {position: 'relative'}}}>
            <div className="border rounded">
              <FilesTable nodes={tree} prefix={prefix} />
            </div>

            {isDragActive ? (
              <div className="absolute top-0 left-0 right-0 bottom-0 backdrop-blur-xl flex items-center justify-center">
                <div className="border-4 border-dashed p-6 rounded-lg flex flex-col items-center justify-center shadow-2xl bg-background/50">
                  <UploadCloudIcon className="w-20 h-20" />
                  <p className="mt-3">Drop your files to upload!</p>
                </div>
              </div>
            ) : null}
          </PageLayout>
          <input {...getInputProps()} />
        </>
      )}
    </Dropzone>
  );
}
