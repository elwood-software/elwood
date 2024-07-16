import type {MouseEventHandler} from 'react';
import {useMeasure} from 'react-use';
import Editor from '@monaco-editor/react';
import {Button} from '@/components/button';
import {Link} from '@/components/link';

import {YamlEditor} from '@/components/yaml-editor/yaml-editor';
import {Input, Spinner, ArrowLeft} from '@elwood/ui';

export type CreateRunProps = {
  isReady: boolean;
  onSubmit: MouseEventHandler;
  onChange(
    field: 'configuration' | 'variables' | 'short_summary',
    value: string | undefined,
  ): void;
  values: {
    configuration: string;
    variables: string;
    short_summary: string;
  };
  workflow?: {
    id: string;
    label: string;
    name: string;
  };
};

export function CreateRun(props: CreateRunProps) {
  const [ref, {height}] = useMeasure<HTMLDivElement>();

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
            {props.workflow && (
              <small className="text-muted-foreground text-sm">
                from{' '}
                <Link
                  href={`/run/workflow/${props.workflow.id}`}
                  className="font-medium">
                  {props.workflow.label ?? props.workflow.name}
                </Link>
              </small>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3">
            <label className="flex items-center space-x-1 text-sm">
              <span className="font-medium text-muted-foreground">Summary</span>
              <input
                value={props.values.short_summary}
                onChange={e => props.onChange('short_summary', e.target.value)}
                className="px-3 py-2.5 w-[250px] bg-transparent border rounded-lg ring-0 outline-none"
                placeholder="Run this awesome workflow!"
              />
            </label>

            <Button
              disabled={!props.isReady}
              onClick={props.onSubmit}
              type="submit">
              <span>Start</span>
            </Button>
          </div>
        </div>
        <div className="px-6 py-3 bg-[#1e1e1e] border-b flex items-center">
          <strong className="text-xs uppercase text-muted-foreground">
            Configuration
          </strong>

          {props.workflow?.id && (
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
              readOnly: !!props.workflow?.id,
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
