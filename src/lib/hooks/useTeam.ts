'use client';
import * as React from 'react';
import { Team } from '../api/types';
import { getTeam } from '../api/adapter';

export function useTeam(id: string) {
  const [data, setData] = React.useState<Team | null>(null);
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<unknown>(undefined);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    getTeam(id)
      .then((t) => { if (mounted) setData(t); })
      .catch((e) => { if (mounted) setError(e); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [id]);

  return { data, isLoading, error };
}
