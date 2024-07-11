import {JsonObject} from '@elwood/common';
import {toArray} from '@elwood/common';
import {
  Dialog,
  CircleAlert,
  CircleEllipsis,
  CircleCheck,
  Spinner,
  Button,
} from '@elwood/ui';
import clsx from 'clsx';
import Editor from '@monaco-editor/react';
import {stringify} from 'yaml';

type Status = 'pending' | 'running' | 'complete' | 'queued' | 'assigned';
type Result = 'none' | 'success' | 'failure' | 'cancelled' | 'skipped';

export type RunViewProps = {
  className?: string;
  run: {
    num: number;
    status: Status;
    result: Result;
    configuration: JsonObject;
    report: {
      timing: {
        end: number;
        start: number;
        elapsed: number;
      };
      tracking_id: string;
      id: string;
      status: Status;
      result: Result;
      name: string;
      reason: string;
      jobs: Record<
        string,
        {
          id: string;
          name: string;
          status: Status;
          result: Result;
          timing: {
            end: number;
            start: number;
            elapsed: number;
          };
          steps: Array<{
            id: string;
            reason: string;
            name: string;
            status: Status;
            result: Result;
            stdout: Array<{timestamp: string; text: string}>;
            stderr: Array<{timestamp: string; text: string}>;
            outputs: JsonObject;
            timing: {
              end: number;
              start: number;
              elapsed: number;
            };
          }>;
        }
      >;
    };
  };
};

export function RunView(props: RunViewProps) {
  const {status, result} = props.run;
  const hasRunOrIsRunning = ['complete', 'running'].includes(status);

  const report = props.run.report ?? {};
  const jobs = Object.entries(report.jobs ?? {});
  const items = jobs.map(([name, job]) => {
    return (
      <div key={name}>
        <div className="border-b w-full text-left px-3.5 py-3">
          <h2 className="font-bold flex items-center justify-start">{name}</h2>
        </div>
        <div className="p-3 space-y-3 bg-black">
          {toArray(job.steps).map(step => {
            const cn = clsx(
              'flex items-center justify-start w-full rounded space-x-2 font-medium text-sm text-muted-foreground',
            );

            const log = [
              ...step.stdout.map(item => ({...item, type: 'out'})),
              ...step.stderr.map(item => ({...item, type: 'err'})),
            ];

            log.sort((a, b) => {
              return (
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime()
              );
            });

            return (
              <div key={`${name}${step.name}`} className="pb-3">
                <span className={cn}>
                  <StatusIcon
                    className="size-5 ml-0.5"
                    status={step.status}
                    result={step.result}
                  />
                  <span>{step.name}</span>
                </span>

                {log.length > 0 && (
                  <div className="ml-2 pt-3 space-y-1 text-xs">
                    {toArray(log).map(({type, text}, num) => (
                      <span className="flex items-start font-mono">
                        <pre className="text-muted-foreground mr-2">
                          {num + 1}.
                        </pre>
                        <span
                          className={clsx(
                            type === 'err' && 'text-red-600',
                            'overflow-auto font-mono whitespace-pre-wrap break-words',
                          )}>
                          {text}
                        </span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  const config = (
    <Editor
      height="60vh"
      width="100%"
      defaultLanguage="yaml"
      defaultValue={stringify(props.run.configuration)}
      theme="vs-dark"
      options={{
        padding: {top: 12},
        readOnly: true,
        minimap: {enabled: false},
        overviewRulerLanes: 0,
        renderLineHighlight: 'none',
        matchBrackets: 'never',
        scrollBeyondLastLine: false,
      }}
    />
  );

  return (
    <div className="size-full  grid grid-cols-[1fr_3fr] grid-rows-[auto_minmax(0,_1fr)]">
      <header className="p-6 col-span-2 flex justify-between items-center">
        <div>
          <h1 className="flex items-center text-2xl font-extrabold">
            <StatusIcon color={true} status={status} result={result} />
            <span className="ml-2">
              {props.run.report.name}
              <span className="ml-2 text-lg text-muted-foreground font-normal">
                #{props.run.num}
              </span>
            </span>
          </h1>
        </div>
        <div>
          <Dialog
            content={config}
            title="Workflow File"
            className="max-w-[1200px]">
            <Button size="sm" variant="outline" type="button">
              Workflow File
            </Button>
          </Dialog>
        </div>
      </header>
      <div className="px-6 space-y-6 divide divide-y">
        {hasRunOrIsRunning && (
          <>
            <div>
              <h3 className="uppercase text-xs font-medium tracking-wide text-muted-foreground mb-1.5">
                Jobs
              </h3>
              <div className="space-y-4">
                {jobs.map(([name, job]) => (
                  <a href={''} className="flex items-center text-ms">
                    <StatusIcon
                      color={true}
                      status={job.status}
                      result={job.result}
                      className="mr-1.5 size-5"
                    />
                    <span>{job.name}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="pt-6">
              <h3 className="uppercase text-xs font-medium tracking-wide text-muted-foreground">
                Artifacts
              </h3>
            </div>
          </>
        )}
      </div>
      <div className="border-l border-t divide-y divide bg-black">
        {!hasRunOrIsRunning && (
          <div className="flex size-full items-center justify-center flex-col">
            <Spinner className="mb-3 text-muted-foreground" />

            {status == 'queued' && (
              <>
                <h1 className="text-xl font-bold">Queued</h1>
                <p className="text-muted-foreground text-sm">
                  Run is waiting to be assigned to a worker.
                </p>
              </>
            )}

            {status == 'assigned' && (
              <>
                <h1 className="text-xl font-bold">Assigned</h1>
                <p className="text-muted-foreground text-sm">
                  Run has been assigned to worker and is waiting for worker to
                  initialize.
                </p>
              </>
            )}

            {status == 'pending' && (
              <>
                <h1 className="text-xl font-bold">Pending</h1>
                <p className="text-muted-foreground text-sm">
                  Run is waiting for worker to start execution.
                </p>
              </>
            )}
          </div>
        )}

        {hasRunOrIsRunning && jobs.length > 0 && items}
      </div>
    </div>
  );
}

type StatusIconProps = {
  status: Status;
  result: Result;
  className?: string;
  color?: boolean;
};

export function StatusIcon(props: StatusIconProps) {
  let Icon =
    props.status === 'running'
      ? CircleEllipsis
      : props.result === 'success'
        ? CircleCheck
        : CircleAlert;

  if (['pending', 'queued', 'assigned'].includes(props.status)) {
    Icon = CircleEllipsis;
  }

  const color = {
    none: '',
    success: 'text-green-500',
    failure: 'text-red-500',
    cancelled: '',
    skipped: 'text-blue-500',
  }[props.result];

  return (
    <Icon
      className={clsx(
        props.className,
        'fill-current stroke-black',
        props.color && color,
      )}
    />
  );
}
