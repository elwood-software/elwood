import {useState, type FormEvent} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Form} from '@elwood/ui';

import {useCreateRun} from '@/data/run/use-create-run';

export default function RunNewRoute(): JSX.Element {
  const navigate = useNavigate();

  const [value, setValue] = useState({
    configuration: '',
    variables: '',
  });

  const action = useCreateRun();

  function onSubmit(e: FormEvent): void {
    e.preventDefault();

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
    <div className="p-12">
      <Form
        name="run-new"
        onSubmit={onSubmit}
        fields={[
          {
            name: 'configuration',
            label: 'Workflow',
            control: (
              <textarea
                value={value.configuration}
                onChange={e =>
                  setValue(v => ({...value, configuration: e.target.value}))
                }
              />
            ),
          },
          {
            name: 'variables',
            label: 'Variables',
            control: (
              <textarea
                value={value.variables}
                onChange={e =>
                  setValue(v => ({...value, variables: e.target.value}))
                }
              />
            ),
          },
        ]}>
        <Button type="submit">Start</Button>
      </Form>
    </div>
  );
}
