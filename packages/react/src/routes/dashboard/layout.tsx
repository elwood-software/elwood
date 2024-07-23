import {useMemo} from 'react';
import {Outlet} from 'react-router-dom';
import {
  Button,
  BookMarkedIcon,
  SparklesIcon,
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@elwood/ui';

import {MainLayout} from '@/components/layouts/main';
import {Link} from '@/components/link';
import {Header} from '@/components/header/header';
import {useMainLayout, MainLayoutProvider} from '@/hooks/ui/use-main-layout';
import {useFeatureFlag} from '@/hooks/use-provider-context';

export default function Layout() {
  const flags = useFeatureFlag();
  const {contextValue, workspaceName, title, search, assistant, userMenu} =
    useMainLayout();

  console.log('xx workspaceName', workspaceName);

  const layout = useMemo(() => {
    return (
      <MainLayout
        header={
          <Header
            workspaceName={<Link href="/">{workspaceName}</Link>}
            title={title}
            search={search}
            actions={
              <>
                {flags.enable_assistant && (
                  <Drawer direction="right" shouldScaleBackground={false}>
                    <DrawerTrigger asChild={true}>
                      <Button type="button" size="sm" variant="outline-muted">
                        <SparklesIcon className="size-4" />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="border-l p-4">
                      {assistant}
                    </DrawerContent>
                  </Drawer>
                )}

                {flags.enable_bookmarks && (
                  <Button href="/bookmarks" size="sm" variant="outline-muted">
                    <BookMarkedIcon className="size-4" />
                  </Button>
                )}

                {userMenu}
              </>
            }
          />
        }>
        <Outlet />
      </MainLayout>
    );
  }, [workspaceName, title, search, assistant, userMenu]);

  return <MainLayoutProvider value={contextValue}>{layout}</MainLayoutProvider>;
}
