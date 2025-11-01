// ─────────────────────────────────────────────────────────────────────────────
// Module: Core Domain Types
// Responsibility: Shared types used across fixtures, teams, and matches.
// Notes:
// - This file stays the "authoritative" place for core unions like EventType.
// - We selectively re-export *unique* Match Page contracts from match.types.ts
//   to avoid name collisions (don’t re-export EventType/StatusAlias/MatchStatus).
// ─────────────────────────────────────────────────────────────────────────────

import type { StatusCode } from '@/lib/status/codes';
import { STATUS_ALIASES } from '@/lib/status/codes';

// Core mini-shapes ------------------------------------------------------------
export type TeamMini = { id: string; name: string; crest: string };
export type Score = { home: number; away: number; minute: number };

// Status model (canonical code OR alias like ET/PEN) --------------------------
export type StatusAlias = keyof typeof STATUS_ALIASES; // 'ET' | 'PEN' | ...
export type MatchStatus = StatusCode | StatusAlias;

// Event/Match/Team domain types ----------------------------------------------
export type EventType = 'goal' | 'card' | 'sub' | 'var' | 'ht' | 'ft';

export type MatchEvent = {
  id: string;
  minute: number;
  type: EventType;
  teamId?: string;
  player?: string;
  note?: string;
};

export type Match = {
  id: string;
  league: string;
  kickoff: string; // ISO
  status: MatchStatus;
  teams: { home: TeamMini; away: TeamMini };
  score?: Score;
  events?: MatchEvent[];
};

export type Team = {
  id: string;
  name: string;
  crest: string;
  league: string;
  form: Array<'W' | 'D' | 'L'>;
  stats: { gf: number; ga: number; pts: number };
};

// ⤴ Re-export ONLY the unique Match Page contracts (avoid duplicate names)
//    This lets consumers import from '@/lib/api/types' without breaking.
export type {
  MatchHeaderProps,
  TimelineEvent,
  MatchData,
} from './match.types';
