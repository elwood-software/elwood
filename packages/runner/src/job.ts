import {Execution} from './execution.ts';
import {RunnerDefinition} from './types.ts';
import {State} from './state.ts';
import {Step} from './step.ts';

export class Job extends State {
  readonly id: string;
  readonly name: string;

  readonly #steps = new Map<string, Step>();

  constructor(
    public readonly execution: Execution,
    public readonly def: RunnerDefinition.Job,
  ) {
    super();
    this.id = `job-${def.id}`;
    this.name = def.name;
  }

  get steps(): Step[] {
    return Array.from(this.#steps.values());
  }

  async prepare(): Promise<void> {
    for (const def of this.def.steps) {
      const step = new Step(this, def);
      this.#steps.set(step.id, step);
      await step.prepare();
    }
  }

  async execute(): Promise<void> {
    console.log(`Running job: ${this.id}`);

    try {
      this.start();

      for (const step of this.steps) {
        if (this.status !== 'pending') {
          return;
        }

        await step.execute();
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
      steps: this.steps.map(step => step.state),
    };
  }
}
