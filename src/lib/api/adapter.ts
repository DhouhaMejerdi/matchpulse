import { Match, Team } from './types';
import { generateFixtures, mockTeams } from './mocks';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms)); // simulate network

export async function getFixtures(dateISO: string): Promise<Match[]> {
  await delay(150); // keep UI snappy but realistic
  return generateFixtures(dateISO);
}

export async function getMatch(id: string): Promise<Match | null> {
  await delay(120);
  // naive search in generated set for today + ±1 day
  const now = new Date();
  const candidates = [
    ...generateFixtures(now.toISOString()),
    ...generateFixtures(new Date(now.getTime() - 86400000).toISOString()),
    ...generateFixtures(new Date(now.getTime() + 86400000).toISOString()),
  ];
  return candidates.find((m) => m.id === id) ?? null;
}

export async function getTeam(id: string): Promise<Team | null> {
  await delay(80);
  return mockTeams[id] ?? null;
}
