#!/usr/bin/env -S deno run --allow-run --allow-net --allow-env --allow-read

import {loadSync} from 'https://deno.land/std@0.220.1/dotenv/mod.ts';
import {assert} from 'https://deno.land/std@0.217.0/assert/mod.ts';
import {
  createClient,
  type SupabaseClient,
} from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import {contentType} from 'https://deno.land/std@0.217.0/media_types/mod.ts';
import {extname} from 'https://deno.land/std@0.217.0/path/mod.ts';
import {Spinner} from 'https://deno.land/std@0.221.0/cli/mod.ts';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SEED_REPO_GITHUB_NAME = 'elwood-studio/seed';
const spin = new Spinner();

loadSync({
  envPath: path.join(__dirname, '../.env'),
  export: true,
});

const ghToken = Deno.env.get('GITHUB_TOKEN');

if (ghToken) {
  console.log('using GITHUB_TOKEN');
}

try {
  spin.start();

  let API_URL = Deno.env.get('SUPABASE_URL');
  let SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!API_URL) {
    spin.message = 'Fetching API_URL from supabase status';

    const cmd = new Deno.Command('supabase', {
      args: ['status', '-o', 'json'],
    });

    const {code, stdout} = await cmd.output();

    assert(code === 0, 'Failed to run supabase status');

    try {
      const status = JSON.parse(new TextDecoder().decode(stdout).toString());
      API_URL = status.API_URL;
      SERVICE_ROLE_KEY = status.SERVICE_ROLE_KEY;
    } catch (err) {
      throw new Error(`Failed to parse supabase status output: ${err.message}`);
    }
  }

  assert(API_URL, 'API_URL is missing');
  assert(SERVICE_ROLE_KEY, 'SERVICE_ROLE_KEY is missing');

  spin.message = `Using API_URL: ${API_URL}`;

  const client = createClient(API_URL, SERVICE_ROLE_KEY, {
    global: {
      headers: {
        Authentication: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    },
  });

  await buildSeedFromRepoPath(client, '');

  await client.storage.emptyBucket('Public');
  await client.storage.deleteBucket('Public');

  const bucketResult = await client.storage.createBucket('Public', {
    public: true,
  });

  assert(bucketResult.data, 'Failed to create bucket');

  const objResult = await client.storage
    .from('Public')
    .upload('readme.md', '# Welcome to Elwood', {
      contentType: 'text/markdown',
    });

  assert(
    objResult.data,
    `Failed to upload object (readme.md) with error "${objResult.error?.message}"`,
  );

  spin.stop();
} catch (err) {
  spin.stop();
  console.error(err);
  Deno.exit(1);
}

async function buildSeedFromRepoPath(
  client: SupabaseClient,
  path = '',
): Promise<void> {
  spin.message = `fetching ${path}...`;

  const result = await fetch(
    `https://api.github.com/repos/${SEED_REPO_GITHUB_NAME}/contents/${path}`,
    {
      headers: {
        ...(ghToken ? {Authorization: `Bearer ${ghToken}`} : {}),
      },
    },
  );

  !result.ok && console.log(await result.text());

  assert(result.ok, `Failed to fetch seed repo path "${path}"`);

  const body = await result.json();

  if (!Array.isArray(body)) {
    const [bucketName, ...pathName] = body.path.split('/');
    const resp = await fetch(body.download_url);

    const objResult = await client.storage
      .from(bucketName)
      .upload(pathName.join('/'), await resp.blob(), {
        contentType:
          contentType(extname(body.name)) ?? 'application/octet-stream',
      });

    assert(
      objResult.data,
      `Failed to upload object (${name}) with error "${objResult.error?.message}"`,
    );

    return;
  }

  if (path == '') {
    for (const item of body) {
      if (item.type == 'file') {
        continue;
      }

      await client.storage.emptyBucket(item.name);
      await client.storage.deleteBucket(item.name);

      const bucketResult = await client.storage.createBucket(item.name, {
        public: false,
      });

      assert(bucketResult.data, 'Failed to create bucket');

      await buildSeedFromRepoPath(client, item.path);
    }
  } else {
    for (const item of body) {
      const [bucketName, ...pathName] = item.path.split('/');

      if (item.type === 'file') {
        await buildSeedFromRepoPath(client, item.path);
      }

      if (item.type === 'dir') {
        pathName.push('.emptyFolderPlaceholder');

        const name = pathName.join('/');
        const objResult = await client.storage
          .from(bucketName)
          .upload(name, ':0', {
            contentType:
              contentType(extname(item.name)) ?? 'application/octet-stream',
          });

        assert(
          objResult.data,
          `Failed to create folder (${name}) with error "${objResult.error?.message}"`,
        );

        await buildSeedFromRepoPath(client, item.path);
      }
    }
  }
}
