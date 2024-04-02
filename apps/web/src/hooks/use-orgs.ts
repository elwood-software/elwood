import {useState, useEffect} from 'react';
import {type Platform} from '@elwood/common';

export interface UseOrgsResult {
  isLoading: boolean;
  data: Platform.OrgRecord[];
  error?: Error | null;
}

export function useOrgs(): UseOrgsResult {
  const [value, setValue] = useState<UseOrgsResult>({
    isLoading: false,
    data: getInitialOrgsFromCache(),
    error: undefined,
  });

  useEffect(() => {
    fetchOrgs()
      .then(data => {
        localStorage.setItem('orgs', JSON.stringify(data));
        setValue({
          isLoading: false,
          data,
        });
      })
      .catch(error => {
        setValue({
          isLoading: false,
          data: value.data,
          error: error as Error,
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, []);

  return value;
}

export async function fetchOrgs(): Promise<Platform.OrgRecord[]> {
  const response = await fetch('/api/orgs', {});
  return (await response.json()) as Platform.OrgRecord[];
}

function getInitialOrgsFromCache(): Platform.OrgRecord[] {
  try {
    const orgs = localStorage.getItem('orgs');

    if (orgs) {
      return JSON.parse(orgs) as Platform.OrgRecord[];
    }
  } catch (error) {
    return [];
  }

  return [];
}
