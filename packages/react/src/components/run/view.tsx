import {JsonObject} from '@elwood/common';
import {toArray} from '@elwood/common';
import {
  Dialog,
  CogIcon,
  CircleEllipsis,
  Spinner,
  Button,
  ArrowLeft,
  Icons,
} from '@elwood/ui';
import clsx from 'clsx';
import Editor from '@monaco-editor/react';
import {stringify} from 'yaml';

import type {RunWorkflow, UseGetRunItem, UseGetRunWorkflowItem} from '@/types';

import {RunStatusIcon} from './status-icon';
import {
  RunDisplayName,
  RunWorkflowDisplayName,
  RunWorkflowJobOrStepDisplayName,
} from './display-name';
import {Link} from '../link';

export type RunViewProps = {
  className?: string;
  run: UseGetRunItem;
  workflow: UseGetRunWorkflowItem;
  view?: 'config' | 'summary';
};

export function RunView(props: RunViewProps) {
  const {view = 'summary'} = props;
  const {status, result} = props.run;
  const hasRunOrIsRunning = ['complete', 'running', 'failure'].includes(status);
  const report = props.run.report;
  const configuration = props.workflow
    .configuration as RunWorkflow.Configuration;

  const jobNames = Object.keys(configuration.jobs ?? {});

  return (
    <div className="size-full grid grid-cols-[1fr_3fr] grid-rows-[auto_minmax(0,_1fr)]">
      <header className="p-6 mb-3 col-span-2 flex justify-between items-center">
        <div>
          <Link
            href="/run"
            className="text-sm text-muted-foreground flex items-center mb-2">
            <ArrowLeft className="size-4" />
            Runs
          </Link>

          <h1 className="flex items-center">
            <span className="flex flex-col ml-1">
              <span className="text-2xl font-extrabold flex items-center justify-center ">
                <RunWorkflowDisplayName workflow={props.workflow} />
              </span>
              <span className="text-sm text-muted-foreground">
                #{props.run.num} - started 10 minutes ago
              </span>
            </span>
          </h1>
        </div>
        <div></div>
      </header>
      <div className="px-6 space-y-6 divide divide-y">
        <div className="flex flex-col space-y-2 border-t pt-6">
          <Link
            href={`/run/${props.run.id}`}
            className="flex items-center font-medium text-sm">
            <Icons.Home className="size-4 mr-2 stroke-muted-foreground" />
            Summary
          </Link>

          <Link
            href={`/run/${props.run.id}?view=config`}
            className="flex items-center font-medium text-sm">
            <CogIcon className="size-4 mr-2 stroke-muted-foreground" />
            Configuration
          </Link>
        </div>

        <div className="pt-6">
          <h3 className="uppercase text-xs font-medium tracking-wide text-muted-foreground mb-2">
            Jobs
          </h3>
          <div className="space-y-3">
            {jobNames.map(name => {
              const job = configuration?.jobs?.[name];

              if (!job) {
                return <></>;
              }

              return (
                <div
                  key={`job-id-${job.name}`}
                  className="flex items-center text-ms">
                  <RunStatusIcon
                    color={true}
                    run={props.run}
                    className="mr-1.5 size-4"
                  />
                  <RunWorkflowJobOrStepDisplayName item={{name, ...job}} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="border-l border-t divide-y divide bg-black">
        {status === 'failure' && (
          <div className="bg-red-800 px-3 p-2 flex flex-col text-sm">
            <strong>Run has failed</strong>
            <p>{report.reason}</p>
          </div>
        )}

        {!hasRunOrIsRunning && (
          <div className="flex size-full items-center justify-center flex-col">
            {status !== 'queued' && (
              <Spinner className="mb-3 text-muted-foreground" />
            )}
            {status === 'queued' && (
              <CircleEllipsis className="mb-3 text-muted-foreground" />
            )}

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

        {view === 'summary' && <RunViewSummary {...props} />}
        {view === 'config' && <RunViewConfig {...props} />}
      </div>
    </div>
  );
}

export function RunViewSummary(props: RunViewProps) {
  const report = props.run.report;
  const configuration = props.workflow
    .configuration as RunWorkflow.Configuration;

  const jobNames = Object.keys(configuration.jobs ?? {});

  return jobNames.map(name => {
    const job = configuration?.jobs?.[name];

    if (!job) {
      return <></>;
    }

    const jobReport = Object.entries(report?.jobs ?? {}).find(
      e => e[0] === name,
    )?.[1];

    const stepNames = job.steps
      .map(item => item.name)
      .filter(Boolean) as string[];

    return (
      <div key={name} data-job-name={name}>
        <div className="border-b w-full text-left px-3.5 py-3">
          <h2 className="font-bold flex items-center justify-start">
            <RunWorkflowJobOrStepDisplayName item={{name, ...job}} />
          </h2>
        </div>
        <div className="p-3 space-y-3 bg-black">
          {stepNames.map(stepName => {
            const stepReport = jobReport?.steps?.find(
              item => item.name === stepName,
            );
            const stepDef = job.steps?.find(item => item.name === stepName);

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
                  <RunDisplayName run={props.run} />
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
}

export function RunViewConfig(props: RunViewProps) {
  return (
    <Editor
      height="100%"
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
}
