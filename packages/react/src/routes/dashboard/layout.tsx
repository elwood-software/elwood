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
import {useMemo} from 'react';

export default function Layout() {
  const {contextValue, workspaceName, title, search, assistant, userMenu} =
    useMainLayout();

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

                <Button href="/bookmarks" size="sm" variant="outline-muted">
                  <BookMarkedIcon className="size-4" />
                </Button>
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
