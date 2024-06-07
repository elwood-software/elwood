import {assert} from 'https://deno.land/std@0.224.0/assert/assert.ts';
import {join} from 'https://deno.land/std@0.217.0/path/join.ts';

import {Manager} from './manager.ts';
import {RunnerDefinition} from './types.ts';
import {Job} from './job.ts';
import {executeDenoCommand} from './libs/run-deno.ts';
import {resolveActionUrlForDenoCommand} from './libs/resolve-action-url.ts';
import {State} from './state.ts';

export type ExecutionOptions = {};

export class Execution extends State {
  readonly id: string;
  readonly #jobs = new Map<string, Job>();

  #workingDir: string | null = null;
  #stageDir: string | null = null;

  constructor(
    public readonly manager: Manager,
    public readonly def: RunnerDefinition.Normalized,
    public readonly options: ExecutionOptions,
  ) {
    super();
    this.id = `execution-${crypto.randomUUID()}`;
  }

  get jobs(): Job[] {
    return Array.from(this.#jobs.values());
  }

  get workingDir(): string {
    assert(this.#workingDir !== null, 'Execution not prepared');
    return this.#workingDir;
  }

  get stageDir(): string {
    assert(this.#stageDir !== null, 'Execution not prepared');
    return this.#stageDir;
  }

  async mkdir(...parts: string[]): Promise<string> {
    return await this.manager.mkdir('workspace', this.id, ...parts);
  }

  async prepare(): Promise<void> {
    this.#workingDir = await this.mkdir('');
    this.#stageDir = await this.mkdir('stage');

    // write our definition to the working directory
    await Deno.writeTextFile(
      join(this.workingDir, 'definition.json'),
      JSON.stringify(this.def, null, 2),
    );

    const actionUrls: URL[] = [];

    for (const def of this.def.jobs) {
      const job = new Job(this, def);
      this.#jobs.set(job.id, job);
      await job.prepare();

      // loop through each job step and compile a list of action URLs
      for (const step of job.steps) {
        actionUrls.push(step.actionUrl!);
      }
    }

    // cache each action file
    await Promise.all(
      actionUrls.map(async url => {
        console.log(`Preloading action: ${url}`);

        return await executeDenoCommand({
          args: ['cache', resolveActionUrlForDenoCommand(url)],
        });
      }),
    );
  }

  async execute(): Promise<void> {
    console.log(`Executing: ${this.id}`);

    for (const job of this.jobs) {
      if (job.status !== 'pending') {
        continue;
      }

      await job.execute();
    }

    const hasFailure = this.jobs.some(job => job.result === 'failure');

    if (hasFailure) {
      await this.fail('Execution failed');
      return;
    }

    await this.succeed();
  }

  getCombinedState() {
    return {
      ...super.getCombinedState(),
      jobs: this.jobs.map(job => job.getCombinedState()),
    };
  }
}
