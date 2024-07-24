import {useGetRun} from '@/data/run/use-get-run';
import {Spinner} from '@elwood/ui';
import {useParams, useSearchParams} from 'react-router-dom';

import {RunView, RunViewProps} from '@/components/run/view';
import {useGetRunWorkflow} from '@/data/run/use-get-workflow';

export default function RunViewRoute() {
  const [searchParams] = useSearchParams();
  const params = useParams<{id: string}>();
  const query = useGetRun({id: params.id!});
  const workflowQuery = useGetRunWorkflow(
    {
      id: query.data?.workflow_id ?? '',
    },
    {
      enabled: !!query.data?.workflow_id,
    },
  );

  if (query.isLoading || workflowQuery.isLoading) {
    return (
      <div className="p-6">
        <Spinner />
      </div>
    );
  }

  if (query.isError || !query.data || !workflowQuery.data) {
    return <div className="p-6">Run Not Found</div>;
  }

  return (
    <RunView
      className="m-6"
      run={query.data}
      workflow={workflowQuery.data}
      view={(searchParams.get('view') as RunViewProps['view']) ?? 'summary'}
    />
  );
}
