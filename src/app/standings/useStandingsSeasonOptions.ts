"use client";

/* =============================================================================
   HOOK: useStandingsSeasonOptions
   -----------------------------------------------------------------------------
   Responsibility: Load Season options for /standings header, based on leagueId.
   Consumers: useStandingsPageState (view model for /standings).
   Data flow:
     /api/standings/seasons?leagueId=... → { seasons: StandingsFilterOption[] }
   Owner: Frontend Team • Last updated: 2025-12-01
   ========================================================================== */

import * as React from "react";
import type { StandingsFilterOption } from "./types";

// -----------------------------------------------------------------------------
// Local types
// -----------------------------------------------------------------------------

type Status = "idle" | "loading" | "success" | "error";

type SeasonsApiResponse = {
  seasons: StandingsFilterOption[];
};

// -----------------------------------------------------------------------------
// Hook implementation
// -----------------------------------------------------------------------------

export function useStandingsSeasonOptions(
  leagueId: string | null | undefined
): {
  options: StandingsFilterOption[];
  status: Status;
  errorMessage: string | null;
} {
  const [options, setOptions] = React.useState<StandingsFilterOption[]>([]);
  const [status, setStatus] = React.useState<Status>("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    // No league selected yet → reset and do nothing.
    if (!leagueId) {
      setOptions([]);
      setStatus("idle");
      setErrorMessage(null);
      return;
    }

    let isCancelled = false;
    const controller = new AbortController();

    async function loadSeasons() {
      try {
        setStatus("loading");
        setErrorMessage(null);

        const response = await fetch(
        `/api/standings/seasons?leagueId=${encodeURIComponent(leagueId ?? "")}`,
        { signal: controller.signal }
        );


        if (!response.ok) {
          // Optionally, you can parse a JSON error shape here.
          if (!isCancelled) {
            setStatus("error");
            setErrorMessage("Unable to load seasons.");
          }
          return;
        }

        const data: SeasonsApiResponse = await response.json();

        if (!isCancelled) {
          setOptions(data.seasons ?? []);
          setStatus("success");
        }
      } catch (error) {
        // Ignore aborts
        if (isCancelled || (error instanceof DOMException && error.name === "AbortError")) {
          return;
        }

        console.error(
          "[useStandingsSeasonOptions] Unexpected error while loading seasons",
          error
        );

        if (!isCancelled) {
          setStatus("error");
          setErrorMessage("Unable to load seasons.");
        }
      }
    }

    loadSeasons();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [leagueId]);

  return { options, status, errorMessage };
}
