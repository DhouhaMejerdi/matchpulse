'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Match, Score } from '@/lib/api/types';
import { STATUS_LABELS } from '@/lib/utils/statusMap';

export type MatchCardProps = {
  id: string;
  home: { name: string; crest: string };
  away: { name: string; crest: string };
  status: Match['status'];
  kickoff: string; // ISO
  score?: Score;
  league: string;
};

function formatKickoff(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return '—';
  }
}

export default function MatchCard(props: MatchCardProps) {
  const { id, home, away, status, kickoff, score, league } = props;

  const isLive = status === 'LIVE';
  const statusLabel = STATUS_LABELS[status] ?? status;

  // NEW: map league name → chip modifier
  const leagueMod = React.useMemo(() => {
    const s = (league || '').toLowerCase();
    if (s.includes('premier')) return 'premier';
    if (s.includes('champions')) return 'ucl';
    if (s.includes('la liga')) return 'liga';
    if (s.includes('serie a')) return 'serie';
    if (s.includes('friendly')) return 'friendly';
    return 'generic';
  }, [league]);

  const srLabel = `Open match ${home.name} versus ${away.name} ${
    isLive ? 'live' : ''
  } at ${formatKickoff(kickoff)}`;

  return (
    <Link
      href={`/match/${id}`}
      className="match-card"
      aria-label={srLabel}
    >
      {/* ─── Teams + Score Row ─── */}
      <div className="row">
        {/* Home */}
        <div className="team team--home">
          <Image
            src={home.crest}
            width={28}
            height={28}
            alt={`${home.name} crest`}
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = 'hidden')}
            unoptimized
          />
          <span className="team__name">{home.name}</span>
        </div>

        {/* Score / Status */}
        <div className="score" aria-live={isLive ? 'polite' : 'off'}>
          {isLive || status === 'FT' || status === 'HT' ? (
            <span className="score__val">
              {score?.home ?? 0} — {score?.away ?? 0}
            </span>
          ) : (
            <span className="score__val">vs</span>
          )}
        </div>

        {/* Away */}
        <div className="team team--away">
          <span className="team__name team__name--right">{away.name}</span>
          <Image
            src={away.crest}
            width={28}
            height={28}
            alt={`${away.name} crest`}
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = 'hidden')}
            unoptimized
          />
        </div>
      </div>

      {/* ─── Meta Row ─── */}
      <div className="meta">
        <span className={`status status--${status.toLowerCase()}`}>
          {isLive && <span aria-hidden className="live-dot" />} {statusLabel}
        </span>
        <span>• {formatKickoff(kickoff)}</span>

        {/* NEW: league chip with modifier */}
        <span className={`league-chip league-chip--${leagueMod}`} title={league}>
          {league}
        </span>
      </div>
    </Link>
  );
}
