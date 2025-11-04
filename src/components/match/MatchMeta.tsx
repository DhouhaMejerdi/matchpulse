'use client';

import * as React from 'react';
import StatusBadge from '@/components/match/StatusBadge';
import type { Match } from '@/lib/api/types';
import type { StatusCode } from '@/lib/status/codes';

type MatchMetaProps = {
  status: Match['status'];
  kickoff: string;
  league: string;
  leagueMod: string;
  minute?: number;
};

function formatKickoff(iso: string): string {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(d);
  } catch {
    return '—';
  }
}

export default function MatchMeta({
  status,
  kickoff,
  league,
  leagueMod,
  minute = 0,
}: MatchMetaProps) {
  const timeLabel =
    status === 'LIVE' ? (
      <>
        <span className="live-dot" aria-hidden="true"></span>
        Live · {minute}′
      </>
    ) : (
      formatKickoff(kickoff)
    );

  return (
    <div className="meta">
      <span className="meta__item">
        <StatusBadge code={(status as StatusCode) ?? 'TBD'} />
      </span>
      <span className="meta__item">{timeLabel}</span>
      <span className="meta__item">
        <span className={`league-chip league-chip--${leagueMod}`} title={league}>
          {league}
        </span>
      </span>
    </div>
  );
}
