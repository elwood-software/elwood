import {useState, type FormEvent} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Form} from '@elwood/ui';
import Editor from '@monaco-editor/react';
import {stringify} from 'yaml';

import {useCreateRun} from '@/data/run/use-create-run';

const defaultValue = stringify({
  $schema: 'https://x.elwood.run/workflow.json',
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
            content: '${{ `Hello, ${vars.name}` }',
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
    <>
      <div></div>
      <div className="p-12 w-full">
        <Form
          name="run-new"
          onSubmit={onSubmit}
          fields={[
            {
              name: 'configuration',
              label: 'Workflow',
              control: (
                <Editor
                  height="50vh"
                  width="100%"
                  defaultLanguage="yaml"
                  defaultValue={defaultValue}
                  theme="vs-dark"
                  onChange={nextValue =>
                    setValue(v => ({...value, configuration: nextValue ?? ''}))
                  }
                  options={{minimap: {enabled: false}}}
                />
              ),
            },
            {
              name: 'variables',
              label: 'Variables',
              control: (
                <Editor
                  height="50vh"
                  width="100%"
                  defaultLanguage="json"
                  defaultValue={value.variables}
                  theme="vs-dark"
                  onChange={nextValue =>
                    setValue(v => ({...value, variables: nextValue ?? ''}))
                  }
                  options={{minimap: {enabled: false}, lineNumbers: 'off'}}
                />
              ),
            },
          ]}>
          <Button type="submit">Start</Button>
        </Form>
      </div>
    </>
  );
}
