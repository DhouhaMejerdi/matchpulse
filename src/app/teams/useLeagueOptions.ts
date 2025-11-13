// =============================================================================
// HOOK: useLeagueOptions
// Responsibility: Fetch /api/leagues and expose options for LeagueFilter
// Contracts: Returns { options, isLoading, isError }. Includes synthetic
//            "All leagues" option first, and falls back to static LEAGUE_OPTIONS
//            if the API fails.
// Owner: Frontend Team • Last updated: 2025-11-11
// =============================================================================

"use client";

import { useEffect, useState } from "react";
import type { LeagueOption } from "./types";
import { LEAGUE_OPTIONS } from "@/lib/teams/leagues";

const ALL_LEAGUES_OPTION: LeagueOption = {
  id: "all-leagues",
  name: "All leagues",
  countryCode: "XX",
  slug: "all-leagues",
};

type UseLeagueOptionsState = {
  options: LeagueOption[];
  isLoading: boolean;
  isError: boolean;
};

export function useLeagueOptions(): UseLeagueOptionsState {
  const [options, setOptions] = useState<LeagueOption[]>([
    ALL_LEAGUES_OPTION,
    // initial fallback (static config) while we fetch real data
    ...LEAGUE_OPTIONS.filter((opt) => opt.id !== "all-leagues"),
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setIsLoading(true);
        setIsError(false);

        const res = await fetch("/api/leagues");

        if (!res.ok) {
          throw new Error(`Failed to fetch leagues: ${res.status}`);
        }

        const data: { leagues: LeagueOption[] } = await res.json();

        if (!isMounted) return;

        // prepend synthetic "All leagues" option
        setOptions([ALL_LEAGUES_OPTION, ...data.leagues]);
      } catch (error) {
        console.error("useLeagueOptions: error fetching leagues", error);
        if (!isMounted) return;

        // On error, keep the static fallback and mark error state
        setIsError(true);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { options, isLoading, isError };
}
