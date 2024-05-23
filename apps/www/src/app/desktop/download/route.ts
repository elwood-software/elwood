import {type NextRequest} from 'next/server';
import type {JsonObject} from '@elwood/common';

type Platform = 'mac' | 'win' | 'linux';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const p = (searchParams.get('p') ?? 'mac') as Platform;
  const a = searchParams.get('a') ?? 'default';
  const f = searchParams.get('f') ?? 'zip';

  const response = await fetch(
    'https://api.github.com/repos/elwood-software/desktop/releases?per_page=1',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.GH_RELEASES_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );

  const body = (await response.json()) as Array<{
    tag_name: string;
    assets: Array<{
      name: string;
      browser_download_url: string;
    }>;
  }>;

  const urls: Record<Platform, JsonObject> = {
    mac: {
      arm64: {
        dmg: '',
        zip: '',
      },
      default: {
        dmg: '',
        zip: '',
      },
    },
    win: {
      x64: {
        exe: '',
        zip: '',
      },
    },
    linux: {
      x64: {
        deb: '',
        rpm: '',
        tar: '',
      },
    },
  };

  for (const asset of body[0].assets) {
    if (asset.name.endsWith('arm64.dmg')) {
      urls.mac.arm64.dmg = asset.browser_download_url;
    } else if (asset.name.endsWith('arm64-mac.zip')) {
      urls.mac.arm64.zip = asset.browser_download_url;
    } else if (asset.name.endsWith('.dmg')) {
      urls.mac.default.dmg = asset.browser_download_url;
    } else if (asset.name.endsWith('mac.zip')) {
      urls.mac.default.zip = asset.browser_download_url;
    }
  }

  if (request.headers.get('accept') === 'application/json') {
    return Response.json({
      v: body[0].tag_name,
      urls,
    });
  }

  const url = urls[p][a][f] ?? null;

  if (url) {
    return Response.redirect(url, 302);
  }

  return Response.redirect('/desktop?error=unknown', 302);
}
