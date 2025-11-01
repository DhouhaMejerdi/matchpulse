'use client';
import * as React from 'react';

// Keep core domain shape for the page client
import type { Match } from '@/lib/api/types';
import { getMatch } from '@/lib/api/adapter';

// NEW: focused mock for the match detail page
import { mockMatch } from '@/lib/api/match.mocks';

export function useMatch(id: string) {
  const [data, setData] = React.useState<Match | null>(null);
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<unknown>(undefined);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        // 1) Try the real adapter
        const live = await getMatch(id);
        if (mounted && live) {
          setData(live);
          setError(undefined);
          return;
        }

        // 2) If adapter returns nothing, fall back to local mock
        const m = mockMatch(id); // MatchData: { header, events }
        const fallback: Match = {
          id,
          league: m.header.league,
          kickoff: m.header.kickoff,
          status: m.header.status,
          teams: {
            home: m.header.home,
            away: m.header.away,
          },
          score: m.header.score ?? { home: 0, away: 0, minute: 0 },
          events: m.events,
        };
        if (mounted) {
          setData(fallback);
          setError(undefined);
        }
      } catch (e) {
        // 3) On error, still provide a mock so UI stays usable
        try {
          const m = mockMatch(id);
          const fallback: Match = {
            id,
            league: m.header.league,
            kickoff: m.header.kickoff,
            status: m.header.status,
            teams: {
              home: m.header.home,
              away: m.header.away,
            },
            score: m.header.score ?? { home: 0, away: 0, minute: 0 },
            events: m.events,
          };
          if (mounted) {
            setData(fallback);
            setError(e);
          }
        } catch (mockErr) {
          if (mounted) {
            setData(null);
            setError(e ?? mockErr);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  return { data, isLoading, error };
}
