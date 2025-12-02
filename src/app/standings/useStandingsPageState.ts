// =============================================================================
// HOOK: useStandingsPageState
// -----------------------------------------------------------------------------
// Responsibility:
//   Encapsulates /standings page state: header filters (league/season/matchday),
//   URL sync, standings data retrieval, and all derived view-model fields used
//   by the client shell (<StandingsPageClient>) and presentational components
//   (header, filters, banner, legend, table).
//
//   In addition to header meta and table rows, this hook derives the league’s
//   latest completed matchday and the zone-visibility rule (shouldShowZones).
//   Zone stripes (Champions League / Europa / Relegation) are only meaningful
//   on the latest completed matchday; earlier matchdays hide zones, and future
//   matchdays are not surfaced in v1.0.
//
// Contracts:
//   • Reads initial filters from search params and keeps them in local state.
//   • Syncs filter updates back to the URL to maintain shareable state.
//   • Fetches standings data from /api/standings and normalises the payload
//     into a stable StandingsPageViewModel consumed by the UI.
//   • Exposes derived meta used by:
//       - <StandingsPageHeader>     → title, season label, matches played
//       - <StandingsHeaderFilters>  → controlled filter fields
//       - <StandingsLeagueBanner>   → league identity + status meta
//       - <StandingsZonesLegend>    → shown only when shouldShowZones=true
//       - <StandingsTable>          → table rows + zone-stripe visibility
//
// A11y:
//   Indirect. Ensures the header, banner, legend and table receive consistent,
//   data-driven props so users (including screen-reader users) never encounter
//   stale, misleading or incomplete copy.
//
// Owner: Frontend Team • Last updated: 2025-12-01
// =============================================================================

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type {
  StandingsTableRow,
  StandingsFilterOption,
  StandingsLeagueMeta,
  StandingsPageStatus,
  StandingsPageViewModel,
  StandingsApiResponse,
} from "./types";
import { useStandingsLeagueOptions } from "./useStandingsLeagueOptions";
import { useStandingsSeasonOptions } from "./useStandingsSeasonOptions";
import { useStandingsMatchdayOptions } from "./useStandingsMatchdayOptions";

// -- CONSTANTS ----------------------------------------------------------------

// NOTE: Default filter values. These are used when the URL has no params.
const DEFAULT_LEAGUE_ID = "premier-league";
const DEFAULT_SEASON_ID = "2024-25";
const DEFAULT_MATCHDAY_ID = "1";

// NOTE: Fallback league options used when /api/leagues is unavailable or
//       still loading. In a healthy state, leagueOptions will come from
//       useStandingsLeagueOptions().
const FALLBACK_LEAGUE_OPTIONS: StandingsFilterOption[] = [
  { value: "premier-league", label: "Premier League" },
  { value: "la-liga", label: "La Liga" },
  // TODO: Extend as needed.
];

// Optional: small static fallback for seasons if /api/standings/seasons fails.
const FALLBACK_SEASON_OPTIONS: StandingsFilterOption[] = [
  { value: "2024-25", label: "2024/25" },
  { value: "2023-24", label: "2023/24" },
];

// -- HOOK ---------------------------------------------------------------------

export function useStandingsPageState(): StandingsPageViewModel {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- 1) Initialise filters from URL ---------------------------------------

  const initialLeagueId =
    searchParams.get("leagueId") ?? DEFAULT_LEAGUE_ID;
  const initialSeasonId =
    searchParams.get("seasonId") ?? DEFAULT_SEASON_ID;
  const initialMatchdayId =
    searchParams.get("matchday") ?? DEFAULT_MATCHDAY_ID;

  const [leagueId, setLeagueId] = useState(initialLeagueId);
  const [seasonId, setSeasonId] = useState(initialSeasonId);
  const [matchdayId, setMatchdayId] = useState(initialMatchdayId);

  // API-driven league options (with internal fallback logic below).
  const { options: leagueOptionsFromApi } = useStandingsLeagueOptions();

  // --- 2) Standings data + meta ---------------------------------------------

  const [status, setStatus] = useState<StandingsPageStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rows, setRows] = useState<StandingsTableRow[]>([]);
  const [leagueMeta, setLeagueMeta] = useState<StandingsLeagueMeta | null>(
    null,
  );

  useEffect(() => {
    let isCancelled = false;

    async function fetchStandings() {
      setStatus("loading");
      setErrorMessage(null);

      try {
        const params = new URLSearchParams({
          leagueId,
          seasonId,
          matchday: matchdayId, // matches /api/standings query param
        });

        const response = await fetch(`/api/standings?${params.toString()}`);

        if (!response.ok) {
          throw new Error(
            `Failed to load standings (status ${response.status})`,
          );
        }

        const json = (await response.json()) as StandingsApiResponse;

        if (isCancelled) return;

        setRows(json.rows);
        setLeagueMeta(json.leagueMeta);
        setStatus("success");
      } catch (error) {
        if (isCancelled) return;

        // eslint-disable-next-line no-console
        console.error(
          "[useStandingsPageState] Error fetching standings",
          error,
        );
        setStatus("error");
        setErrorMessage("Unable to load standings right now.");
        setRows([]);
        setLeagueMeta(null);
      }
    }

    fetchStandings();

    return () => {
      isCancelled = true;
    };
  }, [leagueId, seasonId, matchdayId]);

  // --- 3) Keep filters in sync with URL -------------------------------------

  const syncFiltersToUrl = (next: {
    leagueId?: string;
    seasonId?: string;
    matchdayId?: string;
  }) => {
    const current = new URLSearchParams(searchParams.toString());

    if (next.leagueId) current.set("leagueId", next.leagueId);
    if (next.seasonId) current.set("seasonId", next.seasonId);
    if (next.matchdayId) current.set("matchday", next.matchdayId);

    router.replace(`${pathname}?${current.toString()}`);
  };

  const handleLeagueChange = (nextLeagueId: string) => {
    if (nextLeagueId === leagueId) return;
    setLeagueId(nextLeagueId);
    syncFiltersToUrl({ leagueId: nextLeagueId });
  };

  const handleSeasonChange = (nextSeasonId: string) => {
    setSeasonId(nextSeasonId);
    syncFiltersToUrl({ seasonId: nextSeasonId });
  };

  const handleMatchdayChange = (nextMatchdayId: string) => {
    setMatchdayId(nextMatchdayId);
    syncFiltersToUrl({ matchdayId: nextMatchdayId });
  };

  // --- 4) Derive header meta -------------------------------------------------

  const headerTitle = "Standings";

  const headerSeasonLabel = leagueMeta?.seasonLabel ?? "Current season";
  const headerMatchesPlayedLabel =
    leagueMeta?.matchesPlayedLabel ?? undefined;

  // --- 5) Options (league, season, matchday) --------------------------------

  // 5.1 League options: API → fallback
  const leagueOptions = useMemo<StandingsFilterOption[]>(() => {
    if (leagueOptionsFromApi.length > 0) {
      return leagueOptionsFromApi;
    }
    return FALLBACK_LEAGUE_OPTIONS;
  }, [leagueOptionsFromApi]);

  // 5.2 Season options: API → fallback
  const {
    options: seasonOptionsFromApi,
    // status: seasonsStatus,
    // errorMessage: seasonsErrorMessage,
  } = useStandingsSeasonOptions(leagueId);

  const seasonOptions = useMemo<StandingsFilterOption[]>(() => {
    if (seasonOptionsFromApi.length > 0) {
      return seasonOptionsFromApi;
    }
    return FALLBACK_SEASON_OPTIONS;
  }, [seasonOptionsFromApi]);

  // Keep seasonId valid when the available season options change.
  useEffect(() => {
    if (seasonOptions.length === 0) return;

    const stillValid = seasonOptions.some(
      (option) => option.value === seasonId,
    );

    if (!stillValid) {
      const nextSeasonId = seasonOptions[0]?.value;
      if (!nextSeasonId) return;

      setSeasonId(nextSeasonId);
      syncFiltersToUrl({ seasonId: nextSeasonId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seasonOptions]);

  // 5.3 Matchday options: API → fallback to derived from totalMatchdays
  const { options: matchdayOptionsFromApi } = useStandingsMatchdayOptions({
    leagueId,
    seasonId,
  });

  const matchdayOptions = useMemo<StandingsFilterOption[]>(() => {
    // 1) Preferred: options from /api/standings/matchdays
    if (matchdayOptionsFromApi.length > 0) {
      return matchdayOptionsFromApi;
    }

    // 2) Fallback: derive from leagueMeta.totalMatchdays (previous behaviour)
    const totalMatchdays = leagueMeta?.totalMatchdays ?? 38;

    return Array.from({ length: totalMatchdays }, (_unused, index) => {
      const matchday = String(index + 1);
      return {
        value: matchday,
        label: `Matchday ${matchday}`,
      };
    });
  }, [matchdayOptionsFromApi, leagueMeta?.totalMatchdays]);

  // --- 6) Derived: Zones visibility ------------------------------------------

  const latestCompletedMatchday = useMemo(() => {
    // 1) Preferred: API provides currentMatchday directly.
    if (leagueMeta?.currentMatchday) {
      return String(leagueMeta.currentMatchday);
    }

    // 2) Fallback: parse first number from "38 matches played".
    if (leagueMeta?.matchesPlayedLabel) {
      const m = leagueMeta.matchesPlayedLabel.match(/\d+/);
      if (m) return m[0]; // e.g. "38"
    }

    // 3) Final fallback: assume at least matchday 1.
    return "1";
  }, [leagueMeta]);

  // Zones appear only on the latest completed matchday. Earlier matchdays hide
  // CL/Europa/Relegation stripes, and future matchdays are not exposed in the
  // filter, so we never render zones for unplayed rounds.
  const shouldShowZones = matchdayId === latestCompletedMatchday;

  // --- 7) View model ---------------------------------------------------------
  return {
    status,
    errorMessage,

    leagueId,
    seasonId,
    matchdayId,
    leagueOptions,
    seasonOptions,
    matchdayOptions,
    onLeagueChange: handleLeagueChange,
    onSeasonChange: handleSeasonChange,
    onMatchdayChange: handleMatchdayChange,

    headerTitle,
    headerSeasonLabel,
    headerMatchesPlayedLabel,

    leagueMeta,
    rows,

    shouldShowZones,
    latestCompletedMatchday,
  };
}
