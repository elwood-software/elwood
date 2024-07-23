'use client';

import {useState, useEffect} from 'react';
import type {Platform} from '@elwood/common';

export type UseWorkspacesResult = {
  loading: boolean;
  data: Platform.Workspace[];
};

export function useWorkspaces(): UseWorkspacesResult {
  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState<Platform.Workspace[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/workspaces')
      .then(resp => resp.json())
      .then(data =>
        (
          data.workspaces as {id: string; name: string; display_name: string}[]
        ).map(item => ({
          id: item.id,
          name: item.name,
          displayName: item.display_name,
        })),
      )
      .then(setOrgs)
      .finally(() => setLoading(false));
  }, []);

  return {
    loading,
    data: orgs,
  };
}
