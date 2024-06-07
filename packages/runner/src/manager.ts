import {join} from 'node:path';

import {Execution} from './execution.ts';
import {RunnerDefinition} from './types.ts';

export type ManagerOptions = {
  workspaceDir: string;
  stdActionsPrefix: string;
};

export class Manager {
  public readonly executions = new Map<string, Execution>();

  constructor(public readonly options: ManagerOptions) {
    Deno.mkdirSync(this.options.workspaceDir, {recursive: true});
  }

  async mkdir(_in: 'workspace', ...parts: string[]): Promise<string> {
    const path = join(this.options.workspaceDir, ...parts);
    await Deno.mkdir(path, {recursive: true});
    return path;
  }

  async prepare(): Promise<void> {
    await this.mkdir('workspace');
  }

  async executeDefinition(
    def: RunnerDefinition.Normalized,
  ): Promise<Execution> {
    const execution = new Execution(this, def, {});

    this.executions.set(execution.id, execution);

    await execution.prepare();
    await execution.execute();

    return execution;
  }

  async cleanup(): Promise<void> {
    for await (const [_, execution] of this.executions) {
      await Deno.remove(execution.workingDir, {recursive: true});
    }
  }
}
