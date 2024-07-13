import {type Workflow, type Status, type Result} from '@jsr/elwood__run/types';

import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
  ChevronRightIcon,
} from '@elwood/ui';
import {toArray} from '@elwood/common';

import {Link} from '@/components/link';
import {Button} from '@/components/button';

import {RunStatusIcon} from './status-icon';
import {RunDisplayName} from './display-name';
import clsx from 'clsx';

export type RunListProps = {
  className?: string;
  runs?: Array<{
    id: string;
    num: number;
    name: string;
    label: string;
    status: Status;
    result: Result;
  }>;
  workflows?: Array<{id: string; name: string; label: string}>;
  triggers?: Array<{id: string; name: string; label: string}>;
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
          </header>
          <div className="border-t">
            {workflows.length === 0 && (
              <div className="p-6 text-center text-muted-foreground text-xs">
                No workflows found. Create a new workflow to get started.
              </div>
            )}

            {workflows.map(workflow => {
              return (
                <Link
                  key={`workflow-${workflow.id}`}
                  href={`/run?workflow=${workflow.id}`}>
                  {workflow.label}
                </Link>
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

            {triggers.map(workflow => {
              return (
                <Link
                  key={`workflow-${workflow.id}`}
                  href={`/run?workflow=${workflow.id}`}>
                  {workflow.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <div className="size-full flex flex-col">
        <div className="border m-12">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Workflow</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map(run => {
                return (
                  <TableRow key={`runs-view-${run.id}`}>
                    <TableCell className="w-2">
                      <RunStatusIcon status={run.status} result={run.result} />
                    </TableCell>
                    <TableCell>
                      <Link href={`/run/${run.id}`}>
                        <RunDisplayName
                          primary={{
                            name: run.name,
                            label: run.label,
                          }}
                          fallback={{}}
                          postfix={`#${run.num}`}
                        />
                      </Link>
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        href={`/run/${run.id}`}
                        className="flex justify-center items-center">
                        view
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
