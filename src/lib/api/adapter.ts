import { Match, Team } from './types';
import { generateFixtures, mockTeams } from './mocks';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms)); // simulate network

export async function getFixtures(dateISO: string): Promise<Match[]> {
  await delay(150); // keep UI snappy but realistic
  return generateFixtures(dateISO);
}

export async function getMatch(id: string): Promise<Match | null> {
  await delay(120);

  // Parse deterministic pattern: m-<day>-<n>
  const m = id.match(/^m-(\d+)-/);
  const now = new Date();
  const y = now.getUTCFullYear();
  const mth = now.getUTCMonth();
  const day = m ? Number(m[1]) : now.getUTCDate(); // fallback to today if pattern missing

  // Build ISO at UTC midnight for that day
  const dayISO = new Date(Date.UTC(y, mth, day)).toISOString();

  const fixtures = generateFixtures(dayISO);
  const match = fixtures.find((fx) => fx.id === id) ?? null;

  return match;
}

export async function getTeam(id: string): Promise<Team | null> {
  await delay(80);
  return mockTeams[id] ?? null;
}
