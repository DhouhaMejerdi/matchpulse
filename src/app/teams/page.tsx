// =============================================================================
// PAGE: /teams
// Responsibility: Teams overview page (header + league banner + teams grid)
// Contracts: Holds league/search/sort state; syncs filters with URL search
//            params; derives filtered teams list; renders TeamsPageHeader,
//            LeagueInfoBanner and TeamsGrid with mock data; uses LEAGUE_META
//            for contextual banner
// A11y: Lives inside <main id="main-content"> from RootLayout (no nested <main>)
// Owner: Frontend Team • Last updated: 2025-11-10
// =============================================================================
"use client";

import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import TeamsPageHeader from "./TeamsPageHeader";
import TeamsGrid from "./TeamsGrid";
import LeagueInfoBanner from "@/components/teams/LeagueInfoBanner";
import { ALL_LEAGUES_MOCK_TEAMS } from "@/components/teams/__mocks__/teams.mock";
import { DEFAULT_LEAGUE_ID, LEAGUE_META } from "@/lib/teams/leagues";
import TeamsEmptyState from "@/components/teams/TeamsEmptyState";
import TeamsGridSkeleton from "@/components/teams/TeamsGridSkeleton";

type TeamsPageStatus = "loading" | "success" | "error";

// -----------------------------------------------------------------------------
// SEARCH & SORT STATE MODEL (v1.0)
// -----------------------------------------------------------------------------

type TeamsSortOrder = "alpha-asc" | "alpha-desc";

const DEFAULT_SORT_ORDER: TeamsSortOrder = "alpha-asc";

function parseSortOrder(param: string | null): TeamsSortOrder {
  if (param === "alpha-desc") return "alpha-desc";
  return DEFAULT_SORT_ORDER; // fallback for unknown or missing values
}

function parseSearchQuery(param: string | null): string {
  if (!param) return "";
  return param.trim().slice(0, 50); // prevent excessive length or spaces
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function TeamsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ---------------------------------------------------------------------------
  // STATUS / DATA LOADING MODEL (v1.0)
  // ---------------------------------------------------------------------------
  // NOTE:
  // - For v1.0, teams data comes from ALL_LEAGUES_MOCK_TEAMS (synchronous),
  //   so we hard-code status to "success" and skip any real loading UI.
  const status: TeamsPageStatus = "success";

  // -- STATE ------------------------------------------------------------------
  // NOTE: Initialise league from ?league= param when present and valid,
  //       otherwise fall back to DEFAULT_LEAGUE_ID.
  const [selectedLeagueId, setSelectedLeagueId] = useState(() => {
    const fromUrl = searchParams.get("league");
    return fromUrl && LEAGUE_META[fromUrl] ? fromUrl : DEFAULT_LEAGUE_ID;
  });

  // Search + sort are initialised from URL params for deep-linking.
  const [searchQuery, setSearchQuery] = useState<string>(() =>
    parseSearchQuery(searchParams.get("search"))
  );

  const [sortOrder, setSortOrder] = useState<TeamsSortOrder>(() =>
    parseSortOrder(searchParams.get("sort"))
  );

  const leagueMeta = LEAGUE_META[selectedLeagueId];

  // Base teams list (mocked for v1.0; future versions can fetch by league).
  const baseTeams = ALL_LEAGUES_MOCK_TEAMS;

  // Derived teams list based on current filters (league + search + sort).
  const filteredTeams = baseTeams
    // 1) League filter
    .filter((team) => {
      if (!leagueMeta) return true;
      // NOTE: For now we key off leagueName; future API may provide leagueId.
      return team.leagueName === leagueMeta.name;
    })
    // 2) Search filter (case-insensitive substring match on team name)
    .filter((team) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLocaleLowerCase();
      const teamName = team.name.toLocaleLowerCase();
      return teamName.includes(query);
    })
    // 3) Sort order (A–Z / Z–A by team name)
    .slice() // defensive copy before sort in case baseTeams is shared
    .sort((a, b) => {
      const nameA = a.name.toLocaleLowerCase();
      const nameB = b.name.toLocaleLowerCase();

      if (sortOrder === "alpha-desc") {
        return nameB.localeCompare(nameA);
      }

      // Default: alpha-asc
      return nameA.localeCompare(nameB);
    });

  let gridContent: React.ReactNode;

  if (status === "loading") {
    gridContent = (
      <section className="teams-grid container" aria-busy="true">
        <p className="teams-grid__status" aria-live="polite">
          🌀 Loading teams…
        </p>
        <TeamsGridSkeleton />
      </section>
    );
  } else if (filteredTeams.length === 0) {
    gridContent = (
      <section className="teams-grid container">
        <TeamsEmptyState />
      </section>
    );
  } else {
    gridContent = (
      <section className="teams-grid container">
        <TeamsGrid teams={filteredTeams} />
      </section>
    );
  }

  // -- HELPERS ---------------------------------------------------------------
  // Keeps URL search params in sync with the current filters without
  // triggering a full navigation or scroll reset.
  const updateFiltersInUrl = (next: {
    leagueId?: string;
    search?: string;
    sortOrder?: TeamsSortOrder;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next.leagueId !== undefined) {
      if (next.leagueId === DEFAULT_LEAGUE_ID) {
        // Keep default league as clean URL by omitting the param.
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
        // Default sort does not need a query param.
        params.delete("sort");
      } else {
        params.set("sort", next.sortOrder);
      }
    }

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(nextUrl, { scroll: false });
  };

  // -- HANDLERS ---------------------------------------------------------------
  const handleLeagueChange = (nextLeagueId: string) => {
    setSelectedLeagueId(nextLeagueId);
    updateFiltersInUrl({ leagueId: nextLeagueId });
  };

  const handleSearchChange = (value: string) => {
    const normalised = parseSearchQuery(value);
    setSearchQuery(normalised);
    updateFiltersInUrl({ search: normalised });
  };

  const handleSortChange = (value: TeamsSortOrder) => {
    setSortOrder(value);
    updateFiltersInUrl({ sortOrder: value });
  };

  // -- RENDER -----------------------------------------------------------------
  return (
    <>
      <TeamsPageHeader
        league={selectedLeagueId}
        onLeagueChange={handleLeagueChange}
        search={searchQuery}
        onSearchChange={handleSearchChange}
        sort={sortOrder}
        onSortChange={handleSortChange}
      />

      {leagueMeta && <LeagueInfoBanner league={leagueMeta} />}

      {gridContent}
    </>
  );
}
