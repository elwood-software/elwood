import {useEffect, useState, type MouseEvent} from 'react';
import {
  useSonner,
  useTheme,
  Dialog,
  DropdownMenu,
  Button,
  CircleUserRound,
  LogOutIcon,
  AlertDialog,
  SunMoonIcon,
  type DropdownMenuItem,
} from '@elwood/ui';
import {SidebarFooter} from '@/components/sidebar/footer';
import {UploadStatus} from '@/components/upload/status';
import {UploadModal} from '@/components/upload/modal';
import {useProviderContext} from '../use-provider-context';

interface UploadState {
  activeUploads: number;
  totalUploads: number;
  uploadProgress: number;
  activeUploadName: string;
  files: {
    prefix: string[];
    name: string;
    size: number;
    type: string;
    error?: string;
  }[];
}

export function useSidebarFooter(): JSX.Element {
  const {uploadManager} = useProviderContext();
  const toast = useSonner();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const theme = useTheme();

  const [uploadIds, setUploadIds] = useState<string[]>([]);
  const [uploadErrorIds, setUploadErrorIds] = useState<string[]>([]);
  const [uploadState, setUploadState] = useState<UploadState>({
    activeUploads: 0,
    totalUploads: 0,
    uploadProgress: 0,
    activeUploadName: '',
    files: [],
  });

  useEffect(() => {
    if (uploadManager) {
      const files = uploadManager.getFiles();
      const active = files.filter(
        file =>
          !uploadErrorIds.includes(file.id) &&
          (file.progress?.bytesUploaded ?? 0) > 0 &&
          !file.progress?.uploadComplete &&
          file.isPaused !== true,
      );
      const uploadPercent = files.reduce((acc, item) => {
        return acc + (item.progress?.percentage ?? 0);
      }, 0);

      setUploadState(() => ({
        activeUploads: active.length,
        totalUploads: files.length,
        activeUploadName: active.length ? active[0].name : '',
        uploadProgress:
          uploadPercent > 9
            ? Math.round((uploadPercent / files.length) * 100)
            : 0,
        files: files.map(item => {
          const nameParts = String(item.meta.objectName).split('/');
          const prefix: string[] = [
            String(item.meta.bucketName),
            ...nameParts.slice(0, nameParts.length - 1),
          ];

          return {
            prefix,
            name: item.name,
            size: item.data.size,
            type: item.data.type,
          };
        }),
      }));
    }
  }, [uploadErrorIds, uploadIds, uploadManager]);

  useEffect(() => {
    function onChange(): void {
      if (uploadManager) {
        setUploadIds(uploadManager.getFiles().map(file => file.id));
      }
    }

    function onError(file: unknown, error: Error): void {
      const id = (file as {id: string}).id;

      if (!uploadErrorIds.includes(id)) {
        toast(`Upload error: ${error.message}`, {
          type: 'error',
          duration: 5000,
        });
      }

      setUploadErrorIds(prev => [...prev, id]);
    }

    if (uploadManager) {
      uploadManager.on('file-added', onChange);
      uploadManager.on('progress', onChange);
      uploadManager.on('preprocess-complete', onChange);
      uploadManager.on('upload-error', onError);

      return function unload() {
        uploadManager.off('file-added', onChange);
        uploadManager.off('progress', onChange);
        uploadManager.off('preprocess-complete', onChange);
        uploadManager.off('upload-error', onError);
      };
    }
  }, [uploadManager, toast, uploadErrorIds]);

  function onLogoutClick(e: MouseEvent): void {
    e.preventDefault();
    window.location.href = '/auth/logout';
  }

  const userMenuItems: DropdownMenuItem[] = [
    {
      id: 'mode',
      type: 'label',
      icon: SunMoonIcon,
      children: 'Theme',
    },
    {
      id: 'separator-mode',
      type: 'separator',
    },
    {
      id: 'mode',
      type: 'radio',
      value: theme.value,
      onValueChange(nextValue) {
        theme.change(nextValue as 'light' | 'dark' | 'system');
      },
      items: [
        {
          value: 'light',
          children: 'Light',
        },
        {
          value: 'dark',
          children: 'Dark',
        },
        {
          value: 'system',
          children: 'System',
        },
      ],
    },
    {
      id: 'separator',
      type: 'separator',
    },
    {
      id: 'logout',
      children: 'Logout',
      icon: LogOutIcon,
      onSelect: () => {
        setIsLogoutOpen(true);
      },
    },
  ];

  const userMenu = (
    <DropdownMenu items={userMenuItems} contentClassName="ml-3">
      <Button
        type="button"
        variant="ghost"
        icon={<CircleUserRound className="size-5" />}
        className="text-muted-foreground">
        hihi
      </Button>
    </DropdownMenu>
  );

  return (
    <>
      <SidebarFooter
        userMenu={userMenu}
        uploadStatus={
          <Dialog
            className="max-w-[50vw]"
            title="Uploads"
            description={`You've uploaded ${String(uploadState.totalUploads)} files. Awesome!`}
            content={<UploadModal files={uploadState.files} />}>
            {({open}) => (
              <UploadStatus onUploadsClick={open} {...uploadState} />
            )}
          </Dialog>
        }
      />
      <AlertDialog
        open={isLogoutOpen}
        onOpenChange={setIsLogoutOpen}
        onClick={onLogoutClick}
        title="Are you sure you want to logout"
        description="You will have to login again, and that might be annoying"
      />
    </>
  );
}
