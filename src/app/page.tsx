'use client';

import * as React from 'react';
import SegmentedFilter from '@/components/controls/SegmentedFilter';
import { useFixtures } from '@/lib/hooks/useFixtures';
import type { FilterTab } from '@/lib/types/ui';
import FixtureList from '@/components/match/FixtureList';

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

  /** ⬇️ New: track day offset from “today” (0 = today) */
  const [offsetDays, setOffsetDays] = React.useState(0);

  /** ⬇️ Stable UTC dayKey derived from offset */
  const dateKey = React.useMemo(() => getUtcDateKey(offsetDays), [offsetDays]);

  /** ⬇️ Human label derived from dayKey */
  const humanLabel = React.useMemo(() => formatHuman(dateKey), [dateKey]);

  const { data, isLoading, error } = useFixtures(dateKey); // <- include `error`
  const matches = data ?? [];

  const goPrev = () => setOffsetDays((n) => n - 1); // ⬅️ previous day
  const goNext = () => setOffsetDays((n) => n + 1); // ⬅️ next day
  const goToday = () => setOffsetDays(0);           // ⬅️ (optional quick reset)

  // 1) Add this handler inside HomePage (below goPrev/goNext/goToday)
  const onToolbarKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    },
    [goPrev, goNext]
  );

  return (
    <section style={{ padding: '24px 0' }}>
      {/* ⬇️ Hero row: title + date switcher */}
      <div
        className="container"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
      >
        <h1 className="h1" style={{ marginBottom: 8 }}>Today’s Matches</h1>

        <div aria-label="Change date" role="toolbar" aria-keyshortcuts="ArrowLeft, ArrowRight" tabIndex={0} onKeyDown={onToolbarKeyDown} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous day"
            title="Previous day"
            style={{ padding: '6px 10px', borderRadius: 8 }}
          >
            ←
          </button>

          {/* Human-readable label */}
          <strong className="small" aria-live="polite" aria-atomic="true" style={{ minWidth: 120, textAlign: 'center' }}>
            {humanLabel}
          </strong>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next day"
            title="Next day"
            style={{ padding: '6px 10px', borderRadius: 8 }}
          >
            →
          </button>

          {/* Optional tiny “Today” reset; comment out if you don’t want it visible */}
          <button
            type="button"
            onClick={goToday}
            aria-label="Go to today"
            title="Go to today"
            className="small"
            style={{ padding: '6px 10px', borderRadius: 8 }}
          >
            Today
          </button>
        </div>
      </div>

      <SegmentedFilter<FilterTab>
        segments={FILTER_SEGMENTS}
        value={tab}
        onChange={setTab}
        aria-label="Fixture filter"
      />

      <div style={{ marginTop: 16 }}>
        {error ? (
          <div className="card" style={{ padding: 16 }}><p className="p">Could not load fixtures.</p></div>
        ) : isLoading ? (
          <div className="card" style={{ padding: 16 }}><p className="p">Loading fixtures…</p></div>
        ) : (
          <FixtureList matches={matches} filter={tab} />
        )}
      </div>
    </section>
  );
}
