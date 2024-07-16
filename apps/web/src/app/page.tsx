'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';

import {WorkspaceSpaceSelectPage} from '@elwood/react';
import {useRouter} from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const [orgs, setOrgs] = useState<Array<{
    id: string;
    name: string;
    display_name: string;
  }> | null>(null);

  useEffect(() => {
    fetch('/api/orgs')
      .then(resp => resp.json())
      .then(data => data.orgs)
      .then(orgs_ => {
        setOrgs(orgs_);

        if (orgs_.length === 1) {
          router.push(`/${orgs_[0].name}`);
        }
      });
  }, []);

  return (
    <WorkspaceSpaceSelectPage
      loading={orgs === null}
      workspaces={(orgs ?? []).map(item => ({
        ...item,
        displayName: item.display_name,
      }))}
      onClick={e => {
        router.push(e.currentTarget.href as string);
      }}
    />
  );
}
