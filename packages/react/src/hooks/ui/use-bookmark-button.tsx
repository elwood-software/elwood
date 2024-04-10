import {
  BookMarkedIcon,
  BookCheckIcon,
  Button,
  cn,
  useSonner,
  type ButtonButtonProps,
  type ButtonProps,
} from '@elwood/ui';
import {useEffect, type MouseEvent} from 'react';
import {useBookmark} from '@/data/bookmarks/use-bookmark';
import {useUpsertBookmark} from '@/data/bookmarks/use-upsert-bookmark';

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

  const toast = useSonner();
  const action = useUpsertBookmark();
  const query = useBookmark(
    {
      assetId: assetId ?? '',
      assetType,
    },
    {
      enabled: Boolean(assetId),
    },
  );

  const isBookmarked = query.data?.is_active === true;

  console.log(query.data, isBookmarked);

  function onClick(e: MouseEvent): void {
    e.preventDefault();

    action.mutate({
      assetId: assetId ?? '',
      assetType,
    });
  }

  useEffect(() => {
    if (action.error?.message) {
      toast(action.error.message, {
        type: 'error',
      });
    }
  }, [action.error?.message, toast]);

  const Icon = isBookmarked ? BookCheckIcon : BookMarkedIcon;
  const className = cn('size-4', {
    'stroke-primary': isBookmarked,
    'stroke-muted-foreground': !isBookmarked,
  });

  return (
    <Button
      loading={query.isLoading || action.isPending}
      variant={variant}
      size={size}
      {...(buttonProps as ButtonButtonProps)}
      type="button"
      onClick={onClick}>
      <Icon className={className} />
    </Button>
  );
}
