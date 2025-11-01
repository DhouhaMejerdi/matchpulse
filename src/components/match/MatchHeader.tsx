'use client';

import * as React from 'react';
import Image from 'next/image';

// 🔁 Use the canonical contract so props don't drift
import type { MatchHeaderProps } from '@/lib/api/match.types';
import type { StatusCode } from '@/lib/status/codes';
import { STATUS_ALIASES } from '@/lib/status/codes';

// ✅ Use the same centralized UI bits as MatchCard
import StatusBadge from '@/components/match/StatusBadge';

// ————————————————————————————————————————————————————————————————
// helpers
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

function toCanonicalStatus(code: MatchHeaderProps['status']): StatusCode {
  // If it's an alias (ET, PEN, …) map to canonical; otherwise assume canonical
  return (STATUS_ALIASES as Record<string, StatusCode>)[code as string] ?? (code as StatusCode);
}

const LIVEISH = new Set<StatusCode | keyof typeof STATUS_ALIASES>([
  'LIVE', 'ET', 'PEN',
]);

// ————————————————————————————————————————————————————————————————
// component
export default function MatchHeader({
  home, away, score, status, league, kickoff, venue,
}: MatchHeaderProps) {
  const isLive = LIVEISH.has(status);
  const canonical = toCanonicalStatus(status);

  // Same league chip logic as MatchCard (keeps UI consistent)
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

      {/* ─── Teams + Score Row ─── */}
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

      {/* ─── Meta Row ─── */}
      <div className="match-sub" role="group" aria-label="Match details">
        {/* ✅ Unified, token-driven status badge; canonicalized status */}
        <span className="meta__item">
          <StatusBadge code={canonical} />
        </span>

        <span aria-hidden>•</span>

        <time dateTime={kickoff ?? undefined} title={kickoff ?? undefined}>
          {fmtKickoff(kickoff)}
        </time>

        <span aria-hidden>•</span>
        {/* League chip with modifier + title */}
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
