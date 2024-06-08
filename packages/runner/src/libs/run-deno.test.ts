import {assertEquals} from '@std/assert';

import {permissionObjectToFlags} from './run-deno.ts';

Deno.test('permissionObjectToFlags()', function () {
  assertEquals(
    permissionObjectToFlags({
      env: true,
    }),
    ['--allow-env'],
  );

  assertEquals(
    permissionObjectToFlags({
      env: ['a', 'b'],
    }),
    ['--allow-env=a,b'],
  );

  assertEquals(
    permissionObjectToFlags({
      env: 'inherit',
    }),
    [],
  );

  assertEquals(
    permissionObjectToFlags({
      env: false,
    }),
    [],
  );

  assertEquals(
    permissionObjectToFlags({
      env: true,
      ffi: [new URL('https://elwood.dev')],
    }),
    ['--allow-env', '--allow-ffi=https://elwood.dev/'],
  );
});
