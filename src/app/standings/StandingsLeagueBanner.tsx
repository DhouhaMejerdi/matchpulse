// =============================================================================
// COMPONENT: StandingsLeagueBanner
// -----------------------------------------------------------------------------
// Responsibility: Show current league context for /standings
//                 (name, country, season, match meta) above the table.
// Contracts: Presentational only; no data fetching. Receives a StandingsLeagueMeta
//            object from the page view model plus an isLoading flag. Handles
//            three states:
//            - loading: renders a lightweight skeleton card
//            - success: renders league identity + matchday/updated meta
//            - missing meta: renders a neutral fallback message
// A11y: Self-contained section labelled by an internal <h2> and with meta
//       expressed as a <dl>. Intended to live inside <main id="main-content">
//       on the /standings page.
// Owner: Frontend Team • Last updated: 2025-11-26
// =============================================================================

import * as React from "react";
import type { StandingsLeagueMeta } from "./types";

// -- PROPS --------------------------------------------------------------------

export type StandingsLeagueBannerProps = {
  /** League meta from useStandingsPageState (or null before first load). */
  meta: StandingsLeagueMeta | null;
  /** When true, renders a skeleton placeholder instead of real content. */
  isLoading?: boolean;
};

// -- HELPERS ------------------------------------------------------------------

function buildMatchdayLabel(
  currentMatchday: number | null,
  totalMatchdays: number | null,
): string | undefined {
  if (!currentMatchday && !totalMatchdays) return undefined;

  if (currentMatchday && totalMatchdays) {
    return `Matchday ${currentMatchday} of ${totalMatchdays}`;
  }

  if (currentMatchday) {
    return `Matchday ${currentMatchday}`;
  }

  // Only totalMatchdays is known – not ideal, but still better than nothing.
  return `Matchday data · ${totalMatchdays} total`;
}

// -- COMPONENT ----------------------------------------------------------------

export default function StandingsLeagueBanner(
  props: StandingsLeagueBannerProps,
): React.ReactElement {
  const { meta, isLoading = false } = props;

  // 1) Loading state: simple skeleton card to avoid layout shift.
  if (isLoading) {
    return (
      <section
        className="standings-league container"
        aria-label="League overview is loading"
        aria-busy="true"
      >
        <div className="standings-league__inner standings-league__inner--skeleton">
          <div className="standings-league__identity">
            <div className="standings-league__crest-skeleton" />
            <div className="standings-league__heading">
              <div className="standings-league__title-skeleton" />
              <div className="standings-league__subtitle-skeleton" />
            </div>
          </div>

          <div className="standings-league__meta standings-league__meta--skeleton">
            <div className="standings-league__meta-item-skeleton" />
            <div className="standings-league__meta-item-skeleton" />
          </div>
        </div>
      </section>
    );
  }

  // 2) No meta available (e.g. API error): render a neutral fallback.
  if (!meta) {
    return (
      <section
        className="standings-league container"
        aria-label="League overview unavailable"
      >
        <div className="standings-league__inner standings-league__inner--empty">
          <div className="standings-league__identity">
            <div
              className="standings-league__crest-placeholder"
              aria-hidden="true"
            >
              🏆
            </div>
            <div className="standings-league__heading">
              <h2
                id="standings-league-heading"
                className="standings-league__title"
              >
                League overview unavailable
              </h2>
              <p className="standings-league__subtitle">
                We couldn&apos;t load league details. Standings below may still
                be available.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 3) Happy path: render real meta.
  const {
    leagueName,
    countryName,
    countryCode,
    seasonLabel,
    currentMatchday,
    totalMatchdays,
    lastUpdatedLabel,
    crestUrl,
  } = meta;

  const countryLine =
    countryName && countryCode
      ? `${countryName} · ${countryCode}`
      : countryName || countryCode || "";

  const matchdayLabel = buildMatchdayLabel(
    currentMatchday,
    totalMatchdays,
  );

  const hasMetaRow = Boolean(matchdayLabel || lastUpdatedLabel);

  return (
    <section
      className="standings-league container"
      aria-labelledby="standings-league-heading"
    >
      <div className="standings-league__inner">
        {/* Crest / identity --------------------------------------------------- */}
        <div className="standings-league__identity">
          {crestUrl ? (
            <div className="standings-league__crest-wrapper">
              <img
                src={crestUrl}
                alt=""
                className="standings-league__crest"
                loading="lazy"
              />
            </div>
          ) : (
            <div
              className="standings-league__crest-placeholder"
              aria-hidden="true"
            >
              🏆
            </div>
          )}

          <div className="standings-league__heading">
            <h2
              id="standings-league-heading"
              className="standings-league__title"
            >
              {leagueName}
            </h2>

            {countryLine || seasonLabel ? (
              <p className="standings-league__subtitle">
                {countryLine}
                {countryLine && seasonLabel ? " · " : ""}
                {seasonLabel}
              </p>
            ) : null}
          </div>
        </div>

        {/* Meta: matchday, last updated -------------------------------------- */}
        {hasMetaRow && (
          <dl
            className="standings-league__meta"
            aria-label="League standings meta"
          >
            {matchdayLabel && (
              <div className="standings-league__meta-item">
                <dt className="standings-league__meta-label">Matchday</dt>
                <dd className="standings-league__meta-value">
                  {matchdayLabel}
                </dd>
              </div>
            )}

            {lastUpdatedLabel && (
              <div className="standings-league__meta-item">
                <dt className="standings-league__meta-label">Last updated</dt>
                <dd className="standings-league__meta-value">
                  {lastUpdatedLabel}
                </dd>
              </div>
            )}
          </dl>
        )}
      </div>
    </section>
  );
}
