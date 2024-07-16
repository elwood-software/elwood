import {JsonObject} from '@elwood/common';
import {ArrowLeft} from '@elwood/ui';
import {stringify} from 'yaml';

import {Button} from '@/components/button';
import {YamlEditor} from '@/components/yaml-editor/yaml-editor';
import {RunTable} from '@/components/run/table';

import {type Workflow, type Status, type Result} from '@jsr/elwood__run/types';

import {Link} from '../link';

export type RunWorkflowViewProps = {
  className?: string;
  workflow: {
    name: string;
    label: string;
    description: string;
    metadata: JsonObject;
    configuration: Workflow.Configuration | null;
  };
  runs: JsonObject[];
};

export function RunWorkflowView(props: RunWorkflowViewProps) {
  return (
    <div className="size-full  grid grid-cols-[1fr_3fr] grid-rows-[auto_minmax(0,_1fr)]">
      <header className="p-6 col-span-2 flex justify-between items-center">
        <div>
          <div className="flex items-center text-sm text-muted-foreground mb-2 space-x-2">
            <Link
              href="/run"
              className="text-sm text-muted-foreground flex items-center ">
              <ArrowLeft className="size-4" />
              Runs
            </Link>
            <span>/</span>
            <Link
              href="/run/workflows"
              className="text-sm text-muted-foreground flex items-center">
              Workflows
            </Link>
          </div>
          <h1 className="flex items-center text-2xl font-extrabold">
            {props.workflow.label ?? props.workflow.name}
          </h1>
        </div>
        <div>
          <Button
            variant="outline"
            href={`/run/new?workflow=${props.workflow.id}`}>
            Start a Run
          </Button>
        </div>
      </header>
      <div className="px-6">
        <RunTable runs={props.runs} />
      </div>
      <div className="border-l border-t divide-y divide bg-black">
        <YamlEditor
          defaultValue={stringify(props.workflow.configuration)}
          options={{readOnly: true}}
        />
      </div>
    </div>
  );
}
