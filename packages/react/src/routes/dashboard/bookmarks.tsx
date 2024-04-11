import {toArray} from '@elwood/common';
import {PageLayout} from '@/components/layouts/page';
import {useFollows} from '@/data/follow/use-follows';
import {useMainLayout} from '@/hooks/ui/use-main-layout';

export default function Bookmarks(): JSX.Element {
  const MainLayout = useMainLayout({showBucketsSidebar: true});
  const query = useFollows({type: 'SAVE'});
  const items = toArray(query.data);

  return (
    <MainLayout>
      <PageLayout largeTitle="Bookmarks">
        <div className="border rounded">
          <div>
            {items.map(item => {
              return (
                <div key={item.id}>
                  {item.asset_id}/{item.asset_type}
                </div>
              );
            })}
          </div>
        </div>
      </PageLayout>
    </MainLayout>
  );
}
