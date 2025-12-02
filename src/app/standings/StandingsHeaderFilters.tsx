// =============================================================================
// COMPONENT: StandingsHeaderFilters
// -----------------------------------------------------------------------------
// Responsibility: Render compact filter controls for the /standings header:
//                 - League selector
//                 - Season selector
//                 - Matchday selector
// Contracts: Controlled component. Receives current values, option lists and
//            onChange handlers from the parent view model (e.g.
//            useStandingsPageState).
// A11y: Each field is labelled via <label> with ids generated via useId() to
//       avoid collisions. StandingsPageHeader wraps this block in a role="group"
//       and provides a group-level aria-label for assistive tech.
// Owner: Frontend Team • Last updated: 2025-11-28
// =============================================================================

import * as React from "react";
import type {
  StandingsFilterOption,
  StandingsHeaderFiltersProps,
} from "./types";

// -- COMPONENT ----------------------------------------------------------------

/**
 * Presentational filters block for the /standings header.
 *
 * - Does not own state or side-effects.
 * - Expects fully-controlled props for league, season and matchday.
 * - Renders three <select> controls with shared BEM styling.
 */
export default function StandingsHeaderFilters(
  props: StandingsHeaderFiltersProps,
): React.ReactElement {
  const {
    leagueId,
    leagueOptions,
    onLeagueChange,
    seasonId,
    seasonOptions,
    onSeasonChange,
    matchdayId,
    matchdayOptions,
    onMatchdayChange,
  } = props;

  // Generate stable, unique IDs for accessible labelling.
  // NOTE: The same component can render multiple times on a page safely.
  const baseId = React.useId();
  const leagueSelectId = `${baseId}-league`;
  const seasonSelectId = `${baseId}-season`;
  const matchdaySelectId = `${baseId}-matchday`;

  return (
    <div className="standings-header__filters">
      {/* League selector ------------------------------------------------------ */}
      <div className="standings-header__control">
        <label
          htmlFor={leagueSelectId}
          className="standings-header__control-label"
        >
          League
        </label>

        <select
          id={leagueSelectId}
          className="standings-header__control-field"
          value={leagueId}
          onChange={(event) => onLeagueChange?.(event.target.value)}
        >
          {leagueOptions.map((league: StandingsFilterOption) => (
            <option key={league.value} value={league.value}>
              {league.label}
            </option>
          ))}
        </select>
      </div>

      {/* Season selector ------------------------------------------------------ */}
      <div className="standings-header__control">
        <label
          htmlFor={seasonSelectId}
          className="standings-header__control-label"
        >
          Season
        </label>

        <select
          id={seasonSelectId}
          className="standings-header__control-field"
          value={seasonId}
          onChange={(event) => onSeasonChange?.(event.target.value)}
        >
          {seasonOptions.map((season: StandingsFilterOption) => (
            <option key={season.value} value={season.value}>
              {season.label}
            </option>
          ))}
        </select>
      </div>

      {/* Matchday selector ---------------------------------------------------- */}
      <div className="standings-header__control">
        <label
          htmlFor={matchdaySelectId}
          className="standings-header__control-label"
        >
          Matchday
        </label>

        <select
          id={matchdaySelectId}
          className="standings-header__control-field"
          value={matchdayId}
          onChange={(event) => onMatchdayChange?.(event.target.value)}
        >
          {matchdayOptions.map((matchday: StandingsFilterOption) => (
            <option key={matchday.value} value={matchday.value}>
              {matchday.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
