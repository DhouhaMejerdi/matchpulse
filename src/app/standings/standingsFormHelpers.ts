// =============================================================================
// HELPERS: Standings form dots
// -----------------------------------------------------------------------------
// Responsibility: Small pure helpers used by <StandingsTable /> to map last-5
//                 results into CSS classes and screen-reader-friendly labels.
// Contracts: Framework-agnostic; can be safely reused by future components
//            (e.g. team cards, compact form widgets).
// Owner: Frontend Team • Last updated: 2025-11-26
// =============================================================================

/** Single result token in a last-5 form sequence. */
export type StandingsFormResult = "W" | "D" | "L";

/**
 * Map a result token to the correct BEM class for the form dot.
 * Keeps CSS class strings in one place so they stay consistent.
 */
export function getFormDotClass(result: StandingsFormResult): string {
  switch (result) {
    case "W":
      return "standings-table__form-dot standings-table__form-dot--win";
    case "D":
      return "standings-table__form-dot standings-table__form-dot--draw";
    case "L":
    default:
      return "standings-table__form-dot standings-table__form-dot--loss";
  }
}

/**
 * Expand a compact result token into a human-readable label
 * for assistive technologies.
 */
export function expandResultForScreenReaders(
  result: StandingsFormResult,
): string {
  if (result === "W") return "Win";
  if (result === "D") return "Draw";
  return "Loss";
}
