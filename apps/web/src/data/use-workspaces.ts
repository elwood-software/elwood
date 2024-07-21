'use client';

import {useState, useEffect} from 'react';
import type {Platform} from '@elwood/common';

export type UseWorkspacesResult = {
  loading: boolean;
  data: Platform.Workspace[];
};

export function useWorkspaces(): UseWorkspacesResult {
  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState<Org[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/orgs')
      .then(resp => resp.json())
      .then(data => data.orgs)
      .then(setOrgs)
      .finally(() => setLoading(false));
  }, []);

  return {
    loading,
    data: orgs,
  };
}
