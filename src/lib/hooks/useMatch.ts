'use client';
import * as React from 'react';
import { Match } from '../api/types';
import { getMatch } from '../api/adapter';

export function useMatch(id: string) {
  const [data, setData] = React.useState<Match | null>(null);
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<unknown>(undefined);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    getMatch(id)
      .then((m) => { if (mounted) setData(m); })
      .catch((e) => { if (mounted) setError(e); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [id]);

  return { data, isLoading, error };
}
