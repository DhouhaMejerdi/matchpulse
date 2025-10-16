'use client';

import * as React from 'react';
import SegmentedFilter from '@/components/controls/SegmentedFilter';
import { useFixtures } from '@/lib/hooks/useFixtures';
import type { FilterTab } from '@/lib/types/ui';

const FILTER_SEGMENTS: readonly FilterTab[] = ['All', 'Live', 'Upcoming', 'Results'];

export default function HomePage() {
  const [tab, setTab] = React.useState<FilterTab>('All');

  // Stable day key (YYYY-MM-DD) so the fixtures effect doesn't loop
  const dateKey = React.useMemo(() => {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  }, []);

  const { data, isLoading, error } = useFixtures(dateKey); // <- include `error`
  const total = data?.length ?? 0;

  return (
    <section style={{ padding: '24px 0' }}>
      <h1 className="h1" style={{ marginBottom: 8 }}>Today’s Matches</h1>

      <SegmentedFilter<FilterTab>
        segments={FILTER_SEGMENTS}
        value={tab}
        onChange={setTab}
        aria-label="Fixture filter"
      />

      <div className="card" style={{ padding: 16, marginTop: 16 }}>
        {error ? (
          <p className="p">Could not load fixtures.</p>
        ) : isLoading ? (
          <p className="p">Loading fixtures…</p>
        ) : (
          <p className="p">{total} matches found for today.</p>
        )}
      </div>
    </section>
  );
}
