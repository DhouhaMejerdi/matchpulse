'use client';

// =============================================================================
// COMPONENT: MatchCard
// -----------------------------------------------------------------------------
// Responsibility: Compose a single match card from Team, Score, and MatchMeta.
// Contracts: Props { …see original interface… }
// A11y: Provides an aria-label on the Link describing the match.
// Owner: Frontend Team • Last updated: 2025‑10‑30
// =============================================================================

import * as React from 'react';
import Link from 'next/link';
import Team from '@/components/match/Team';
import ScoreComponent from '@/components/match/Score';
import MatchMeta from '@/components/match/MatchMeta';
import { Match, Score } from '@/lib/api/types';

// -- TYPES --------------------------------------------------------------------

export type MatchCardProps = {
  id: string;
  home: { name: string; crest: string };
  away: { name: string; crest: string };
  status: Match['status'];
  kickoff: string;
  score?: Score;
  league: string;
};


export default function MatchCard({
  id,
  home,
  away,
  status,
  kickoff,
  score,
  league,
}: MatchCardProps) {
  // Map league name to a modifier for the league chip
  const leagueMod = React.useMemo(() => {
    const s = (league || '').toLowerCase();
    if (s.includes('premier')) return 'premier';
    if (s.includes('champions')) return 'ucl';
    if (s.includes('la liga')) return 'liga';
    if (s.includes('serie a')) return 'serie';
    if (s.includes('friendly')) return 'friendly';
    return 'generic';
  }, [league]);

  const srLabel = `Open match ${home.name} versus ${away.name}` +
    `${status === 'LIVE' ? ' live' : ''} at ${new Date(kickoff).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <Link href={`/match/${id}`} className="match-card" aria-label={srLabel}>
      <div className="row">
        <Team name={home.name} crest={home.crest} side="home" />
        <ScoreComponent status={status} score={score} />
        <Team name={away.name} crest={away.crest} side="away" />
      </div>
      <MatchMeta
        status={status}
        kickoff={kickoff}
        league={league}
        leagueMod={leagueMod}
        minute={(status === 'LIVE' && score?.minute) || undefined}
      />
    </Link>
  );
}
