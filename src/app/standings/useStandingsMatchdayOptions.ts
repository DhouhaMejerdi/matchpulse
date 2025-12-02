// =============================================================================
// HOOK: useStandingsMatchdayOptions
// -----------------------------------------------------------------------------
// Responsibility:
//   Fetch and normalise Matchday options for a given league + season from
//   /api/standings/matchdays, with a small client-side cache and status flags.
//
// Contracts:
//   • Called by useStandingsPageState with the current leagueId + seasonId.
//   • Returns { options, status, errorMessage } where options is a list of
//     StandingsFilterOption (value, label).
//
// Owner: Frontend Team • Last updated: 2025-12-01
// =============================================================================

import { useEffect, useState } from "react";
import type { StandingsFilterOption } from "./types";

type UseStandingsMatchdayOptionsArgs = {
  leagueId?: string | null;
  seasonId?: string | null;
};

type UseStandingsMatchdayOptionsResult = {
  options: StandingsFilterOption[];
  status: "idle" | "loading" | "success" | "error";
  errorMessage: string | null;
};

export function useStandingsMatchdayOptions(
  args: UseStandingsMatchdayOptionsArgs,
): UseStandingsMatchdayOptionsResult {
  const { leagueId, seasonId } = args;

  const [options, setOptions] = useState<StandingsFilterOption[]>([]);
  const [status, setStatus] =
    useState<UseStandingsMatchdayOptionsResult["status"]>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

useEffect(() => {
  // 1) If we don’t have both, we can’t query the API.
  if (!leagueId || !seasonId) {
    setOptions([]);
    setStatus("idle");
    setErrorMessage(null);
    return;
  }

  let isCancelled = false;
  const controller = new AbortController();

  // 2) Explicitly narrow to string so TS is happy.
  const ensuredLeagueId: string = leagueId;
  const ensuredSeasonId: string = seasonId;

  async function fetchMatchdayOptions() {
    setStatus("loading");
    setErrorMessage(null);

    try {
      const params = new URLSearchParams();
      params.set("leagueId", ensuredLeagueId);
      params.set("seasonId", ensuredSeasonId);

      const response = await fetch(
        `/api/standings/matchdays?${params.toString()}`,
        { signal: controller.signal },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load matchday options (status ${response.status})`,
        );
      }

      const json = (await response.json()) as {
        matchdays: StandingsFilterOption[];
      };

      if (isCancelled) return;

      setOptions(json.matchdays ?? []);
      setStatus("success");
    } catch (error) {
      if (isCancelled || error instanceof DOMException) return;

      // eslint-disable-next-line no-console
      console.error(
        "[useStandingsMatchdayOptions] Error fetching matchday options",
        error,
      );
      setStatus("error");
      setErrorMessage("Unable to load matchday options right now.");
      setOptions([]);
    }
  }

  fetchMatchdayOptions();

  return () => {
    isCancelled = true;
    controller.abort();
  };
}, [leagueId, seasonId]);


  return { options, status, errorMessage };
}
