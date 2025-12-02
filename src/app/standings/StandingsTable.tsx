// =============================================================================
// COMPONENT: StandingsTable
// -----------------------------------------------------------------------------
// Responsibility: Render league standings as an accessible table and surface
//                 loading, error and empty states based on the page view model.
// Contracts: Pure presentational with respect to data fetching; receives fully
//            normalised rows + status + optional errorMessage from the
//            useStandingsPageState view model. In v1.1 it also receives an
//            optional showZones flag to enable league zone stripes on rows.
// A11y: Semantic <table> with caption, thead, tbody; visually hidden caption
//       and section heading; status messages exposed via aria-live; numeric
//       columns right-aligned.
// Owner: Frontend Team • Last updated: 2025-11-27
// =============================================================================

import * as React from "react";
import type { StandingsTableRow, StandingsPageStatus } from "./types";
import {
  getFormDotClass,
  expandResultForScreenReaders,
} from "./standingsFormHelpers";

// -- PROPS --------------------------------------------------------------------

export type StandingsTableProps = {
  rows: StandingsTableRow[];
  status: StandingsPageStatus;
  /** Optional error message from useStandingsPageState. */
  errorMessage?: string | null;
  /** When true, apply CL / Europa / Relegation stripes to rows. */
  showZones?: boolean;
};

// Helper: derive a BEM modifier for the zone stripe based on position.
// Premier League v1 mapping:
//   1–4  → Champions League
//   5–6  → Europa League
//   18–20 → Relegation
const getZoneClassForPosition = (
  position: number,
  showZones: boolean,
): string => {
  if (!showZones) return "";

  if (position >= 1 && position <= 4) {
    return "standings-table__row--zone-cl";
  }
  if (position >= 5 && position <= 6) {
    return "standings-table__row--zone-eu";
  }
  if (position >= 18 && position <= 20) {
    return "standings-table__row--zone-rel";
  }

  return "";
};

// -- COMPONENT ----------------------------------------------------------------

export default function StandingsTable(
  props: StandingsTableProps,
): React.ReactElement {
  const { rows, status, errorMessage, showZones = false } = props;

  // Loading state: keep layout area reserved, announce to screen readers.
  if (status === "loading") {
    return (
      <div
        className="standings-table__status standings-table__status--loading"
        aria-live="polite"
      >
        Loading standings…
      </div>
    );
  }

  // Error state: inline message; table is not rendered.
  if (status === "error") {
    return (
      <div
        className="standings-table__status standings-table__status--error"
        aria-live="polite"
      >
        {errorMessage ?? "Unable to load standings right now."}
      </div>
    );
  }

  // Success but no rows: defensive empty state.
  if (!rows.length) {
    return (
      <div
        className="standings-table__status standings-table__status--empty"
        aria-live="polite"
      >
        No standings are available for this selection yet.
      </div>
    );
  }

  // Happy path: render full table.
  return (
    <div className="standings-table__shell">
      <table className="standings-table__table">
        <caption className="sr-only">League standings table</caption>

        <thead className="standings-table__head">
          <tr>
            <th
              scope="col"
              className="standings-table__cell standings-table__cell--col-pos"
            >
              #
            </th>
            <th
              scope="col"
              className="standings-table__cell standings-table__cell--col-team"
            >
              Team
            </th>
            <th
              scope="col"
              className="standings-table__cell standings-table__cell--col-num"
            >
              P
            </th>
            <th
              scope="col"
              className="standings-table__cell standings-table__cell--col-num"
            >
              W
            </th>
            <th
              scope="col"
              className="standings-table__cell standings-table__cell--col-num"
            >
              D
            </th>
            <th
              scope="col"
              className="standings-table__cell standings-table__cell--col-num"
            >
              L
            </th>
            <th
              scope="col"
              className="standings-table__cell standings-table__cell--col-num"
            >
              GF
            </th>
            <th
              scope="col"
              className="standings-table__cell standings-table__cell--col-num"
            >
              GA
            </th>
            <th
              scope="col"
              className="standings-table__cell standings-table__cell--col-num"
            >
              GD
            </th>
            <th
              scope="col"
              className="standings-table__cell standings-table__cell--col-points"
            >
              Pts
            </th>
            <th
              scope="col"
              className="standings-table__cell standings-table__cell--col-form"
            >
              Form
            </th>
          </tr>
        </thead>

        <tbody className="standings-table__body">
          {rows.map((row) => {
            const zoneClass = getZoneClassForPosition(
              row.position,
              showZones,
            );

            return (
              <tr
                key={row.teamId}
                className={`standings-table__row ${zoneClass}`}
              >
                <td
                  className="standings-table__cell standings-table__cell--pos"
                  aria-label={`Position ${row.position}`}
                >
                  {row.position}
                </td>

                <td className="standings-table__cell standings-table__cell--team">
                  <div className="standings-table__team">
                    {row.crestUrl ? (
                      <img
                        src={row.crestUrl}
                        alt=""
                        className="standings-table__team-crest"
                        loading="lazy"
                      />
                    ) : (
                      <span
                        className="standings-table__team-crest-placeholder"
                        aria-hidden="true"
                      >
                        ⚽
                      </span>
                    )}

                    <div className="standings-table__team-text">
                      <span className="standings-table__team-name">
                        {row.teamName}
                      </span>
                      {row.teamCode && (
                        <span className="standings-table__team-code">
                          {row.teamCode}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                <td className="standings-table__cell standings-table__cell--num">
                  {row.played}
                </td>
                <td className="standings-table__cell standings-table__cell--num">
                  {row.won}
                </td>
                <td className="standings-table__cell standings-table__cell--num">
                  {row.drawn}
                </td>
                <td className="standings-table__cell standings-table__cell--num">
                  {row.lost}
                </td>
                <td className="standings-table__cell standings-table__cell--num">
                  {row.goalsFor}
                </td>
                <td className="standings-table__cell standings-table__cell--num">
                  {row.goalsAgainst}
                </td>
                <td className="standings-table__cell standings-table__cell--num">
                  {row.goalDifference}
                </td>

                <td className="standings-table__cell standings-table__cell--points">
                  {row.points}
                </td>

                <td className="standings-table__cell standings-table__cell--form">
                  {row.last5 && row.last5.length > 0 ? (
                    <ol
                      className="standings-table__form-list"
                      aria-label={`Last 5 results for ${row.teamName}`}
                    >
                      {row.last5.map((result, index) => (
                        <li
                          key={`${row.teamId}-form-${index}`}
                          className={getFormDotClass(result)}
                        >
                          <span className="sr-only">
                            {expandResultForScreenReaders(result)}
                          </span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <span className="standings-table__form-empty">
                      <span className="sr-only">
                        No recent form data for {row.teamName}
                      </span>
                      <span aria-hidden="true">–</span>
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
