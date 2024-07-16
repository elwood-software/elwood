import {type ComponentProps} from 'react';

import Editor from '@monaco-editor/react';
import {configureMonacoYaml} from 'monaco-yaml';

export function YamlEditor(props: ComponentProps<typeof Editor>) {
  return (
    <Editor
      {...props}
      onMount={(_, monaco) => {
        configureMonacoYaml(monaco, {
          enableSchemaRequest: true,
          schemas: [
            {
              // If YAML file is opened matching this glob
              fileMatch: ['*'],
              // Then this schema will be downloaded from the internet and used.
              uri: 'https://x.elwood.run/workflow.json',
            },
          ],
        });
      }}
      width="100%"
      defaultLanguage="yaml"
      theme="vs-dark"
      options={{
        tabSize: 2,
        formatOnType: true,
        automaticLayout: true,
        padding: {top: 12, bottom: 6},
        minimap: {enabled: false},
        overviewRulerLanes: 0,
        renderLineHighlight: 'none',
        scrollbar: {vertical: 'hidden', horizontal: 'hidden'},
        ...(props.options ?? {}),
      }}
    />
  );
}
