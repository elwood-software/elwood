'use client';

import {useState, useEffect} from 'react';

export type Org = {id: string; name: string; display_name: string};

export type UseOrgsResult = {
  loading: boolean;
  data: Org[];
};

export function useOrgs(): UseOrgsResult {
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
