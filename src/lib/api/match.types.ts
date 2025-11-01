// ─────────────────────────────────────────────────────────────────────────────
// Module: Match Page Contracts (Header + Timeline)
// Responsibility: Narrow, UI-facing types for /match/[id] route
// A11Y: Timeline minute stays numeric; UI composes aria-labels.
// Notes: Aligned with existing core types and status aliases.
// ─────────────────────────────────────────────────────────────────────────────

import type { StatusCode } from '@/lib/status/codes';
import { STATUS_ALIASES } from '@/lib/status/codes';

// Reuse your alias model: API may send canonical or alias (ET, PEN, etc.)
export type StatusAlias = keyof typeof STATUS_ALIASES;
export type MatchStatus = StatusCode | StatusAlias;

// Reuse the “mini” team shape already in your codebase
export type TeamMini = { id: string; name: string; crest: string };

// Keep Score shape aligned with your existing one (includes live minute)
export type Score = { home: number; away: number; minute: number };

// Match header props expected by <MatchHeader />
export type MatchHeaderProps = {
  home: TeamMini;
  away: TeamMini;
  score?: Score | null;
  status: MatchStatus;
  league: string;
  kickoff: string;          // ISO
  venue?: string | null;
};

// Timeline event types: align with your EventType union from core
export type EventType = 'goal' | 'card' | 'sub' | 'var' | 'ht' | 'ft';

// Timeline event for the detail page
export type TimelineEvent = {
  id: string;
  minute: number;           // 0..120 (+ET)
  type: EventType;
  teamId?: string;          // events like ht/ft may be global → optional
  player?: string;
  note?: string;
};

// Payload that MatchPageClient expects
export type MatchData = {
  header: MatchHeaderProps;
  events: TimelineEvent[];
};
