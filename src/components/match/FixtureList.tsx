'use client';
import EmptyState from '@/components/shared/EmptyState';
import MatchCard from './MatchCard';
import type { Match } from '@/lib/api/types';
import type { FilterTab } from '@/lib/types/ui';

function byFilter(m: Match, filter: FilterTab) {
  switch (filter) {
    case 'Live':
      return m.status === 'LIVE';
    case 'Upcoming':
      return m.status === 'UPCOMING';
    case 'Results':
      return m.status === 'FT';
    default:
      return true;
  }
}

export default function FixtureList({
  matches,
  filter,
}: {
  matches: Match[];
  filter: FilterTab;
}) {
  const filtered = matches.filter((m) => byFilter(m, filter));

  if (filtered.length === 0) {
    return (
      <EmptyState
        title="No matches"
        hint="Try a different filter or date."
      />
    );
    }

  return (
    <div className="fixture-list">
      {filtered.map((m) => (
        <MatchCard
          key={m.id}
          id={m.id}
          home={{ name: m.teams.home.name, crest: m.teams.home.crest }}
          away={{ name: m.teams.away.name, crest: m.teams.away.crest }}
          status={m.status}
          kickoff={m.kickoff}
          score={m.score}
          league={m.league}
        />
      ))}
    </div>
  );
}
