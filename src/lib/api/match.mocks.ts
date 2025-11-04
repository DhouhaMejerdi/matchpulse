// ─────────────────────────────────────────────────────────────────────────────
// Module: Match Page Mocks (Header + Timeline)
// Responsibility: Deterministic sample data for /match/[id] route
// Notes:
// - Reuses mockTeams from ./mocks to avoid duplication.
// - Keep deliberately small; extend with switch(id) for more scenarios.
// ─────────────────────────────────────────────────────────────────────────────

import type { MatchData, TimelineEvent } from './match.types';
import { mockTeams } from './mocks';

// Small helper: shape down to TeamMini
function mini(teamId: string) {
  const t = mockTeams[teamId];
  return { id: t.id, name: t.name, crest: t.crest };
}

// Optional helper to build events with consistent ids
function ev(
  id: string,
  minute: number,
  type: TimelineEvent['type'],
  opts: Partial<Omit<TimelineEvent, 'id' | 'minute' | 'type'>> = {}
): TimelineEvent {
  return { id, minute, type, ...opts };
}

/**
 * mockMatch
 * Returns a stable MatchData object for the Match Page.
 * @param id optional scenario key if you later want multiple presets
 */
export function mockMatch(id: string = 'm-sample'): MatchData {
  const homeId = 't-2'; // Chelsea
  const awayId = 't-1'; // Arsenal

  return {
    header: {
      home: mini(homeId),
      away: mini(awayId),
      score: { home: 1, away: 2, minute: 64 },
      status: 'LIVE',
      league: 'Premier League',
      kickoff: new Date().toISOString(),
      venue: 'Stamford Bridge',
    },
    events: [
      ev(`${id}-e1`, 12,  'goal', { teamId: awayId, player: 'Saka',        note: 'Right foot' }),
      ev(`${id}-e2`, 33,  'card', { teamId: homeId, player: 'Caicedo',     note: 'Yellow' }),
      ev(`${id}-e3`, 45,  'ht',   { note: 'Half-time' }),
      ev(`${id}-e4`, 61,  'sub',  { teamId: homeId, player: 'Mudryk',      note: 'On for Sterling' }),
      ev(`${id}-e5`, 64,  'goal', { teamId: homeId, player: 'Palmer',      note: 'Penalty' }),
      // Feel free to add VAR/PEN/ET samples as needed:
      // ev(`${id}-e6`, 71, 'var', { note: 'VAR check: offside' }),
    ],
  };
}
