'use client';

import * as React from 'react';
import SegmentedFilter from '@/components/controls/SegmentedFilter';
import { useFixtures } from '@/lib/hooks/useFixtures';
import type { FilterTab } from '@/lib/types/ui';
import FixtureList from '@/components/match/FixtureList';
import DateToolbar from '@/components/layout/DateToolbar';
import LeaguePicker from '@/components/controls/LeaguePicker';

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
  const matches = data ?? [];

  // derive unique leagues from the fetched data
  const leagueOptions = React.useMemo(
    () => Array.from(new Set(matches.map(m => m.league))).sort(),
    [matches]
  );

  const filteredMatches = React.useMemo(() => {
    if (!matches.length) return [];
    return matches.filter((m) => {
      const leagueMatch = !league || m.league === league;           // ⬅️ league filter
      const tabMatch =
        tab === 'All' ||
        (tab === 'Live' && m.status === 'LIVE') ||
        (tab === 'Upcoming' && m.status === 'UPCOMING') ||
        (tab === 'Results' && (m.status === 'FT' || m.status === 'HT'));
      return leagueMatch && tabMatch;
    });
  }, [matches, league, tab]);

  const goPrev = () => setOffsetDays((n) => n - 1); // ⬅️ previous day
  const goNext = () => setOffsetDays((n) => n + 1); // ⬅️ next day
  const goToday = () => setOffsetDays(0);           // ⬅️ (optional quick reset)

  const fixtureRegionId = 'fixtures-region';
  const tabIdPrefix = 'filter-tab';
  return (
    <section style={{ padding: '24px 0' }}>
      {/* ⬇️ Hero row: title + date switcher */}
      <div
        className="container"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
      >
        <h1 className="h1" style={{ marginBottom: 8 }}>Today’s Matches</h1>

        <DateToolbar
          label={humanLabel}
          onPrev={goPrev}
          onNext={goNext}
          onToday={goToday}
        />
      </div>

      {/* NEW: keep layout consistent + expose a landmark for SR users */}
      <div className="container" style={{ marginTop: 12 }}>
        <SegmentedFilter<FilterTab>
          segments={FILTER_SEGMENTS}
          value={tab}
          onChange={setTab}
          aria-label="Fixture filter"
          ariaControlsId={fixtureRegionId}
          idPrefix={tabIdPrefix}          
        />

        {/* NEW: League Picker, not yet hooked to list filtering */}
        <LeaguePicker leagues={leagueOptions} value={league} onChange={setLeague} label="League" />
      </div>
      
        <div 
          id={fixtureRegionId}
          role="region"
          aria-label="Fixtures for selected date and filter"
          aria-labelledby={`${tabIdPrefix}-${tab}`}  // NEW: reference active tab id
          style={{ marginTop: 16 }}
        >
          {error ? (
            <div className="card" style={{ padding: 16 }}><p className="p">Could not load fixtures.</p></div>
          ) : isLoading ? (
            <div className="card" style={{ padding: 16 }}><p className="p">Loading fixtures…</p></div>
          ) : (
            <FixtureList matches={filteredMatches} filter={tab} />
          )}
        </div>
    </section>
  );
}
