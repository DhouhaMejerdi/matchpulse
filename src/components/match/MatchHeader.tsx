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
          {/* motion-safe live dot */}
          {isLive && (
            <span
              aria-hidden
              className="live-dot"
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '999px',
                background: 'var(--red-500)',
                marginRight: 6,
                // prefers-reduced-motion: no animation
                animation: 'pulse 1.4s ease-in-out infinite',
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' } as any,
              }}
            />
          )}
          {statusLabel}
        </span>

        <span aria-hidden>•</span>

        <time dateTime={kickoff ?? undefined} title={kickoff ?? undefined}>
          {fmtKickoff(kickoff)}
        </time>

        <span aria-hidden>•</span>
        <span>{league}</span>

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
