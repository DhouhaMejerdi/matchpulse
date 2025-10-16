'use client';
import * as React from 'react';
import { useFixtures } from "@/lib/hooks/useFixtures";
import SegmentedFilter from '@/components/controls/SegmentedFilter';

export default function Home() {
  const [tab, setTab] = React.useState<'All'|'Live'|'Upcoming'|'Results'>('All');
  
  // Stable “day key” like 2025-10-16 (does not change every render)
  const dateKey = React.useMemo(() => {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  }, []);

  const { data, isLoading } = useFixtures(dateKey);
  const total = data?.length ?? 0;

  return (
    <section style={{ padding: '24px 0' }}>
      <h1 className="h1" style={{ marginBottom: 8 }}>
        Today’s Matches
      </h1>
      <SegmentedFilter segments={['All','Live','Upcoming','Results']} value={tab} onChange={(v)=>setTab(v as any)} aria-label="Fixture filter" />
      <div className="card" style={{ padding: 16, marginTop: 16 }}>
        {isLoading ? <p className="p">Loading fixtures…</p> : <p className="p">{total} matches found for today.</p>}
      </div>
    </section>
    
  );
}
