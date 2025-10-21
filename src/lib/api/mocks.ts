// src/lib/api/mocks.ts
import { Match, Team } from './types';

const crest = (name: string) => `/api/crest?name=${encodeURIComponent(name)}&size=32`;

// 🔹 Ensure Team type includes `league: string` in src/lib/api/types.ts
export const mockTeams: Record<string, Team> = {
  't-1': { id: 't-1', name: 'Arsenal', crest: crest('Arsenal'), league: 'Premier League', form: ['W','W','D','L','W'], stats: { gf: 18, ga: 9, pts: 23 } },
  't-2': { id: 't-2', name: 'Chelsea', crest: crest('Chelsea'), league: 'Premier League', form: ['L','W','W','D','L'], stats: { gf: 12, ga: 14, pts: 15 } },
  // NEW league + long names to test truncation/layout
  't-3': { id: 't-3', name: 'Real Madrid', crest: crest('Real Madrid'), league: 'La Liga', form: ['W','W','W','W','W'], stats: { gf: 22, ga: 5, pts: 30 } },
  't-4': { id: 't-4', name: 'International Sports Club of North London', crest: crest('International Sports Club of North London'), league: 'UEFA Champions League', form: ['W','D','W','D','L'], stats: { gf: 9, ga: 6, pts: 15 } },
};

// 🔹 helper: same UTC dayKey + hh:mm → ISO
function atTime(dateISO: string, hh: number, mm: number): string {
  const d = new Date(dateISO);
  const iso = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), hh, mm));
  return iso.toISOString();
}

export function generateFixtures(dateISO: string): Match[] {
  const base = new Date(dateISO);
  const day = base.getUTCDate();

  return [
    // 1) UPCOMING — Premier League (your original)
    {
      id: `m-${day}-1`,
      league: 'Premier League',
      kickoff: atTime(dateISO, 18, 30),
      status: 'UPCOMING',
      teams: {
        home: { id: 't-1', name: mockTeams['t-1'].name, crest: mockTeams['t-1'].crest },
        away: { id: 't-2', name: mockTeams['t-2'].name, crest: mockTeams['t-2'].crest },
      },
      score: { home: 0, away: 0 },
      events: [],
    },

    // 2) LIVE — Premier League (your original, unchanged semantics)
    {
      id: `m-${day}-2`,
      league: 'Premier League',
      kickoff: atTime(dateISO, 20, 0),
      status: 'LIVE',
      teams: {
        home: { id: 't-2', name: mockTeams['t-2'].name, crest: mockTeams['t-2'].crest },
        away: { id: 't-1', name: mockTeams['t-1'].name, crest: mockTeams['t-1'].crest },
      },
      score: { home: 1, away: 2 },
      events: [
        { id: 'e1', minute: 12, type: 'goal', teamId: 't-1', player: 'Saka', note: 'Right foot' },
        { id: 'e2', minute: 44, type: 'card', teamId: 't-2', player: 'James', note: 'Yellow' },
      ],
    },

    // 3) HT — La Liga (new state)
    {
      id: `m-${day}-3`,
      league: 'La Liga',
      kickoff: atTime(dateISO, 17, 45),
      status: 'HT',
      teams: {
        home: { id: 't-3', name: mockTeams['t-3'].name, crest: mockTeams['t-3'].crest },
        away: { id: 't-2', name: mockTeams['t-2'].name, crest: mockTeams['t-2'].crest },
      },
      score: { home: 2, away: 2 },
      events: [
        { id: 'e3', minute: 11, type: 'goal', teamId: 't-3', player: 'Bellingham' },
        { id: 'e4', minute: 33, type: 'goal', teamId: 't-2', player: 'Jackson' },
        { id: 'e5', minute: 45, type: 'ht', teamId: 't-3', player: '', note: 'Half-time' },
      ],
    },

    // 4) FT — High score + long names (layout stress)
    {
      id: `m-${day}-4`,
      league: 'UEFA Champions League',
      kickoff: atTime(dateISO, 21, 15),
      status: 'FT',
      teams: {
        home: { id: 't-4', name: mockTeams['t-4'].name, crest: mockTeams['t-4'].crest },
        away: { id: 't-3', name: mockTeams['t-3'].name, crest: mockTeams['t-3'].crest },
      },
      score: { home: 3, away: 4 },
      events: [
        { id: 'e6', minute: 5, type: 'goal', teamId: 't-3', player: 'Vinícius Jr' },
        { id: 'e7', minute: 45, type: 'ht', teamId: 't-4', player: '', note: 'Half-time' },
        { id: 'e8', minute: 90, type: 'ft', teamId: 't-3', player: '', note: 'Full-time' },
      ],
    },
  ];
}
