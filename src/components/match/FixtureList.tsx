'use client';
import EmptyState from '@/components/shared/EmptyState';
import MatchCard from './MatchCard';
import type { Match } from '@/lib/api/types';
import type { FilterTab } from '@/lib/types/ui';

function byFilter(m: Match, filter: FilterTab) {
  switch (filter) {
    case 'Live':
      return m.status === 'LIVE' || m.status === 'HT' || m.status === 'ET' || m.status === 'PEN';
    case 'Upcoming':
      return m.status === 'UPCOMING' || m.status === 'DELAYED' || m.status === 'POSTPONED';
    case 'Results':
      return m.status === 'FT'; // keep strict; or include canceled if you prefer
    default:
      return true;
  }
}

export default function FixtureList({
  matches,
  filter,
  league,                 // ⬅️ NEW (optional) to build a better hint
}: {
  matches: Match[];
  filter: FilterTab;
  league?: string | null;
}) {
  const filtered = matches.filter((m) => byFilter(m, filter));

  if (filtered.length === 0) {
    const hint = (() => {
      const tips: string[] = [];
      if (league) tips.push('clear the league filter');
      if (filter !== 'All') tips.push('switch to “All”');
      tips.push('pick another date');
      return `Try to ${tips.slice(0, 2).join(' or ')}.`;
    })();

    return <EmptyState title="No matches for this filter." hint={hint} />;
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
