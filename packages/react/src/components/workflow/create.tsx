import type {MouseEventHandler} from 'react';
import {useMeasure} from 'react-use';

import {Form, Input, Textarea} from '@elwood/ui';

import {Button} from '@/components/button';
import {YamlEditor} from '@/components/yaml-editor/yaml-editor';

export type CreateWorkflowProps = {
  onSubmit: MouseEventHandler;
  onChange(
    field: 'configuration' | 'name' | 'label' | 'description',
    value: string | undefined,
  ): void;
  values: {
    configuration: string | null;
  };
};

export function CreateWorkflow(props: CreateWorkflowProps) {
  const [ref, {height}] = useMeasure<HTMLDivElement>();

  return (
    <div className="size-full flex flex-col">
      <div className="grid grid-cols-[3fr]" ref={ref}>
        <div className="col-span-2 px-6 py-3 flex justify-between  items-center">
          <h1 className="font-extrabold text-xl">Create a Workflow</h1>
          <Button onClick={props.onSubmit} type="submit" variant="outline">
            Save
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-[3fr] flex-grow" ref={ref}>
        <div className="bg-[#1e1e1e] border-r border-t">
          <div className="px-6 py-3 bg-[#1e1e1e] border-b">
            <strong className="text-xs uppercase text-muted-foreground">
              Configuration
            </strong>
          </div>
          <YamlEditor
            height={height}
            value={props.values.configuration ?? ''}
            onChange={nextValue => {
              props.onChange('configuration', nextValue);
            }}
          />
        </div>
      </div>
    </div>
  );
}
