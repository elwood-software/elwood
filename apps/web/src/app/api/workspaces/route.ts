import {NextResponse} from 'next/server';

export async function GET() {
  return NextResponse.json({
    workspaces: [
      {
        id: '00000000-0000-0000-0000-000000000000',
        name: 'duner-mifflin',
        display_name: 'Duner Mifflin',
        selected: true,
      },
    ],
  });
}
