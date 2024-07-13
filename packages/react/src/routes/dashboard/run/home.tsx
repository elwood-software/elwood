import {toArray} from '@elwood/common';

import {Button} from '@/components/button';
import {useGetRuns} from '@/data/run/use-get-runs';
import {useGetRunWorkflows} from '@/data/run/use-get-workflows';
import {RunList} from '@/components/run/list';

export default function RunHome() {
  const runsQuery = useGetRuns();
  const workflowsQuery = useGetRunWorkflows();

  return (
    <RunList
      runs={toArray(runsQuery.data)}
      workflows={toArray(workflowsQuery.data)}
    />
  );
}
