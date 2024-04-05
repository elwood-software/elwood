import {type MouseEventHandler} from 'react';
import {ArrowUp, cn} from '@elwood/ui';
import {Button} from '@/components/button';

export interface UploadStatusProps {
  activeUploads: number;
  totalUploads: number;
  uploadProgress: number;
  activeUploadName?: string;
  onUploadsClick: MouseEventHandler;
}

export function UploadStatus(props: UploadStatusProps): JSX.Element {
  const {activeUploadName = '', activeUploads = 0, totalUploads = 0} = props;

  const active =
    activeUploads > 1
      ? `Uploading "${activeUploadName.slice(0, 20)}..." + ${String(activeUploads - 1)}`
      : `Uploading "${activeUploadName.slice(0, 20)}"`;

  const uploadClassName = cn(
    'w-full text-left',
    'transition-all scale-0 opacity-0',
    totalUploads > 0 && 'scale-100 opacity-100 hover:scale-105',
  );

  return (
    <>
      {totalUploads > 0 && (
        <Button
          type="button"
          variant="secondary"
          className={uploadClassName}
          onClick={props.onUploadsClick}>
          <span className="absolute -top-2 -left-2 flex border-4 border-background rounded-full z-10">
            <span className="flex h-5 w-5">
              {activeUploads > 0 && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-75" />
              )}

              <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-background text-foreground">
                <ArrowUp className="w-4 h-4" strokeWidth={3} />
              </span>
            </span>
          </span>
          {activeUploads > 0 && (
            <span
              className="z-0 absolute top-0 left-0 bg-background/5 h-full rounded-l-md"
              style={{width: `${String(props.uploadProgress)}%`}}
            />
          )}
          {activeUploads ? active : null}
          {activeUploads === 0 &&
            totalUploads > 0 &&
            `View ${String(totalUploads)} uploaded file${totalUploads === 1 ? '' : 's'}`}
        </Button>
      )}
    </>
  );
}
