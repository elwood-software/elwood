import {NextResponse} from 'next/server';

export async function GET() {
  return NextResponse.json({
    orgs: [
      {
        id: crypto.randomUUID(),
        name: 'duner-mifflin',
        display_name: 'Duner Mifflin',
      },
    ],
  });
}
