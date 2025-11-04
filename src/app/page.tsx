'use client';

import * as React from 'react';
import { useFixtures } from '@/lib/hooks/useFixtures';
import type { FilterTab } from '@/lib/types/ui';
import FixtureList from '@/components/match/FixtureList';
import HeroHeader from '@/components/layout/HeroHeader';
import ControlsBar from '@/components/layout/ControlsBar';

const FILTER_SEGMENTS: readonly FilterTab[] = ['All', 'Live', 'Upcoming', 'Results'];

/** ⬇️ Helpers kept local to keep the change single-file & testable */
function getUtcDateKey(offsetDays = 0): string {
  const now = new Date();
  // Make a copy and normalize to UTC midnight, then apply offset
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function formatHuman(dateKey: string, locale?: string): string {
  // YYYY-MM-DD → Date at UTC midnight (to avoid TZ drift)
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat(locale || undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
  }).format(dt); // e.g., "Thu, Oct 16"
}

export default function HomePage() {
  const [tab, setTab] = React.useState<FilterTab>('All');
  const [league, setLeague] = React.useState<string | null>(null);

  /** ⬇️ New: track day offset from “today” (0 = today) */
  const [offsetDays, setOffsetDays] = React.useState(0);

  /** ⬇️ Stable UTC dayKey derived from offset */
  const dateKey = React.useMemo(() => getUtcDateKey(offsetDays), [offsetDays]);

  /** ⬇️ Human label derived from dayKey */
  const humanLabel = React.useMemo(() => formatHuman(dateKey), [dateKey]);

  const { data, isLoading, error } = useFixtures(dateKey); // <- include `error`
  const matches = React.useMemo(() => data ?? [], [data]);

  // derive unique leagues from the fetched data
  const leagueOptions = React.useMemo(
    () => Array.from(new Set(matches.map(m => m.league))).sort(),
    [matches]
  );

  const filteredByLeague = React.useMemo(() => {
    if (!matches.length) return [];
    return !league ? matches : matches.filter((m) => m.league === league);
  }, [matches, league]);

  const goPrev = () => setOffsetDays((n) => n - 1); // ⬅️ previous day
  const goNext = () => setOffsetDays((n) => n + 1); // ⬅️ next day
  const goToday = () => setOffsetDays(0);           // ⬅️ (optional quick reset)

  const fixtureRegionId = 'fixtures-region';
  const tabIdPrefix = 'filter-tab';

  return (
    <>
      <section className="container">
        <HeroHeader
          title="Today’s Matches"
          dateLabel={humanLabel}
          onPrev={goPrev}
          onNext={goNext}
          onToday={goToday}
        />
      </section>

      <section className="container">
        <ControlsBar
          segments={FILTER_SEGMENTS}
          value={tab}
          onChange={setTab}
          leagueOptions={leagueOptions}
          league={league}
          onLeagueChange={setLeague}
          sticky
        />
      </section>

      <section className="container">
        <div
          id={fixtureRegionId}
          className="fixtures-region"
          role="region"
          aria-label="Fixtures for selected date and filter"
          aria-labelledby={`${tabIdPrefix}-${tab}`}
        >
          {error ? (
            <div className="card">
              <p className="p">Could not load fixtures.</p>
            </div>
          ) : isLoading ? (
            <div className="card">
              <p className="p">Loading fixtures…</p>
            </div>
          ) : (
            <FixtureList matches={filteredByLeague} filter={tab} league={league} />
          )}
        </div>
      </section>
    </>
  );
}
