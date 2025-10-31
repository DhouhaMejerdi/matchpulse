'use client';

// =============================================================================
// COMPONENT: FixtureList
// -----------------------------------------------------------------------------
// Responsibility: Render a filtered list of match fixtures. If no matches meet
// the criteria, show an EmptyState with a contextual hint.
// Contracts: Props {
//   matches: Match[];
//   filter: FilterTab;
//   league?: string | null;
// }
// A11y: Renders an unordered list (<ul>) with role="list"; each MatchCard is
//       wrapped in an <li> with role="listitem". Parent regions (e.g. HomePage)
//       should provide region-level labeling.
// Notes: Mobile-first. Styling defined in `_fixture-list.scss` using tokens.
// Owner: Frontend Team • Last updated: 2025-10-30
// =============================================================================

import * as React from 'react';
import EmptyState from '@/components/shared/EmptyState';
import MatchCard from './MatchCard';
import type { Match } from '@/lib/api/types';
import type { FilterTab } from '@/lib/types/ui';

function byFilter(m: Match, filter: FilterTab): boolean {
  switch (filter) {
    case 'Live':
      return (
        m.status === 'LIVE' ||
        m.status === 'HT' ||
        m.status === 'ET' ||
        m.status === 'PEN'
      );
    case 'Upcoming':
      return (
        m.status === 'UPCOMING' ||
        m.status === 'DELAYED' ||
        m.status === 'POSTPONED'
      );
    case 'Results':
      return m.status === 'FT'; // strictly finished matches
    default:
      return true;
  }
}

type Props = {
  matches: Match[];
  filter: FilterTab;
  league?: string | null;
};

export default function FixtureList({
  matches,
  filter,
  league,
}: Props) {
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
    <ul className="fixture-list" role="list">
      {filtered.map((m) => (
        <li key={m.id} className="fixture-list__item" role="listitem">
          <MatchCard
            id={m.id}
            home={{ name: m.teams.home.name, crest: m.teams.home.crest }}
            away={{ name: m.teams.away.name, crest: m.teams.away.crest }}
            status={m.status}
            kickoff={m.kickoff}
            score={m.score}
            league={m.league}
          />
        </li>
      ))}
    </ul>
  );
}
