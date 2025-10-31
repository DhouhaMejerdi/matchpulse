export type TeamMini = { id: string; name: string; crest: string };
export type Score = { home: number; away: number; minute:number };
export type EventType = 'goal' | 'card' | 'sub' | 'var' | 'ht' | 'ft';

import type { StatusCode } from '@/lib/status/codes';
import { STATUS_ALIASES } from '@/lib/status/codes';
export type StatusAlias = keyof typeof STATUS_ALIASES; // 'ET' | 'PEN'
export type MatchStatus = StatusCode | StatusAlias;     // API can send canonical or alias

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
