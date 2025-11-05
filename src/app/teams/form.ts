// =============================================================================
// MODULE: Team form model
// Responsibility: Shared types and helpers for team recent form (W/D/L)
// Contracts: Used by TeamSummary, TeamCard, and future API adapters
// A11y: Provides human-readable labels/tooltips for screen readers
// Owner: Frontend Team • Last updated: 2025-11-05
// =============================================================================

export type TeamFormResult = 'W' | 'D' | 'L';

export type TeamFormEntry =
  | TeamFormResult
  | {
      result: TeamFormResult;
      opponent?: string;
      score?: string;
    };

export function getFormResult(entry: TeamFormEntry): TeamFormResult {
  return typeof entry === 'string' ? entry : entry.result;
}

export function getFormLabel(
  result: TeamFormResult
): 'Win' | 'Draw' | 'Loss' {
  if (result === 'W') return 'Win';
  if (result === 'D') return 'Draw';
  return 'Loss';
}

export function getFormTooltip(entry: TeamFormEntry): string {
  const result = getFormResult(entry);
  const base = getFormLabel(result);

  if (typeof entry === 'string') {
    return base;
  }

  const opponent = entry.opponent;
  const score = entry.score;

  if (!opponent) return base;
  if (!score) return `${base} vs ${opponent}`;

  return `${base} vs ${opponent} (${score})`;
}
