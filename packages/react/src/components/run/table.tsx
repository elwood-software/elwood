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
import type {UseGetRunsItem} from '@/types';
import {RunDisplayName} from './display-name';
import {RunStatusIcon} from './status-icon';

export type RunTableProps = {
  className?: string;
  runs?: UseGetRunsItem[];
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
          {runs.length === 0 && (
            <TableRow key={`runs-view-empty`}>
              <TableCell
                className="flex items-center justify-center text-muted-foreground"
                colSpan={3}>
                No runs found.
                <Link
                  href="/run/new"
                  className="underline text-muted-foreground ml-1">
                  Create a new run to get started.
                </Link>
              </TableCell>
            </TableRow>
          )}

          {runs.map(run => {
            return (
              <TableRow key={`runs-view-${run.id}`}>
                <TableCell className="w-2">
                  <RunStatusIcon run={run} />
                </TableCell>
                <TableCell>
                  <Link href={`/run/${run.id}`}>
                    <RunDisplayName run={run} />
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
