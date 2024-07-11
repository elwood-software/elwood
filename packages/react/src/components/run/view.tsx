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
import {type Workflow, type Status, type Result} from '@jsr/elwood__run';

import {RunStatusIcon} from './status-icon';
import {RunDisplayName} from './display-name';

export type RunViewProps = {
  className?: string;
  run: {
    num: number;
    status: Status;
    result: Result;
    configuration: Workflow.Configuration | null;
    report: Workflow.Report | null;
  };
};

export function RunView(props: RunViewProps) {
  const {status, result} = props.run;
  const hasRunOrIsRunning = ['complete', 'running'].includes(status);
  const report = props.run.report;
  const configuration = props.run.configuration;

  const jobNames = [
    ...new Set([
      ...Object.keys(report?.jobs ?? {}),
      ...Object.keys(configuration?.jobs ?? {}),
    ]),
  ];

  const jobs = Object.entries(report?.jobs ?? {});

  const items = jobNames.map(name => {
    const jobReport = Object.entries(report?.jobs ?? {}).find(
      e => e[0] === name,
    )?.[1];
    const jobDef = Object.entries(configuration?.jobs ?? {}).find(
      e => e[0] === name,
    )?.[1];

    if (!jobReport && !jobDef) {
      return <></>;
    }

    const stepNames = (jobReport?.steps ?? jobDef?.steps ?? []).map(
      item => item.name,
    );

    return (
      <div key={name}>
        <div className="border-b w-full text-left px-3.5 py-3">
          <h2 className="font-bold flex items-center justify-start">
            <RunDisplayName primary={jobDef} fallback={jobReport} />
          </h2>
        </div>
        <div className="p-3 space-y-3 bg-black">
          {stepNames.map(stepName => {
            const stepReport = jobReport?.steps?.find(
              item => item.name === stepName,
            );
            const stepDef = jobDef?.steps?.find(item => item.name === stepName);

            if (!stepReport && !stepDef) {
              return <></>;
            }

            const cn = clsx(
              'flex items-center justify-start w-full rounded space-x-2 font-medium text-sm text-muted-foreground',
            );

            const log = stepReport
              ? [
                  ...stepReport?.stdout.map(item => ({...item, type: 'out'})),
                  ...stepReport?.stderr.map(item => ({...item, type: 'err'})),
                ]
              : [];

            log.sort((a, b) => {
              return (
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime()
              );
            });

            return (
              <div key={`${name}${stepName}`} className="pb-3">
                <span className={cn}>
                  <RunStatusIcon
                    className="size-5 ml-0.5"
                    status={stepReport?.status ?? 'queued'}
                    result={stepReport?.result ?? 'none'}
                  />
                  <RunDisplayName primary={stepDef} fallback={stepReport} />
                </span>

                {log.length > 0 && (
                  <div className="ml-2 pt-3 space-y-1 text-xs">
                    {toArray(log).map(({type, timestamp, text}, num) => (
                      <span
                        className="flex items-start font-mono"
                        key={`log-${stepName}-${timestamp}`}>
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
            <RunStatusIcon color={true} status={status} result={result} />
            <RunDisplayName
              primary={props.run.configuration}
              fallback={props.run.report}
              className="ml-2"
              postfix={`#${props.run.num}`}
            />
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
              <h3 className="uppercase text-xs font-medium tracking-wide text-muted-foreground mb-2">
                Jobs
              </h3>
              <div className="space-y-3">
                {jobs.map(([_, job]) => {
                  return (
                    <div
                      key={`job-id-${job.id}`}
                      className="flex items-center text-ms">
                      <RunStatusIcon
                        color={true}
                        status={job.status}
                        result={job.result}
                        className="mr-1.5 size-4"
                      />
                      <RunDisplayName primary={job} fallback={null} />
                    </div>
                  );
                })}
              </div>
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
