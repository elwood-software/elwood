import {FilesTable} from '@/components/files/table';
import {PageLayout} from '@/components/layouts/page';
import {useMainLayout} from '@/hooks/ui/use-main-layout';

export default function Notifications(): JSX.Element {
  const MainLayout = useMainLayout({showBucketsSidebar: true});

  return (
    <MainLayout>
      <PageLayout largeTitle="Notifications">
        <div />
      </PageLayout>
    </MainLayout>
  );
}
