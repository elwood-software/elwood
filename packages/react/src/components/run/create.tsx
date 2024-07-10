import type {MouseEventHandler} from 'react';
import {useMeasure} from 'react-use';
import Editor from '@monaco-editor/react';
import {Button} from '@/components/button';

export type CreateRunProps = {
  onSubmit: MouseEventHandler;
  onChange(
    field: 'configuration' | 'variables',
    value: string | undefined,
  ): void;
  values: {
    configuration: string;
    variables: string;
  };
};

export function CreateRun(props: CreateRunProps) {
  const [ref, {height}] = useMeasure<HTMLDivElement>();

  return (
    <div className="size-full flex flex-col">
      <div className="grid grid-cols-[3fr_1fr]" ref={ref}>
        <div className="col-span-2 px-6 py-3 border-b flex justify-between  items-center">
          <h1 className="font-extrabold text-xl">Start a Run</h1>

          <Button onClick={props.onSubmit} type="submit">
            Start
          </Button>
        </div>
        <div className="px-6 py-3 bg-[#1e1e1e] border-b">
          <strong className="text-xs uppercase text-muted-foreground">
            Configuration
          </strong>
        </div>
        <div className="px-6 py-3 bg-[#1e1e1e] border-b border-l">
          <strong className="text-xs uppercase text-muted-foreground">
            Variables
          </strong>
        </div>
      </div>
      <div
        className="grid grid-cols-[3fr_1fr] flex-grow bg-[#1e1e1e]"
        ref={ref}>
        <div>
          <Editor
            height={height}
            width="100%"
            defaultLanguage="yaml"
            defaultValue={props.values.configuration}
            theme="vs-dark"
            onChange={nextValue => {
              props.onChange('configuration', nextValue);
            }}
            options={{
              padding: {top: 12, bottom: 6},
              minimap: {enabled: false},
              overviewRulerLanes: 0,
              renderLineHighlight: 'none',
              scrollbar: {vertical: 'hidden', horizontal: 'hidden'},
            }}
          />
        </div>
        <div className="border-l">
          <Editor
            height={height}
            width="100%"
            defaultLanguage="json"
            defaultValue={props.values.variables}
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
