'use client';

import '@monaco-editor/react';
import {useEffect} from 'react';

// @ts-ignore
import YamlWorker from 'worker-loader!monaco-yaml/yaml.worker';

export function YamlEditorProvider() {
  useEffect(() => {
    window.MonacoEnvironment = {
      getWorker(_moduleId, label) {
        switch (label) {
          case 'editorWorkerService':
            return new Worker(
              new URL(
                'monaco-editor/esm/vs/editor/editor.worker',
                import.meta.url,
              ),
            );
          case 'yaml':
            return new YamlWorker();
          default:
            throw new Error(`Unknown label ${label}`);
        }
      },
    };

    return function cleanup() {
      delete window.MonacoEnvironment;
    };
  }, []);

  return <></>;
}
