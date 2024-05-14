#!/usr/bin/env -S deno run --allow-run --allow-net --allow-env --allow-read

/**
 *
 * publish-release.ts
 *
 * This script will publish a new release to NPM from the
 * local env.
 *
 * adapted with gratitude from: https://github.com/vercel/next.js/blob/canary/scripts/start-release.js
 */

import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'https://deno.land/std@0.224.0/cli/mod.ts';
import {loadSync} from 'https://deno.land/std@0.220.1/dotenv/mod.ts';

const SEMVER_TYPES = ['patch', 'minor', 'major'];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env');

const args = parseArgs<{releaseType: string; semverType: string}>(Deno.args);
const {releaseType = 'stable', semverType} = args;
const isCanary = releaseType !== 'stable';

if (releaseType !== 'stable' && releaseType !== 'canary') {
  fail(`Invalid release type ${releaseType}, must be stable or canary`);
}

if (!isCanary && !SEMVER_TYPES.includes(semverType)) {
  fail(
    `Invalid semver type ${semverType}, must be one of ${SEMVER_TYPES.join(
      ', ',
    )}`,
  );
}

loadSync({
  envPath,
  export: true,
});

const nodeAuthToken = Deno.env.get('NODE_AUTH_TOKEN');

if (!nodeAuthToken) {
  fail(`Missing NODE_AUTH_TOKEN`);
}

console.log('running pnpm release');
const cmd = new Deno.Command('pnpm', {
  args: ['-r', 'publish', '--access=public', '--no-git-checks', '--force'],
  stdout: 'inherit',
  stderr: 'inherit',
  cwd: path.join(__dirname, '..'),
  env: {
    GITHUB_TOKEN: nodeAuthToken!,
  },
});

const {code} = await cmd.output();

console.log('pnpm release done with code: ' + code);

Deno.exit(code);

function fail(message: string) {
  console.error(message);
  Deno.exit(1);
}
