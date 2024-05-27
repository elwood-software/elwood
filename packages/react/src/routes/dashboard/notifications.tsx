import {FilesTable} from '@/components/files/table';
import {PageLayout} from '@/components/layouts/page';
import {useMainLayout} from '@/hooks/ui/use-main-layout';

export default function Notifications(): JSX.Element {
  return useMainLayout({
    showBucketsSidebar: true,
    children: (
      <PageLayout largeTitle="Notifications">
        <div />
      </PageLayout>
    ),
  });
}
