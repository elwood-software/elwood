import {useState, type FormEvent} from 'react';
import {useNavigate} from 'react-router-dom';
import {stringify as yaml} from 'yaml';

import {CreateWorkflow} from '@/components/workflow/create';
import {useCreateWorkflow} from '@/data/run/use-create-workflow';

export default function RunWorkflowNewRoute(): JSX.Element {
  const navigate = useNavigate();

  const [value, setValue] = useState({
    configuration: yaml({
      name: 'my-new-workflow',
      label: 'My New Workflow',
      description: 'A new workflow that does something awesome',
      jobs: {
        default: {
          steps: [
            {
              name: 'echo-name',
              action: 'echo',
              input: {
                content: '${{ `Hello, ${vars.name}` }}',
              },
            },
          ],
        },
      },
    }),
  });

  const action = useCreateWorkflow();

  function onSubmit(): void {
    action
      .mutateAsync(value)
      .then(data => {
        navigate(`/run/workflow/${data.id}`);
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <>
      <div className="w-full">
        <CreateWorkflow
          onSubmit={onSubmit}
          onChange={(field, fieldValue) => {
            setValue(() => ({...value, [field]: fieldValue}));
          }}
          values={value}
        />
      </div>
    </>
  );
}
