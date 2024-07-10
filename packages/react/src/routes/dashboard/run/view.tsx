import {useGetRun} from '@/data/run/use-get-run';
import {Spinner} from '@elwood/ui';
import {useParams} from 'react-router-dom';

import {RunView, RunViewProps} from '@/components/run/view';

export default function RunViewRoute() {
  const params = useParams<{id: string}>();
  const query = useGetRun({id: params.id!});

  if (query.isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <RunView className="m-6" run={query.data as RunViewProps['run']} />
    </>
  );
}
