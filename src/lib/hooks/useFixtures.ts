'use client';
import * as React from 'react';
import { Match } from '../api/types';
import { getFixtures } from '../api/adapter';

type State = { data: Match[] | undefined; isLoading: boolean; error: unknown };

export function useFixtures(dateISO: string): State {
  const [state, setState] = React.useState<State>({ data: undefined, isLoading: true, error: undefined });

  React.useEffect(() => {
    let mounted = true;
    setState({ data: undefined, isLoading: true, error: undefined });
    getFixtures(dateISO)
      .then((data) => { if (mounted) setState({ data, isLoading: false, error: undefined }); })
      .catch((e) => { if (mounted) setState({ data: undefined, isLoading: false, error: e }); });
    return () => { mounted = false; };
  }, [dateISO]);

  return state;
}
