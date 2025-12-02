// =============================================================================
// COMPONENT: StandingsZonesLegend
// -----------------------------------------------------------------------------
// Responsibility: Visual legend explaining the zone colors used in the league
//                 standings table (Champions League, Europa League, Relegation).
//
// Contracts: Pure presentational component. No props in v1.0. Visibility is
//            controlled by the parent (vm.shouldShowZones).
//
// A11y: Section labelled for screen readers; each swatch is aria-hidden with a
//       text label beside it for clear non-visual meaning.
// Owner: Frontend Team • Last updated: 2025-11-27
// =============================================================================

import * as React from "react";

export default function StandingsZonesLegend(): React.ReactElement {
  return (
    <section
      className="standings-zones-legend container"
      aria-labelledby="standings-zones-legend-heading"
    >
      <h2 id="standings-zones-legend-heading" className="sr-only">
        League qualification and relegation legend
      </h2>

      <ul className="standings-zones-legend__list" role="list">
        <li className="standings-zones-legend__item standings-zones-legend__item--cl">
          <span aria-hidden="true" className="standings-zones-legend__swatch" />
          <span className="standings-zones-legend__label">Champions League</span>
        </li>

        <li className="standings-zones-legend__item standings-zones-legend__item--eu">
          <span aria-hidden="true" className="standings-zones-legend__swatch" />
          <span className="standings-zones-legend__label">Europa League</span>
        </li>

        <li className="standings-zones-legend__item standings-zones-legend__item--rel">
          <span aria-hidden="true" className="standings-zones-legend__swatch" />
          <span className="standings-zones-legend__label">Relegation</span>
        </li>
      </ul>
    </section>
  );
}
