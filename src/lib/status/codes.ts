// src/lib/status/codes.ts

// Canonical app-wide status codes (the only ones UI components should use)
export const STATUS_CODES = [
  'UPCOMING',
  'LIVE',
  'HT',
  'FT',
  'AET',
  'PENS',
  'DELAYED',
  'POSTPONED',
  'CANCELED',
  'SUSPENDED',
  'ABANDONED',
  'TBD',
] as const;

export type StatusCode = typeof STATUS_CODES[number];

// Common feed aliases we accept from APIs/mocks, normalized to canonical codes
export const STATUS_ALIASES: Record<string, StatusCode> = {
  ET: 'AET',
  PEN: 'PENS',
};

// Safe normalizer (use everywhere at boundaries)
export function normalizeStatus(input?: string | null): StatusCode {
  const raw = (input ?? '').toUpperCase();
  if ((STATUS_CODES as readonly string[]).includes(raw)) return raw as StatusCode;
  if (raw in STATUS_ALIASES) return STATUS_ALIASES[raw];
  return 'TBD';
}
