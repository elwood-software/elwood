import {PlusIcon} from '@elwood/ui';
import {toArray} from '@elwood/common';

import {Link} from '@/components/link';
import {Button} from '@/components/button';

import type {
  UseGetRunsItem,
  UseGetRunWorkflowsItem,
  UseGetRunTriggerItem,
} from '@/types';

import {RunTable} from './table';

export type RunListProps = {
  className?: string;
  runs?: UseGetRunsItem[];
  workflows?: UseGetRunWorkflowsItem[];
  triggers?: UseGetRunTriggerItem[];
};

export function RunList(props: RunListProps) {
  const workflows = toArray(props.workflows);
  const runs = toArray(props.runs);
  const triggers = toArray(props.triggers);

  return (
    <>
      <div className="w-[400px] border-r space-y-12">
        <header className="flex justify-between items-center mx-6 mt-6">
          <h1 className="text-2xl font-extrabold">Runs</h1>
          <Button
            size="sm"
            variant="outline"
            href="/run/new"
            className="flex items-center">
            Start a Run
          </Button>
        </header>
        <div className="mx-6">
          <header className="flex justify-between items-center text-xs font-medium mb-1.5">
            <h2 className="text-muted-foreground uppercase ">Workflows</h2>

            <Link href="/run/workflow/new">
              <PlusIcon className="size-4" />
            </Link>
          </header>
          <div className="border-t py-1.5">
            {workflows.length === 0 && (
              <div className="p-6 text-center text-muted-foreground text-xs">
                No workflows found. Create a new workflow to get started.
              </div>
            )}

            {workflows.map(workflow => {
              return (
                <div key={`workflow-${workflow.id}`}>
                  <Link
                    className="py-1.5 text-sm"
                    href={`/run/workflow/${workflow.id}`}>
                    {workflow.label}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mx-6">
          <header className="flex justify-between items-center text-xs font-medium mb-1.5">
            <h2 className="text-muted-foreground uppercase ">Triggers</h2>
          </header>
          <div className="border-t">
            {triggers.length === 0 && (
              <div className="p-6 text-center text-muted-foreground text-xs">
                No workflows found. Create a new workflow to get started.
              </div>
            )}

            {triggers.map(item => {
              return (
                <Link
                  key={`workflow-${item.trigger}`}
                  href={`/run?trigger=${item.trigger}`}>
                  {item.trigger}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <div className="size-full flex flex-col p-12">
        <RunTable runs={runs} />
      </div>
    </>
  );
}
