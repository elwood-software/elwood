export async function GET() {
  const response = await fetch(
    'https://api.github.com/repos/elwood-software/desktop/releases',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.GH_RELEASES_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );

  console.log(await response.text());

  return Response.redirect(
    'https://github.com/elwood-software/desktop/releases/download/v0.0.1/Elwood-0.0.1.dmg',
    302,
  );
}
