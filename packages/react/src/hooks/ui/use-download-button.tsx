import {MouseEvent, useState} from 'react';
import {useCopyToClipboard} from 'react-use';
import {
  Button,
  Tooltip,
  Icons,
  useSonner,
  type ButtonProps,
  type ButtonButtonProps,
} from '@elwood/ui';
import {useClient} from '@/hooks/use-client';
import {getNodePublicUrl} from '@/data/node/use-get-node-public-url';

export interface UseDownloadButtonInput
  extends Omit<ButtonProps, 'prefix' | 'href' | 'onClick' | 'type' | 'ref'> {
  label?: string;
  path: string[];
}

export function useDownloadButton(input: UseDownloadButtonInput): JSX.Element {
  const {
    path,
    label = 'Download File',
    children = <Icons.Download className="w-[1em] h-[1em]" />,
    ...buttonProps
  } = input;

  const sonar = useSonner();
  const client = useClient();
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const [isLoading, setIsLoading] = useState(false);
  const [labelValue, setLabelValue] = useState(label);

  async function onClick(e: MouseEvent): Promise<void> {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {signedUrl} = await getNodePublicUrl(client, {
        path,
        download: true,
      });

      if (!signedUrl) {
        throw new Error('Could not get signed URL');
      }

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = signedUrl;
      a.download = path[path.length - 1];
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      sonar('Download started', {type: 'success'});
    } catch (error) {
      sonar('Error getting download link', {type: 'error'});
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Tooltip label={labelValue}>
      <Button
        {...(buttonProps as ButtonButtonProps)}
        size="icon-sm"
        type="button"
        variant="ghost"
        loading={isLoading}
        onClick={onClick}>
        {children}
      </Button>
    </Tooltip>
  );
}
