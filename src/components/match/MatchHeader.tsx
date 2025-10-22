'use client';

import * as React from 'react';
import Image from 'next/image';
import type { Match, TeamMini } from '@/lib/api/types';
import { STATUS_LABELS } from '@/lib/utils/statusMap';

export type MatchHeaderProps = {
  home: TeamMini;
  away: TeamMini;
  score?: { home: number; away: number } | null;
  status: Match['status'];
  league: string;
  kickoff?: string | null; // ISO
  venue?: string | null;
};

function fmtKickoff(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(d);
}

export default function MatchHeader({
  home, away, score, status, league, kickoff, venue,
}: MatchHeaderProps) {
  const isLive = status === 'LIVE';
  const statusLabel = STATUS_LABELS[status] ?? status;

  // NEW: map league name → chip modifier (same logic as MatchCard)
  const leagueMod = React.useMemo(() => {
    const s = (league || '').toLowerCase();
    if (s.includes('premier')) return 'premier';
    if (s.includes('champions')) return 'ucl';
    if (s.includes('la liga')) return 'liga';
    if (s.includes('serie a')) return 'serie';
    if (s.includes('friendly')) return 'friendly';
    return 'generic';
  }, [league]);

  return (
    <header className="card match-header" style={{ padding: 16, marginTop: 8, marginBottom: 16 }}>
      {/* Screen-reader page title */}
      <h1 className="sr-only">
        {home.name} vs {away.name}
      </h1>

      <div className="match-title">
        <div className="match-title__team">
          <Image
            src={home.crest}
            alt=""
            width={20}
            height={20}
            sizes="20px"
            unoptimized
            aria-hidden
            className="match-title__crest"
          />
          <span>{home.name}</span>
        </div>

        <div
          className="match-title__score"
          aria-live={isLive ? 'polite' : 'off'}
          aria-atomic="true"
        >
          {score ? `${score.home} — ${score.away}` : 'vs'}
        </div>

        <div className="match-title__team" style={{ justifyContent: 'flex-end' }}>
          <span>{away.name}</span>
          <Image
            src={away.crest}
            alt=""
            width={20}
            height={20}
            sizes="20px"
            unoptimized
            aria-hidden
            className="match-title__crest"
          />
        </div>
      </div>

      <div className="match-sub" role="group" aria-label="Match details">
        <span className={`status status--${status.toLowerCase()}`}>
          {isLive && <span aria-hidden className="live-dot" />}
          {statusLabel}
        </span>
        
        <span aria-hidden>•</span>

        <time dateTime={kickoff ?? undefined} title={kickoff ?? undefined}>
          {fmtKickoff(kickoff)}
        </time>

        <span aria-hidden>•</span>
        {/* NEW: league chip with modifier + title */}
        <span className={`league-chip league-chip--${leagueMod}`} title={league}>
          {league}
        </span>

        {venue ? (
          <>
            <span aria-hidden>•</span>
            <span>{venue}</span>
          </>
        ) : null}
      </div>
    </header>
  );
}
