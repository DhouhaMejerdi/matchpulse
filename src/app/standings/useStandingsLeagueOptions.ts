"use client";

// =============================================================================
// HOOK: useStandingsLeagueOptions
// -----------------------------------------------------------------------------
// Responsibility: Fetch /api/leagues and expose a normalized options list for
//                 the /standings header "League" selector.
// Contracts: Client-only; returns { options, status } where options is a list
//            of StandingsFilterOption and status is "idle" | "loading"
//            | "success" | "error" for simple UI states.
// A11y: N/A (data layer hook; no direct DOM interaction).
// Owner: Frontend Team • Last updated: 2025-11-28
// =============================================================================

import { useEffect, useState } from "react";
import type { StandingsFilterOption } from "./types";

// -- TYPES --------------------------------------------------------------------

/**
 * Minimal shape returned by /api/leagues for each league.
 * Kept local to this hook so upstream changes are isolated here.
 */
type LeagueOptionApi = {
  id: string; // Internal league id/slug, e.g. "premier-league"
  name: string; // Human-readable name, e.g. "Premier League"
  countryCode: string; // ISO code, e.g. "ENG"
  slug: string; // SEO slug, e.g. "england-premier-league"
  crestUrl: string | null;
};

type LeaguesApiResponse = {
  leagues: LeagueOptionApi[];
};

type Status = "idle" | "loading" | "success" | "error";

// -- HOOK ---------------------------------------------------------------------

/**
 * Load league options for the /standings "League" filter.
 *
 * Normalizes the backend leagues list into StandingsFilterOption[], so the
 * header and any other consumers depend only on our internal contract and
 * not on the upstream /api/leagues shape.
 */
export function useStandingsLeagueOptions(): {
  options: StandingsFilterOption[];
  status: Status;
} {
  const [options, setOptions] = useState<StandingsFilterOption[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    let isMounted = true;

    async function loadLeagues() {
      try {
        setStatus("loading");

        const response = await fetch("/api/leagues", {
          // NOTE: Leagues list is slow-changing; lightweight revalidation is OK.
          next: { revalidate: 60 },
        });

        if (!response.ok) {
          throw new Error(`Failed to load leagues (${response.status})`);
        }

        const data: LeaguesApiResponse = await response.json();

        if (!isMounted) return;

        const mapped: StandingsFilterOption[] = data.leagues.map((league) => ({
          // Contracts: "value" is the leagueId slug used by /api/standings
          // and URL filters (e.g. "premier-league").
          value: league.id,
          // UI label shown in the League selector.
          label: league.name,
        }));

        setOptions(mapped);
        setStatus("success");
      } catch (error) {
        if (!isMounted) return;

        // NOTE: We log for debugging; UI should react to "error" status.
        // TEST: Consider a fixture that simulates /api/leagues 500/429.
        // eslint-disable-next-line no-console
        console.error(
          "[useStandingsLeagueOptions] Failed to load leagues",
          error,
        );

        setStatus("error");
      }
    }

    loadLeagues();

    return () => {
      // NOTE: Guard against setting state after unmount in slow networks.
      isMounted = false;
    };
  }, []);

  return { options, status };
}
