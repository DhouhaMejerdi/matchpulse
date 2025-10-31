// src/lib/api/mocks.ts
import { Match, Team } from './types';

const crest = (name: string) => `/api/crest?name=${encodeURIComponent(name)}&size=32`;

export const mockTeams: Record<string, Team> = {
  't-1': { id: 't-1', name: 'Arsenal',   crest: crest('Arsenal'),   league: 'Premier League',      form: ['W','W','D','L','W'], stats: { gf: 18, ga: 9,  pts: 23 } },
  't-2': { id: 't-2', name: 'Chelsea',   crest: crest('Chelsea'),   league: 'Premier League',      form: ['L','W','W','D','L'], stats: { gf: 12, ga: 14, pts: 15 } },
  't-3': { id: 't-3', name: 'Real Madrid', crest: crest('Real Madrid'), league: 'La Liga',          form: ['W','W','W','W','W'], stats: { gf: 22, ga: 5,  pts: 30 } },
  't-4': { id: 't-4', name: 'Barcelona', crest: crest('Barcelona'), league: 'La Liga',              form: ['D','W','W','L','W'], stats: { gf: 17, ga: 8,  pts: 24 } },
  't-5': { id: 't-5', name: 'Inter',     crest: crest('Inter'),     league: 'Serie A',              form: ['W','D','W','W','W'], stats: { gf: 20, ga: 7,  pts: 28 } },
  't-6': { id: 't-6', name: 'International Sports Club of North London', crest: crest('International Sports Club of North London'), league: 'UEFA Champions League', form: ['W','D','W','D','L'], stats: { gf: 9, ga: 6, pts: 15 } },
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
      score: {
        home: 0, away: 0,
        minute: 0
      },
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
      score: {
        home: 1, away: 2,
        minute: 10
      },
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
      score: {
        home: 2, away: 2,
        minute: 0
      },
      events: [
        { id: 'e3', minute: 11, type: 'goal', teamId: 't-3', player: 'Bellingham' },
        { id: 'e4', minute: 33, type: 'goal', teamId: 't-2', player: 'Jackson' },
        { id: 'e5', minute: 45, type: 'ht', teamId: 't-3', player: '', note: 'Half-time' },
      ],
    },
        // 4) FT — high score (layout stretch)
    {
      id: `m-${day}-4`,
      league: 'UEFA Champions League',
      kickoff: atTime(dateISO, 21, 15),
      status: 'FT',
      teams: { home: { id: 't-6', name: mockTeams['t-6'].name, crest: mockTeams['t-6'].crest },
               away: { id: 't-3', name: mockTeams['t-3'].name, crest: mockTeams['t-3'].crest } },
      score: {
        home: 3, away: 4,
        minute: 0
      },
      events: [
        { id: 'e6', minute: 5,  type: 'goal', teamId: 't-3', player: 'Vinícius Jr' },
        { id: 'e7', minute: 45, type: 'ht',   note: 'Half-time' },
        { id: 'e8', minute: 90, type: 'ft',   note: 'Full-time' },
      ],
    },
    // 5) POSTPONED — weather, etc.
    {
      id: `m-${day}-5`,
      league: 'Premier League',
      kickoff: atTime(dateISO, 16, 0),
      status: 'POSTPONED',
      teams: { home: { id: 't-1', name: mockTeams['t-1'].name, crest: mockTeams['t-1'].crest },
               away: { id: 't-4', name: mockTeams['t-4'].name, crest: mockTeams['t-4'].crest } },
      score: {
        home: 0, away: 0,
        minute: 0
      },
      events: [],
    },

    // 6) CANCELED — exhibition cancelled
    {
      id: `m-${day}-6`,
      league: 'Friendly',
      kickoff: atTime(dateISO, 15, 0),
      status: 'CANCELED',
      teams: { home: { id: 't-5', name: mockTeams['t-5'].name, crest: mockTeams['t-5'].crest },
               away: { id: 't-2', name: mockTeams['t-2'].name, crest: mockTeams['t-2'].crest } },
      score: {
        home: 0, away: 0,
        minute: 0
      },
      events: [],
    },
    // 7) DELAYED — start delayed
    {
      id: `m-${day}-7`,
      league: 'La Liga',
      kickoff: atTime(dateISO, 18, 0),
      status: 'DELAYED',
      teams: { home: { id: 't-4', name: mockTeams['t-4'].name, crest: mockTeams['t-4'].crest },
               away: { id: 't-3', name: mockTeams['t-3'].name, crest: mockTeams['t-3'].crest } },
      score: {
        home: 0, away: 0,
        minute: 0
      },
      events: [],
    },

    // 8) ET — after extra time (knockout)
    {
      id: `m-${day}-8`,
      league: 'UEFA Champions League',
      kickoff: atTime(dateISO, 19, 30),
      status: 'ET',
      teams: { home: { id: 't-3', name: mockTeams['t-3'].name, crest: mockTeams['t-3'].crest },
               away: { id: 't-5', name: mockTeams['t-5'].name, crest: mockTeams['t-5'].crest } },
      score: {
        home: 2, away: 2,
        minute: 0
      }, // typically shown as 2—2 (AET)
      events: [
        { id: 'e9',  minute: 93, type: 'goal', teamId: 't-5', player: 'Lautaro' },
        { id: 'e10', minute: 117, type: 'goal', teamId: 't-3', player: 'Bellingham' },
      ],
    },
    // 9) PEN — decided on penalties
    {
      id: `m-${day}-9`,
      league: 'UEFA Champions League',
      kickoff: atTime(dateISO, 21, 0),
      status: 'PEN',
      teams: { home: { id: 't-6', name: mockTeams['t-6'].name, crest: mockTeams['t-6'].crest },
               away: { id: 't-4', name: mockTeams['t-4'].name, crest: mockTeams['t-4'].crest } },
      score: {
        home: 2, away: 2,
        minute: 0
      }, // e.g., 2—2 (4—3 pens)
      events: [
        { id: 'e11', minute: 120, type: 'ft',  note: 'End of extra time' },
        { id: 'e12', minute: 121, type: 'var', note: 'VAR check before penalties' },
      ],
    },

    // 10) LIVE 0—0 — in-progress but no score yet
    {
      id: `m-${day}-10`,
      league: 'Serie A',
      kickoff: atTime(dateISO, 20, 30),
      status: 'LIVE',
      teams: { home: { id: 't-5', name: mockTeams['t-5'].name, crest: mockTeams['t-5'].crest },
               away: { id: 't-2', name: mockTeams['t-2'].name, crest: mockTeams['t-2'].crest } },
      score: {
        home: 0, away: 0,
        minute: 0
      },
      events: [],
    },

    // 11) UPCOMING — simultaneous kickoff A
    {
      id: `m-${day}-11`,
      league: 'Premier League',
      kickoff: atTime(dateISO, 19, 30),
      status: 'UPCOMING',
      teams: { home: { id: 't-2', name: mockTeams['t-2'].name, crest: mockTeams['t-2'].crest },
               away: { id: 't-1', name: mockTeams['t-1'].name, crest: mockTeams['t-1'].crest } },
      score: {
        home: 0, away: 0,
        minute: 0
      },
      events: [],
    },

    // 12) UPCOMING — simultaneous kickoff B
    {
      id: `m-${day}-12`,
      league: 'Premier League',
      kickoff: atTime(dateISO, 19, 30),
      status: 'UPCOMING',
      teams: { home: { id: 't-1', name: mockTeams['t-1'].name, crest: mockTeams['t-1'].crest },
               away: { id: 't-5', name: mockTeams['t-5'].name, crest: mockTeams['t-5'].crest } },
      score: {
        home: 0, away: 0,
        minute: 0
      },
      events: [],
    },
        // 13) SUSPENDED — paused indefinitely after kickoff
    {
      id: `m-${day}-13`,
      league: 'La Liga',
      kickoff: atTime(dateISO, 18, 15),
      status: 'SUSPENDED',
      teams: {
        home: { id: 't-3', name: mockTeams['t-3'].name, crest: mockTeams['t-3'].crest },
        away: { id: 't-4', name: mockTeams['t-4'].name, crest: mockTeams['t-4'].crest },
      },
      score: {
        home: 1, away: 0,
        minute: 0
      }, // score at suspension time
      events: [],
    },

    // 14) ABANDONED — match terminated (won’t resume)
    {
      id: `m-${day}-14`,
      league: 'Premier League',
      kickoff: atTime(dateISO, 17, 0),
      status: 'ABANDONED',
      teams: {
        home: { id: 't-1', name: mockTeams['t-1'].name, crest: mockTeams['t-1'].crest },
        away: { id: 't-2', name: mockTeams['t-2'].name, crest: mockTeams['t-2'].crest },
      },
      score: {
        home: 0, away: 0,
        minute: 0
      }, // typically voided, keep neutral
      events: [],
    },
  ];
}
