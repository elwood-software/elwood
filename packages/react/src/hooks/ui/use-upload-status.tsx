import {useEffect, useState} from 'react';
import type {UppyFile} from '@uppy/core';
import {Progress} from '@elwood/ui';
import {useProviderContext} from '../use-provider-context';

export function UseUploadStatus(): JSX.Element {
  const {uploadManager} = useProviderContext();
  const [files, setFiles] = useState<UppyFile[]>(
    uploadManager?.getFiles() ?? [],
  );

  useEffect(() => {
    if (!uploadManager) {
      return;
    }

    function onFilesChange(): void {
      setFiles(() => {
        return uploadManager?.getFiles() ?? [];
      });
    }

    uploadManager.on('file-added', onFilesChange);
    uploadManager.on('file-removed', onFilesChange);
    uploadManager.on('progress', onFilesChange);

    return function unload() {
      uploadManager.off('file-added', onFilesChange);
      uploadManager.off('file-removed', onFilesChange);
      uploadManager.off('progress', onFilesChange);
    };
  }, [uploadManager]);

  const activeUploads = files.filter(
    file => file.progress?.uploadStarted && !file.progress.uploadComplete,
  );
  const completeUploads = files.filter(file => file.progress?.uploadComplete);
  const activeUploadSize = activeUploads.reduce((acc, file) => {
    return acc + (file.progress?.bytesTotal ?? 0);
  }, 0);
  const activeUploadProgress = activeUploads.reduce((acc, file) => {
    return acc + (file.progress?.bytesUploaded ?? 0);
  }, 0);

  if (activeUploads.length === 0 && completeUploads.length === 0) {
    return <span />;
  }

  const value = (activeUploadProgress / activeUploadSize) * 100;

  return (
    <div className=" border-b border-outline mb-3">
      <div className="text-center text-muted text-sm pb-2">
        Active: {activeUploads.length} / Complete: {completeUploads.length}
      </div>
      <div className="h-px w-full">
        {activeUploads.length > 0 && (
          <Progress className="w-full h-px" value={value} />
        )}
      </div>
    </div>
  );
}
