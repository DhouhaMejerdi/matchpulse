export type TeamMini = { id: string; name: string; crest: string };
export type Score = { home: number; away: number };
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
  status: 'LIVE' | 'UPCOMING' | 'FT' | 'HT' | 'POSTPONED' | 'CANCELED' | 'DELAYED' | 'ET' | 'PEN';
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
