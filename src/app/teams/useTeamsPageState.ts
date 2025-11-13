// =============================================================================
// HOOK: useTeamsPageState
// Responsibility: Encapsulate /teams filters, URL sync and derived teams list
// Contracts: Reads initial filters from search params; keeps league/search/sort
//            in local state; syncs updates back to the URL via
//            useTeamsFiltersUrlSync; exposes view model (status, leagueMeta,
//            filteredTeams, handlers) to the page.
// Owner: Frontend Team • Last updated: 2025-11-11
// =============================================================================
"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { DEFAULT_LEAGUE_ID, LEAGUE_META } from "@/lib/teams/leagues";
import { TeamSummary } from "./types";

export type TeamsPageStatus = "loading" | "success" | "error";

export type TeamsSortOrder = "alpha-asc" | "alpha-desc";

const DEFAULT_SORT_ORDER: TeamsSortOrder = "alpha-asc";

// -----------------------------------------------------------------------------
// HELPERS: parsing URL params → safe state (v1.0)
// -----------------------------------------------------------------------------
function parseSortOrder(param: string | null): TeamsSortOrder {
  if (param === "alpha-desc") return "alpha-desc";
  return DEFAULT_SORT_ORDER;
}

function parseSearchQuery(param: string | null): string {
  if (!param) return "";
  return param.trim().slice(0, 50);
}

// -----------------------------------------------------------------------------
// HOOK: useTeamsFiltersUrlSync
// -----------------------------------------------------------------------------
type FiltersUrlState = {
  leagueId?: string;
  search?: string;
  sortOrder?: TeamsSortOrder;
};

function useTeamsFiltersUrlSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const syncFiltersInUrl = (next: FiltersUrlState) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next.leagueId !== undefined) {
      if (!next.leagueId) {
        params.delete("league");
      } else {
        params.set("league", next.leagueId);
      }
    }

    if (next.search !== undefined) {
      if (!next.search) {
        params.delete("search");
      } else {
        params.set("search", next.search);
      }
    }

    if (next.sortOrder !== undefined) {
      if (next.sortOrder === DEFAULT_SORT_ORDER) {
        params.delete("sort");
      } else {
        params.set("sort", next.sortOrder);
      }
    }

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(nextUrl, { scroll: false });
  };

  return { searchParams, syncFiltersInUrl };
}

// -----------------------------------------------------------------------------
// HOOK: useLeagueTeamsData
// Responsibility: Fetch TeamSummary[] for the currently selected league
// Contracts: Calls /api/teams?leagueId=... and returns { teams, status }.
// Owner: Frontend Team • Last updated: 2025-11-11
// -----------------------------------------------------------------------------
function useLeagueTeamsData(leagueId: string) {
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [status, setStatus] = useState<TeamsPageStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");

      try {
        const res = await fetch(
          `/api/teams?leagueId=${encodeURIComponent(leagueId)}`
        );

        if (!res.ok) {
          throw new Error(`Failed to load teams: ${res.status}`);
        }

        const data: { teams?: TeamSummary[] } = await res.json();

        if (!cancelled) {
          setTeams(data.teams ?? []);
          setStatus("success");
        }
      } catch (error) {
        console.error("[useLeagueTeamsData] Error loading teams", error);
        if (!cancelled) {
          setTeams([]);
          setStatus("error");
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [leagueId]);

  return { teams, status };
}


// -----------------------------------------------------------------------------
// HOOK IMPLEMENTATION: useTeamsPageState
// -----------------------------------------------------------------------------
export function useTeamsPageState() {
  const { searchParams, syncFiltersInUrl } = useTeamsFiltersUrlSync();

  // League from URL (including synthetic "all-leagues")
  const [selectedLeagueId, setSelectedLeagueId] = useState(() => {
    const fromUrl = searchParams.get("league");

    if (fromUrl === "all-leagues") {
      return "all-leagues";
    }

    if (fromUrl && LEAGUE_META[fromUrl]) {
      return fromUrl;
    }

    return DEFAULT_LEAGUE_ID;
  });

  // 🔥 Fetch teams from the API for the current league
  const { teams: apiTeams, status: teamsStatus } =
    useLeagueTeamsData(selectedLeagueId);

  // This is what the page uses to decide loading / skeleton / error
  const status: TeamsPageStatus = teamsStatus;

  // Search + sort from URL
  const [searchQuery, setSearchQuery] = useState<string>(() =>
    parseSearchQuery(searchParams.get("search"))
  );

  const [sortOrder, setSortOrder] = useState<TeamsSortOrder>(() =>
    parseSortOrder(searchParams.get("sort"))
  );

  // Active league meta from config (or undefined for "all-leagues")
  const activeLeagueMeta =
    selectedLeagueId === "all-leagues"
      ? undefined
      : LEAGUE_META[selectedLeagueId];

  // 1) Scope to league (before search/sort)
  const leagueScopedTeams: TeamSummary[] = activeLeagueMeta
    ? apiTeams.filter((team) => team.leagueName === activeLeagueMeta.name)
    : apiTeams;

  const leagueTeamCount = leagueScopedTeams.length;

  // 2) Build banner meta with real team count
  const leagueMeta =
    activeLeagueMeta !== undefined
      ? { ...activeLeagueMeta, teamCount: leagueTeamCount }
      : undefined;

  // 3) Apply search + sort
  const filteredTeams = leagueScopedTeams
    .filter((team) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLocaleLowerCase();
      const teamName = team.name.toLocaleLowerCase();
      return teamName.includes(query);
    })
    .slice()
    .sort((a, b) => {
      const nameA = a.name.toLocaleLowerCase();
      const nameB = b.name.toLocaleLowerCase();

      if (sortOrder === "alpha-desc") {
        return nameB.localeCompare(nameA);
      }

      return nameA.localeCompare(nameB);
    });

  // Handlers (unchanged – they just sync state + URL)
  const handleLeagueChange = (nextLeagueId: string) => {
    setSelectedLeagueId(nextLeagueId);
    syncFiltersInUrl({ leagueId: nextLeagueId });
  };

  const handleSearchChange = (value: string) => {
    const normalised = parseSearchQuery(value);
    setSearchQuery(normalised);
    syncFiltersInUrl({ search: normalised });
  };

  const handleSortChange = (value: TeamsSortOrder) => {
    setSortOrder(value);
    syncFiltersInUrl({ sortOrder: value });
  };

  return {
    status,
    leagueMeta,
    filteredTeams,
    selectedLeagueId,
    searchQuery,
    sortOrder,
    handleLeagueChange,
    handleSearchChange,
    handleSortChange,
  };
}

