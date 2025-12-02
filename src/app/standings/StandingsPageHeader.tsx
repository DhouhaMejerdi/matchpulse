// =============================================================================
// COMPONENT: StandingsPageHeader
// -----------------------------------------------------------------------------
// Responsibility: /standings hero (page title + season/matches meta +
//                 optional filters slot).
// Contracts: Pure presentational header; no data fetching or state. Receives
//            optional title/subtitle/meta via props and exposes a `children`
//            slot for header controls (e.g. <StandingsHeaderFilters />).
// A11y: Section labelled by h1; lives inside <main id="main-content">.
//       Controls region is grouped via role="group" and labelled for
//       assistive tech when children are provided.
// Owner: Frontend Team • Last updated: 2025-11-28
// =============================================================================

import * as React from "react";

// -- PROPS --------------------------------------------------------------------

export type StandingsPageHeaderProps = {
  /** Page title, defaults to "Standings". */
  title?: string;

  /**
   * Optional freeform subtitle.
   *
   * If not provided, a derived subtitle will be computed from `seasonLabel`
   * and `matchesPlayedLabel` (e.g. "2024/25 • 28 matches played").
   */
  subtitle?: string;

  /** Season label, e.g. "2024/25". Used in the derived subtitle. */
  seasonLabel?: string;

  /** Matches meta, e.g. "28 matches played". Used in the derived subtitle. */
  matchesPlayedLabel?: string;

  /**
   * Optional ARIA label for the controls group. Defaults to
   * "Standings filters" when controls are present.
   *
   * Example: pass "Standings filters and tools" if you add export buttons
   * or extra actions to the header controls.
   */
  controlsAriaLabel?: string;

  /**
   * Optional slot for header controls (e.g. <StandingsHeaderFilters />).
   *
   * These controls are rendered:
   * - To the right of the title on larger screens.
   * - Stacked below the title on small screens via CSS.
   */
  children?: React.ReactNode;
};

// -- COMPONENT ----------------------------------------------------------------

export default function StandingsPageHeader(
  props: StandingsPageHeaderProps,
): React.ReactElement {
  const {
    title = "Standings",
    subtitle,
    seasonLabel,
    matchesPlayedLabel,
    controlsAriaLabel = "Standings filters",
    children,
  } = props;

  const derivedSubtitleParts = [
    seasonLabel || undefined,
    matchesPlayedLabel || undefined,
  ].filter(Boolean);

  const computedSubtitle = subtitle ?? derivedSubtitleParts.join(" • ");

  const hasControls = Boolean(children);

  return (
    <section
      className="standings-header container"
      aria-labelledby="standings-page-title"
    >
      <div className="standings-header__inner">
        <div className="standings-header__text">
          <h1 id="standings-page-title" className="standings-header__title">
            {title}
          </h1>

          {computedSubtitle && (
            <p className="standings-header__subtitle">{computedSubtitle}</p>
          )}
        </div>

        {hasControls && (
          <div
            className="standings-header__controls"
            role="group"
            aria-label={controlsAriaLabel}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
