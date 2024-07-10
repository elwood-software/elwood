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
      status: 'complete',
      result: 'success',
      report: {
        id: 'E1T315B',
        jobs: {
          hi: {
            id: 'J3JD409',
            name: 'hi',
            steps: [
              {
                id: 'S3TJ2FD3',
                name: 'S3TJ2FD3',
                reason: '',
                result: 'success',
                status: 'complete',
                stderr: [],
                stdout: [
                  {text: 'Hello World', timestamp: '2024-07-09T23:21:11.352Z'},
                ],
                timing: {
                  end: 1720567271478.735,
                  start: 1720567270659.1372,
                  elapsed: 819.5980419999996,
                },
                outputs: {},
              },
              {
                id: 'S8JJ9240',
                name: 'S8JJ9240',
                reason: '',
                result: 'success',
                status: 'complete',
                stderr: [],
                stdout: [],
                timing: {
                  end: 1720567276942.9082,
                  start: 1720567271478.867,
                  elapsed: 5464.041419,
                },
                outputs: {},
              },
              {
                id: 'S9TTJ9BED',
                name: 'S9TTJ9BED',
                reason: '',
                result: 'success',
                status: 'complete',
                stderr: [],
                stdout: [
                  {
                    text: 'To you I say Goodbye World',
                    timestamp: '2024-07-09T23:21:17.241Z',
                  },
                ],
                timing: {
                  end: 1720567277266.8071,
                  start: 1720567276943.0154,
                  elapsed: 323.79170799999883,
                },
                outputs: {},
              },
              {
                id: 'S4JTJ4E89',
                name: 'S4JTJ4E89',
                reason: '',
                result: 'success',
                status: 'complete',
                stderr: [],
                stdout: [
                  {
                    text: 'Toties tutamen candidus arguo. Volubilis reprehenderit comptus beneficium excepturi veritas despecto debilito agnitio tabula.Adipisci carpo adulatio coma strenuus uberrime suffoco ustilo suppellex. Virga animi triduana.',
                    timestamp: '2024-07-09T23:21:19.771Z',
                  },
                  {
                    text: 'Validus urbanus creo despecto vulticulus aequitas conor spiritus uter cursim. Quod tracto demulceo clementia venia vulgo tametsi depromo adicio.Desino viduo creptio bestia depono abeo absorbeo cursus utpote. Paulatim supra dedecor possimus.Cunctatio vehemens creator molestias defungo voluntarius. Canto tolero eius alioqui sponte versus amiculum vinum crustulum.Ago umbra thermae. Comparo compono vergo sperno subito suggero.Repudiandae confero curriculum theca demonstro alioqui cariosus consuasor assumenda tot. Quibusdam suggero eveniet vilitas commodo cometes vos thema victus agnitio.Sulum absens tricesimus. Tardus vinitor cupiditate unus.Laboriosam arceo eveniet tantum catena bellum saepe versus. Cito corona aptus amplitudo theatrum inflammatio appello trado.Appono creptio vado quibusdam. Viriliter accusator voluptatibus cum adhaero.Patruus provident tenus aggredior pax. Adopto atavus decumbo avarus curriculum coadunatio enim.Coruscus summopere conculco. Tantillus bene curto delectus sortitus verecundia.Assentator aggredior sustineo summopere acceptus esse collum cenaculum. Suggero neque colo depono cursim velit.Admitto vaco cernuus decor temporibus utor. Curis natus aliquid.Collum sperno taceo administratio cito complectus voluptate. Cattus vero testimonium aliquid.Coniuratio volutabrum acies verbera vorax claudeo. Quam atqui adopto supplanto veritatis desidero titulus ipsa.Abundans cupiditas suffragium audentia. Tum teres vis acidus.Spero cras solio crastinus thesis ullus brevis territo. Beatae sumptus dolore error coerceo cum ventito.Attonbitus caveo canis tui. Carbo thalassinus patrocinor verumtamen conatus.Umbra caput voluptatem barba. Currus solio amo.',
                    timestamp: '2024-07-09T23:21:19.774Z',
                  },
                ],
                timing: {
                  end: 1720567280265.6624,
                  start: 1720567277267.0034,
                  elapsed: 2998.658877,
                },
                outputs: {},
              },
            ],
            result: 'success',
            status: 'complete',
            timing: {
              end: 1720567280266.2622,
              start: 1720567270658.7996,
              elapsed: 9607.46263,
            },
          },
        },
        name: 'bootstrap',
        reason: '',
        result: 'success',
        status: 'complete',
        timing: {
          end: 1720567280266.5603,
          start: 1720567270658.1045,
          elapsed: 9608.455838000002,
        },
        tracking_id: '8167fad7-2868-4ee3-9850-1a98b38b0897',
      },
    },
  },
  render: args => <Component {...args} />,
};
