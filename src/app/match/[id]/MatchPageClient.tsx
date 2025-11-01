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

export default function MatchPageClient({ id }: { id: string }) {
  const { data: match, isLoading, error } = useMatch(id);
  const [tab, setTab] = React.useState<MatchTab>('timeline');

  if (error) {
    return (
      <section className="match-page container" aria-labelledby="match-page-title">
        <h1 id="match-page-title" className="sr-only">Match</h1>
        <p className="small match-page__back"><Link href="/">← Back to matches</Link></p>
        <div className="match-page__card"><p className="p">Could not load match.</p></div>
      </section>
    );
  }

  if (isLoading || !match) {
    return (
      <section className="match-page container" aria-labelledby="match-page-title">
        <h1 id="match-page-title" className="sr-only">Match</h1>
        <p className="small match-page__back"><Link href="/">← Back to matches</Link></p>
        <div className="match-page__card"><p className="p">Loading match…</p></div>
      </section>
    );
  }

  const { teams, score, status, league, kickoff, events = [] } = match;

  // IDs to link tabs ↔ panel for SR users
  const panelId = 'match-tabs-panel';

  return (
    <section className="match-page container" aria-labelledby="match-page-title">
      {/* SR title to announce page context */}
      <h1 id="match-page-title" className="sr-only">
        {match.teams.home.name} vs {match.teams.away.name}
      </h1>

      <p className="small match-page__back"><Link href="/">← Back to matches</Link></p>

      <MatchHeader
        home={{ id: teams.home.id, name: teams.home.name, crest: teams.home.crest }}
        away={{ id: teams.away.id, name: teams.away.name, crest: teams.away.crest }}
        score={score}
        status={status}
        league={league}
        kickoff={kickoff}
      />

      <div className="match-page__tabs">
        <Tabs<MatchTab>
          items={MATCH_TABS}
          value={tab}
          onChange={setTab}
          aria-label="Match sections"
        />
      </div>

      <div
        id={panelId}
        className="match-page__panel"
        role="region"
      >
        {tab === 'timeline' && (
          <div className="match-page__card">
            {events.length ? (
              <Timeline events={events} homeId={teams.home.id} awayId={teams.away.id} />
            ) : (
              <p className="p">No events yet.</p>
            )}
          </div>
        )}

        {tab === 'stats' && (
          <div className="match-page__card">
            <p className="p">Stats placeholder.</p>
          </div>
        )}

        {tab === 'lineups' && (
          <div className="match-page__card">
            <p className="p">Lineups placeholder.</p>
          </div>
        )}

        {tab === 'highlights' && (
          <div className="match-page__card">
            <p className="p">Highlights placeholder.</p>
          </div>
        )}
      </div>
    </section>
  );
}
