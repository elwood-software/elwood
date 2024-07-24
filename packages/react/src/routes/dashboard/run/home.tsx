import {toArray} from '@elwood/common';

import {Button} from '@/components/button';
import {useGetRuns} from '@/data/run/use-get-runs';
import {useGetRunWorkflows} from '@/data/run/use-get-workflows';
import {RunList} from '@/components/run/list';
import {useSearchParams} from 'react-router-dom';

export default function RunHome() {
  const [searchParams] = useSearchParams();
  const filters = {
    workflow_id: searchParams.get('workflow'),
    trigger: searchParams.get('trigger'),
  };

  const runsQuery = useGetRuns({
    ...filters,
  });
  const workflowsQuery = useGetRunWorkflows();

  return (
    <RunList
      runs={toArray(runsQuery.data)}
      workflows={toArray(workflowsQuery.data)}
      filters={filters}
    />
  );
}
