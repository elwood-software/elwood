import {
  BookMarkedIcon,
  Button,
  cn,
  type ButtonButtonProps,
  type ButtonProps,
} from '@elwood/ui';
import {toArray} from '@elwood/common';
import {type MouseEvent} from 'react';
import {useActivity} from '@/data/activity/use-activity';
import {useCreateActivity} from '@/data/activity/use-create-activity';

export interface UseBookmarkButtonInput
  extends Omit<ButtonProps, 'onClick' | 'type' | 'href'> {
  assetId: string | null | undefined;
  assetType: string;
}

export function useBookmarkButton(input: UseBookmarkButtonInput): JSX.Element {
  const {
    assetId,
    assetType,
    variant = 'outline',
    size = 'sm',
    ...buttonProps
  } = input;

  const action = useCreateActivity();
  const query = useActivity(
    {
      assetId: assetId ?? '',
      assetType,
      types: ['SAVE'],
    },
    {
      enabled: Boolean(assetId),
    },
  );

  const currentActivity = toArray(query.data);
  const isBookmarked =
    currentActivity.length > 0 && currentActivity[0].is_deleted === false;

  async function onClick(e: MouseEvent): Promise<void> {
    e.preventDefault();

    await action.mutateAsync({
      assetId: assetId ?? '',
      assetType,
      type: 'SAVE',
    });
  }

  const className = cn('size-4', {
    'stroke-primary': isBookmarked,
    'stroke-muted-foreground': !isBookmarked,
  });

  return (
    <Button
      loading={query.isLoading}
      variant={variant}
      size={size}
      {...(buttonProps as ButtonButtonProps)}
      type="button"
      onClick={onClick}>
      <BookMarkedIcon className={className} />
    </Button>
  );
}
