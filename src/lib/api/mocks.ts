import { Match, Team } from './types';

export const mockTeams: Record<string, Team> = {
  't-1': { id: 't-1', name: 'Arsenal', crest: '/crests/ars.svg', league: 'Premier League', form: ['W','W','D','L','W'], stats: { gf: 18, ga: 9, pts: 23 } },
  't-2': { id: 't-2', name: 'Chelsea', crest: '/crests/che.svg', league: 'Premier League', form: ['L','W','W','D','L'], stats: { gf: 12, ga: 14, pts: 15 } },
};

export function generateFixtures(dateISO: string): Match[] {
  // simple deterministic stub from date
  const base = new Date(dateISO);
  const day = base.getUTCDate();
  return [
    {
      id: `m-${day}-1`,
      league: 'Premier League',
      kickoff: new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), day, 18, 30)).toISOString(),
      status: 'UPCOMING',
      teams: { home: { id: 't-1', name: mockTeams['t-1'].name, crest: mockTeams['t-1'].crest },
               away: { id: 't-2', name: mockTeams['t-2'].name, crest: mockTeams['t-2'].crest } },
    },
    {
      id: `m-${day}-2`,
      league: 'Premier League',
      kickoff: new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), day, 20, 0)).toISOString(),
      status: 'LIVE',
      teams: { home: { id: 't-2', name: mockTeams['t-2'].name, crest: mockTeams['t-2'].crest },
               away: { id: 't-1', name: mockTeams['t-1'].name, crest: mockTeams['t-1'].crest } },
      score: { home: 1, away: 2 },
      events: [
        { id: 'e1', minute: 12, type: 'goal', teamId: 't-1', player: 'Saka', note: 'Right foot' },
        { id: 'e2', minute: 44, type: 'card', teamId: 't-2', player: 'James', note: 'Yellow' },
      ],
    },
  ];
}
