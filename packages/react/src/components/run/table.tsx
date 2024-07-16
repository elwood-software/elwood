import {type Status, type Result} from '@jsr/elwood__run/types';

import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
  cn,
} from '@elwood/ui';
import {toArray} from '@elwood/common';

import {Link} from '@/components/link';
import {Button} from '@/components/button';

import {RunStatusIcon} from './status-icon';
import {RunDisplayName} from './display-name';

export type RunTableProps = {
  className?: string;
  runs?: Array<{
    id: string;
    num: number;
    short_summary: string;
    status: Status;
    result: Result;
    workflow: {
      id: string;
      name: string;
    };
  }>;
};

export function RunTable(props: RunTableProps) {
  const runs = toArray(props.runs);

  return (
    <div className={cn(props.className, 'border')}>
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
                    {run.short_summary ?? run.workflow.name}
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
  );
}
