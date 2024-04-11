import {
  BookMarkedIcon,
  BookCheckIcon,
  BellIcon,
  BellRingIcon,
  Button,
  cn,
  useSonner,
  type ButtonButtonProps,
  type ButtonProps,
} from '@elwood/ui';
import {useEffect, type MouseEvent} from 'react';
import {type FollowType} from '@elwood/common';
import {useFollow} from '@/data/follow/use-follow';
import {useUpsertFollow} from '@/data/follow/use-upsert-follow';

export interface UseFollowButtonInput
  extends Omit<ButtonProps, 'onClick' | 'type' | 'href'> {
  type: FollowType;
  assetId: string | null | undefined;
  assetType: string;
}

export function useFollowButton(input: UseFollowButtonInput): JSX.Element {
  const {
    assetId,
    assetType,
    variant = 'outline',
    size = 'sm',
    type,
    ...buttonProps
  } = input;

  const toast = useSonner();
  const action = useUpsertFollow();
  const query = useFollow(
    {
      type,
      assetId: assetId ?? '',
      assetType,
    },
    {
      enabled: Boolean(assetId),
    },
  );

  const isActive = query.data?.is_active === true;

  function onClick(e: MouseEvent): void {
    e.preventDefault();

    action.mutate({
      type,
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

  const SaveIcon = isActive ? BookCheckIcon : BookMarkedIcon;
  const SubscribeIcon = isActive ? BellRingIcon : BellIcon;
  const Icon = type === 'SAVE' ? SaveIcon : SubscribeIcon;
  const className = cn('size-4', {
    'stroke-primary': isActive,
    'stroke-muted-foreground': !isActive,
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
