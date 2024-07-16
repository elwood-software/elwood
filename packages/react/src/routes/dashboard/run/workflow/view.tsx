import {useParams} from 'react-router-dom';

import {Spinner} from '@elwood/ui';

import {useGetRunWorkflow} from '@/data/run/use-get-workflow';
import {useGetRuns} from '@/data/run/use-get-runs';
import {RunWorkflowView} from '@/components/workflow/view';
import {toArray} from '@elwood/common';

export default function RunWorkflowViewRoute() {
  const params = useParams<{id: string}>();
  const query = useGetRunWorkflow({id: params.id!});
  const runsQuery = useGetRuns({workflow_id: params.id!});

  if (query.isLoading) {
    return (
      <div className="p-6">
        <Spinner />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return <div className="p-6">Workflow Not Found</div>;
  }

  return (
    <>
      <RunWorkflowView workflow={query.data} runs={toArray(runsQuery.data)} />
    </>
  );
}
