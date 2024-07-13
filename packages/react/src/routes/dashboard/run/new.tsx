import {useState, type FormEvent} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Form} from '@elwood/ui';
import Editor from '@monaco-editor/react';
import {stringify} from 'yaml';

import {CreateRun} from '@/components/run/create';
import {useCreateRun} from '@/data/run/use-create-run';

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

  const [value, setValue] = useState({
    configuration: defaultValue,
    variables: JSON.stringify(
      {
        name: 'Michael Scott',
      },
      null,
      2,
    ),
  });

  const action = useCreateRun();

  function onSubmit(): void {
    action
      .mutateAsync({
        configuration: value.configuration,
        variables: value.variables,
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
