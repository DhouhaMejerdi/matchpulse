'use client';
import Link from 'next/link';

export type MatchCardProps = {
  id: string;
  home: { name: string; crest: string };
  away: { name: string; crest: string };
  status: 'LIVE' | 'UPCOMING' | 'FT' | 'HT';
  kickoff: string; // ISO
  score?: { home: number; away: number };
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
  const srLabel = `Open match ${home.name} versus ${away.name} ${
    isLive ? 'live' : ''
  } at ${formatKickoff(kickoff)}`;

  return (
    <Link
      href={`/match/${id}`}
      className="match-card"
      aria-label={srLabel}
    >
      <div className="row">
        {/* Home */}
        <div className="team team--home">
          <img
            src={home.crest}
            width={28}
            height={28}
            alt={`${home.name} crest`}
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = 'hidden')}
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
          <img
            src={away.crest}
            width={28}
            height={28}
            alt={`${away.name} crest`}
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = 'hidden')}
          />
        </div>
      </div>

      <div className="meta">
        <span className={`status status--${status.toLowerCase()}`}>
          {isLive && <span aria-hidden className="live-dot" />} {status}
        </span>
        <span>• {formatKickoff(kickoff)}</span>
        <span className="league-chip">{league}</span>
      </div>
    </Link>
  );
}
