'use client';

import * as React from 'react';
import Link from 'next/link';
import Tabs from '@/components/controls/Tabs';
import Timeline from '@/components/match/Timeline';
import { useMatch } from '@/lib/hooks/useMatch';
import MatchHeader from '@/components/match/MatchHeader';

type MatchTab = 'timeline' | 'stats' | 'lineups' | 'highlights';

const MATCH_TABS = [
  { value: 'timeline', label: 'Timeline' },
  { value: 'stats', label: 'Stats' },
  { value: 'lineups', label: 'Lineups' },
  { value: 'highlights', label: 'Highlights' },
] as const;

function fmtKickoff(iso?: string) {
  if (!iso) return '—';
  const d = new Date(iso);
  return new Intl.DateTimeFormat(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' }).format(d);
}

export default function MatchPageClient({ id }: { id: string }) {
  const { data: match, isLoading, error } = useMatch(id);
  const [tab, setTab] = React.useState<MatchTab>('timeline');

  if (error) {
    return (
      <section style={{ padding: '24px 0' }}>
        <p className="small"><Link href="/">← Back to matches</Link></p>
        <div className="card" style={{ padding: 16 }}><p className="p">Could not load match.</p></div>
      </section>
    );
  }

  if (isLoading || !match) {
    return (
      <section style={{ padding: '24px 0' }}>
        <p className="small"><Link href="/">← Back to matches</Link></p>
        <div className="card" style={{ padding: 16 }}><p className="p">Loading match…</p></div>
      </section>
    );
  }

  const { teams, score, status, league, kickoff, events = [] } = match;

  return (
    <section style={{ padding: '24px 0' }}>
      <p className="small"><Link href="/">← Back to matches</Link></p>

      <MatchHeader
        home={{ id: teams.home.id, name: teams.home.name, crest: teams.home.crest }}
        away={{ id: teams.away.id, name: teams.away.name, crest: teams.away.crest }}
        score={score}
        status={status}
        league={league}
        kickoff={kickoff}
      />

      <Tabs<MatchTab>
        items={MATCH_TABS}
        value={tab}
        onChange={setTab}
        aria-label="Match sections"
      />

      <div style={{ marginTop: 12 }}>
        {tab === 'timeline' && (
          <div className="card" style={{ padding: 16 }}>
            {events.length ? (
              <Timeline events={events} homeId={teams.home.id} awayId={teams.away.id} />
            ) : (
              <p className="p">No events yet.</p>
            )}
          </div>
        )}
        {tab === 'stats' && <div className="card" style={{ padding: 16 }}><p className="p">Stats placeholder.</p></div>}
        {tab === 'lineups' && <div className="card" style={{ padding: 16 }}><p className="p">Lineups placeholder.</p></div>}
        {tab === 'highlights' && <div className="card" style={{ padding: 16 }}><p className="p">Highlights placeholder.</p></div>}
      </div>
    </section>
  );
}
