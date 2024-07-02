'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';

import {Spinner} from '@elwood/ui';

export default function Page() {
  const [orgs, setOrgs] = useState<Array<{
    id: string;
    name: string;
    display_name: string;
  }> | null>(null);

  useEffect(() => {
    fetch('/api/orgs')
      .then(resp => resp.json())
      .then(data => data.orgs)
      .then(setOrgs);
  }, []);

  return (
    <div className="p-12">
      {orgs === null && <Spinner />}

      {orgs &&
        orgs.map(item => (
          <Link key={item.id} href={`/${item.name}`}>
            {item.display_name}
          </Link>
        ))}
    </div>
  );
}
