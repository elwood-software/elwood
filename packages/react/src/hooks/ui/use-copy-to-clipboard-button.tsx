import {MouseEvent, useState} from 'react';
import {useCopyToClipboard} from 'react-use';
import {
  Button,
  Tooltip,
  ClipboardCopyIcon,
  useSonner,
  type ButtonProps,
  type ButtonButtonProps,
} from '@elwood/ui';
import {useClient} from '@/hooks/use-client';
import {getNodePublicUrl} from '@/data/node/use-get-node-public-url';

type CopyState = 'copied' | 'error' | 'unknown';

export interface UseCopyToClipboardButtonInput
  extends Omit<ButtonProps, 'prefix' | 'href' | 'onClick' | 'type' | 'ref'> {
  label?: string;
  copy:
    | string
    | {
        type: 'node-blob';
        path: string[];
        mimeType?: string | null;
      }
    | {
        type: 'node-url';
        path: string[];
        mimeType?: string | null;
      };
}

export function useCopyToClipboardButton(
  input: UseCopyToClipboardButtonInput,
): JSX.Element {
  const {
    copy: value,
    label = 'Copy to Clipboard',
    children = <ClipboardCopyIcon className="w-[1em] h-[1em]" />,
    ...buttonProps
  } = input;

  const sonar = useSonner();
  const client = useClient();
  const [isLoading, setIsLoading] = useState(false);
  const [labelValue, setLabelValue] = useState(label);

  function updateCopyLabel(state: CopyState) {
    setLabelValue(state === 'copied' ? 'Copied!' : label);

    if (state === 'unknown') {
      sonar('Unable to copy to clipboard. Try again!', {type: 'warning'});
    }

    if (state === 'copied') {
      sonar('Copied to clipboard', {type: 'success'});
    }

    if (state === 'error') {
      sonar('Error copying to clipboard', {type: 'error'});
    }

    setTimeout(() => {
      setLabelValue(label);
    }, 2000);
  }

  async function copyToClipboard(text: string): Promise<CopyState> {
    try {
      await navigator.clipboard.writeText(text);
      return 'copied';
    } catch (error) {
      return 'error';
    }
  }

  async function onCopy(): Promise<void> {
    if (typeof value === 'string') {
      updateCopyLabel(await copyToClipboard(value));
      return;
    }

    setIsLoading(true);

    try {
      const {signedUrl} = await getNodePublicUrl(client, {
        path: value.path,
      });

      if (!signedUrl) {
        throw new Error('Could not get signed URL');
      }

      if (value.type === 'node-url') {
        updateCopyLabel(await copyToClipboard(signedUrl));
      }

      if (value.type === 'node-blob') {
        const response = await fetch(signedUrl);
        const blob = await response.text();
        updateCopyLabel(await copyToClipboard(blob));
      }
    } catch (error) {
      sonar('Error getting download link', {type: 'error'});
    } finally {
      setIsLoading(false);
    }
  }

  function onClick(e: MouseEvent<HTMLButtonElement>) {
    onCopy();
  }

  if (!canCopyToClipboard(value)) {
    return <></>;
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

export function canCopyToClipboard(
  value: UseCopyToClipboardButtonInput['copy'],
): boolean {
  if (typeof navigator.clipboard === 'undefined') {
    return false;
  }

  if (
    typeof value === 'string' ||
    (typeof value !== 'string' && value.type !== 'node-blob')
  ) {
    return true;
  }

  return !Boolean(
    value.mimeType?.startsWith('image/') ||
      value.mimeType?.startsWith('video/'),
  );
}
