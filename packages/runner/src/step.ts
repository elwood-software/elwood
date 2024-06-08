import {Job} from './job.ts';
import {RunnerDefinition} from './types.ts';
import {
  resolveActionUrl,
  resolveActionUrlForDenoCommand,
} from './libs/resolve-action-url.ts';
import {State} from './state.ts';

import {executeDenoRun} from './libs/run-deno.ts';
import {assert} from 'https://deno.land/std@0.224.0/assert/assert.ts';

export class Step extends State {
  readonly id: string;
  readonly name: string;

  public actionUrl: URL | null = null;

  constructor(
    public readonly job: Job,
    public readonly def: RunnerDefinition.Step,
  ) {
    super();
    this.id = crypto.randomUUID();
    this.name = def.name;
  }

  async prepare(): Promise<void> {
    this.actionUrl = await resolveActionUrl(this.def.action, {
      stdPrefix: this.job.execution.manager.options.stdActionsPrefix,
    });
  }

  async execute(): Promise<void> {
    assert(this.actionUrl, 'Action URL not resolved');

    console.log(`Running step: ${this.name}`);

    try {
      this.start();

      const commandInputEnv = this.#getCommandInputEnv();

      const result = await executeDenoRun({
        file: resolveActionUrlForDenoCommand(this.actionUrl),
        permissions: {
          env: Object.keys(commandInputEnv),
        },
        env: {
          ...commandInputEnv,
        },
      });

      switch (result.code) {
        case 0: {
          await this.succeed();
          break;
        }
        default: {
          await this.fail(`Action failed with code ${result.code}`);
          await this.job.fail(`Step ${this.name} failed`);
        }
      }
    } catch (error) {
      await this.fail(error.message);
    } finally {
      this.stop();
    }
  }

  getCombinedState() {
    return {
      ...super.getCombinedState(),
      definition: this.def,
    };
  }

  #getCommandInputEnv(): Record<string, string> {
    const withDefinition = this.def.with ?? {};

    return Object.entries(withDefinition).reduce((acc, [key, value]) => {
      return {...acc, [`INPUT_${key.toUpperCase()}`]: String(value)};
    }, {});
  }
}
