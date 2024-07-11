import type {Meta, StoryObj} from '@storybook/react';

import {RunView as Component} from './view';

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Main: Story = {
  args: {
    run: {
      num: 1,
      status: 'running',
      result: 'none',
      configuration: {
        jobs: {
          job_1: {
            steps: [
              {
                name: 'say-hello',
                when: 'true',
                input: {content: '${{ `Hello, ${vars.name}` }}'},
                action: 'echo',
              },
            ],
          },
          job_2: {
            steps: [
              {
                name: 'say-hello',
                when: 'true',
                input: {content: '${{ `Hello, ${vars.name}` }}'},
                action: 'echo',
              },
            ],
          },
        },
        name: 'hello-world',
        label: 'Hello World',
        defaults: {permissions: 'all'},
        description: 'A simple hello world workflow',
      },
      report: {
        id: 'E2T7EEC',
        jobs: {
          job_1: {
            id: 'J5J500C',
            name: 'job_1',
            steps: [
              {
                id: 'S2TJ193B',
                name: 'say-hello',
                reason: '',
                result: 'success',
                status: 'complete',
                stderr: [],
                stdout: [
                  {
                    text: 'Hello, Hello World',
                    timestamp: '2024-07-11T15:58:59.836Z',
                  },
                ],
                timing: {
                  end: 1720713539949.7112,
                  start: 1720713539208.6953,
                  elapsed: 741.0158330000004,
                },
                outputs: {},
              },
            ],
            result: 'success',
            status: 'complete',
            reason: '',
            timing: {
              end: 1720713539949.883,
              start: 1720713539207.798,
              elapsed: 742.0851669999997,
            },
          },
          job_2: {
            id: 'J1JJF807',
            name: 'job_2',
            steps: [
              {
                id: 'S9TTJBAE6',
                name: 'say-hello',
                reason: '',
                result: 'success',
                status: 'complete',
                stderr: [],
                stdout: [
                  {
                    text: 'Hello, Hello World',
                    timestamp: '2024-07-11T15:59:00.138Z',
                  },
                ],
                timing: {
                  end: 1720713540156.5327,
                  start: 1720713539950.0916,
                  elapsed: 206.44137499999988,
                },
                outputs: {},
              },
            ],
            reason: '',
            result: 'success',
            status: 'complete',
            timing: {
              end: 1720713540156.7205,
              start: 1720713539950.051,
              elapsed: 206.66941700000007,
            },
          },
        },
        name: 'hello-world',
        reason: '',
        result: 'success',
        status: 'complete',
        timing: {
          end: 1720713540156.9504,
          start: 1720713539206.6755,
          elapsed: 950.2748339999998,
        },
        tracking_id: '8c4b6cee-668d-4fc4-93ce-5e61a46e9fb8',
      },
    },
  },
  render: args => <Component {...args} />,
};
