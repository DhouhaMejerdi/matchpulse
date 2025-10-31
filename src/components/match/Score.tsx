'use client';

// =============================================================================
// COMPONENT: Score
// -----------------------------------------------------------------------------
// Responsibility: Display the current score or “vs” depending on match status.
// Contracts: Props { status: Match['status']; score?: Score }
// A11y: Announces score updates politely for live matches via aria-live.
// Notes: Keeps BEM classes (.score and .score__val) so existing SCSS continues to apply.
// Owner: Frontend Team • Last updated: 2025‑10‑30
// =============================================================================

import type { Match, Score } from '@/lib/api/types';

export type ScoreProps = {
  status: Match['status'];
  score?: Score;
};

export default function Score({ status, score }: ScoreProps) {
  const isLiveOrFinal = status === 'LIVE' || status === 'FT' || status === 'HT';
  return (
    <div className="score" aria-live={isLiveOrFinal ? 'polite' : 'off'}>
      {isLiveOrFinal ? (
        <span className="score__val">{score?.home ?? 0} — {score?.away ?? 0}</span>
      ) : (
        <span className="score__val">vs</span>
      )}
    </div>
  );
}
