import {useState, type MouseEventHandler} from 'react';
import {useMeasure} from 'react-use';
import Editor from '@monaco-editor/react';
import {
  Input,
  Spinner,
  ArrowLeft,
  Popover,
  PopoverTrigger,
  PopoverContent,
  FormLabel,
  Textarea,
  ChevronRightIcon,
} from '@elwood/ui';

import {Button} from '@/components/button';
import {Link} from '@/components/link';
import {YamlEditor} from '@/components/yaml-editor/yaml-editor';

import type {UseGetRunWorkflowsItem, UseGetRunWorkflowItem} from '@/types';
import {toArray} from '@elwood/common';

export type CreateRunProps = {
  isReady: boolean;
  onSubmit: MouseEventHandler;
  onChange(
    field: 'configuration' | 'variables' | 'short_summary' | 'long_summary',
    value: string | undefined,
  ): void;
  values: {
    configuration: string;
    variables: string;
    short_summary: string | null;
    summary: string | null;
  };
  selectedWorkflow?: UseGetRunWorkflowItem;
  workflows: UseGetRunWorkflowsItem[];
};

export function CreateRun(props: CreateRunProps) {
  const [ref, {height}] = useMeasure<HTMLDivElement>();
  const [open, setOpen] = useState(false);

  if (!props.selectedWorkflow && props.workflows.length > 0) {
    return (
      <div className="size-full flex flex-col">
        <header className="px-6 py-3 border-b flex justify-between  items-center">
          <div>
            <Link
              href="/run"
              className="text-xs text-muted-foreground flex items-center mb-2">
              <ArrowLeft className="size-3 mr-1" />
              <span>Runs</span>
            </Link>
            <h1 className="font-extrabold text-xl">Start a Run</h1>
          </div>
        </header>
        <div className="w-full flex justify-center items-center flex-col">
          <div className="max-w-2xl w-full mt-12">
            <header className="mb-6">
              <h2 className="text-lg font-semibold">Select a Workflow</h2>
              <p className="text-muted-foreground">
                Choose a workflow to start a run
              </p>
            </header>
            <ul className="w-full my-6 border divide-y">
              {toArray(props.workflows).map(workflow => {
                return (
                  <div key={`CreateRun-Workflow-${workflow.id}`}>
                    <Link
                      href={`/run/new?workflow=${workflow.id}`}
                      className="p-3 flex justify-between items-center">
                      {workflow.label ?? workflow.name}

                      <ChevronRightIcon className="size-[1em]" />
                    </Link>
                  </div>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col">
      <div className="grid grid-cols-[3fr_1fr]" ref={ref}>
        <div className="col-span-2 px-6 py-3 border-b flex justify-between  items-center">
          <div>
            <Link
              href="/run"
              className="text-xs text-muted-foreground flex items-center mb-2">
              <ArrowLeft className="size-3 mr-1" />
              <span>Runs</span>
            </Link>
            <h1 className="font-extrabold text-xl">Start a Run</h1>
            {props.selectedWorkflow && (
              <small className="text-muted-foreground text-sm">
                from{' '}
                <Link
                  href={`/run/workflow/${props.selectedWorkflow.id}`}
                  className="font-medium">
                  {props.selectedWorkflow.label ?? props.selectedWorkflow.name}
                </Link>
              </small>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild onMouseEnter={() => setOpen(true)}>
                <Button type="button" variant="outline">
                  <span>Continue</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="space-y-6 mr-6">
                <div>
                  <FormLabel className="mb-1" htmlFor="summary">
                    Short Summary
                  </FormLabel>
                  <Input
                    name="summary"
                    value={props.values.short_summary ?? ''}
                    onChange={e =>
                      props.onChange('short_summary', e.target.value)
                    }
                    placeholder="Transcribe the Gettysburg address"
                  />
                </div>

                <div>
                  <FormLabel className="mb-1" htmlFor="summary">
                    Summary
                  </FormLabel>
                  <Textarea
                    name="summary"
                    value={props.values.summary ?? ''}
                    onChange={e =>
                      props.onChange('long_summary', e.target.value)
                    }
                    placeholder="This is a test video we need to transcript"
                  />
                </div>

                <Button
                  type="button"
                  onClick={props.onSubmit}
                  className="w-full">
                  Start Run
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="px-6 py-3 bg-[#1e1e1e] border-b flex items-center">
          <strong className="text-xs uppercase text-muted-foreground">
            Configuration
          </strong>

          {props.selectedWorkflow?.id && (
            <div className="bg-blue-800 text-blue-300 px-3 py-0.5 text-xs rounded-full ml-3">
              Can not edit configuration when workflow is selected
            </div>
          )}
        </div>
        <div className="px-6 py-3 bg-[#1e1e1e] border-b border-l">
          <strong className="text-xs uppercase text-muted-foreground">
            Variables
          </strong>
        </div>
      </div>
      <div
        className="grid grid-cols-[3fr_1fr] flex-grow bg-[#1e1e1e] relative"
        ref={ref}>
        {!props.isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e] bg-opacity-90 z-50">
            <Spinner />
          </div>
        )}

        <div className="">
          <YamlEditor
            height={height}
            value={props.values.configuration}
            onChange={nextValue => {
              props.onChange('configuration', nextValue);
            }}
            options={{
              readOnly: !!props.selectedWorkflow?.id,
            }}
          />
        </div>
        <div className="border-l">
          <Editor
            height={height}
            width="100%"
            defaultLanguage="json"
            value={props.values.variables}
            theme="vs-dark"
            onChange={nextValue => {
              props.onChange('variables', nextValue);
            }}
            options={{
              padding: {top: 12, bottom: 6},
              minimap: {enabled: false},
              overviewRulerLanes: 0,
              scrollbar: {vertical: 'hidden', horizontal: 'hidden'},
              renderLineHighlight: 'none',
              matchBrackets: 'never',
              lineNumbers: 'off',
              scrollBeyondLastLine: false,
            }}
          />
        </div>
      </div>
    </div>
  );
}
