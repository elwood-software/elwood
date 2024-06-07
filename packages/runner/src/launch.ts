import {join} from 'node:path';
import {assert} from 'https://deno.land/std@0.224.0/assert/assert.ts';
import {Manager} from './manager.ts';
import {RunnerDefinition} from './types.ts';

const instructions: RunnerDefinition.Normalized = {
  name: 'default',
  jobs: [
    {
      id: 'job-1',
      name: 'default',
      steps: [
        {
          id: 'step-1',
          name: 'copy',
          action: 'fs/copy',
          with: {
            src: 'file://tmp/conan.mp3',
            dest: 'conan.mp3',
          },
        },
      ],
    },
  ],
};

console.log('instructions', instructions);

if (import.meta.main) {
  main();
}

async function main() {
  const workspaceDir = Deno.env.get('ELWOOD_RUNNER_WORKSPACE_DIR');

  assert(workspaceDir, 'ELWOOD_RUNNER_WORKSPACE_DIR not set');
  assert(
    Deno.statSync(workspaceDir)?.isDirectory,
    'Workspace dir does not exist',
  );

  const manager = new Manager({
    workspaceDir,
    stdActionsPrefix: 'file:///elwood/runner/actions',
  });

  // we're going to cleanup any previous executions
  for await (const entry of Deno.readDir(workspaceDir)) {
    if (entry.isDirectory) {
      await Deno.remove(join(workspaceDir, entry.name), {recursive: true});
    }
  }

  await manager.prepare();
  const execution = await manager.executeDefinition(instructions);

  console.log(execution.getCombinedState());
}
