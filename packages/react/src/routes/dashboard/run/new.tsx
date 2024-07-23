import {useEffect, useState, type FormEvent} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';

import {stringify} from 'yaml';

import {CreateRun} from '@/components/run/create';
import {useCreateRun} from '@/data/run/use-create-run';
import {useGetRunWorkflow} from '@/data/run/use-get-workflow';
import {useGetRunWorkflows} from '@/data/run/use-get-workflows';
import {toArray} from '@elwood/common';

const defaultValue = stringify({
  name: 'hello-world',
  defaults: {
    permissions: 'all',
  },
  jobs: {
    default: {
      steps: [
        {
          name: 'say-hello',
          when: 'true',
          action: 'echo',
          input: {
            content: '${{ `Hello, ${vars.name}` }}',
          },
        },
      ],
    },
  },
});

export default function RunNewRoute(): JSX.Element {
  const navigate = useNavigate();
  const [q] = useSearchParams();
  const workflowId = q.get('workflow');

  const workflowsQuery = useGetRunWorkflows();
  const workflowQuery = useGetRunWorkflow(
    {id: q.get('workflow')!},
    {
      enabled: q.has('workflow'),
    },
  );

  const [isReady, setIsReady] = useState(false);
  const [value, setValue] = useState({
    short_summary: '',
    configuration: defaultValue,
    variables: JSON.stringify(
      {
        name: 'Michael Scott',
      },
      null,
      2,
    ),
  });

  useEffect(() => {
    // if there's no workflow ID, we're ready to go
    if (!workflowId) {
      setIsReady(true);
      return;
    }

    // no data means wai
    if (!workflowQuery.data) {
      return;
    }

    setValue({
      configuration: stringify(workflowQuery.data?.configuration),
      variables: JSON.stringify({}),
      short_summary: '',
    });

    setIsReady(true);
  }, [workflowId, workflowQuery.data]);

  const action = useCreateRun();

  function onSubmit(): void {
    action
      .mutateAsync({
        workflow_id: workflowQuery.data?.id,
        configuration: value.configuration,
        variables: value.variables,
        short_summary: value.short_summary,
      })
      .then(data => {
        navigate(`/run/${data.id}`);
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <>
      <div></div>
      <div className="w-full">
        <CreateRun
          isReady={isReady}
          onSubmit={onSubmit}
          onChange={(field, fieldValue) => {
            setValue(() => ({...value, [field]: fieldValue}));
          }}
          values={value}
          selectedWorkflow={workflowQuery.data}
          workflows={toArray(workflowsQuery.data)}
        />
      </div>
    </>
  );
}
