// =============================================================================
// PAGE: /teams
// Responsibility: Teams overview page (header + league banner + teams grid)
// Contracts: Holds selected league state; syncs league with URL search params;
//            derives filtered teams list; renders TeamsPageHeader, LeagueInfoBanner
//            and TeamsGrid with mock data; uses LEAGUE_META for contextual banner
// A11y: Lives inside <main id="main-content"> from RootLayout (no nested <main>)
// Owner: Frontend Team • Last updated: 2025-11-06
// =============================================================================
"use client";

import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import TeamsPageHeader from "./TeamsPageHeader";
import TeamsGrid from "./TeamsGrid";
import LeagueInfoBanner from "@/components/teams/LeagueInfoBanner";
import { ALL_LEAGUES_MOCK_TEAMS } from "@/components/teams/__mocks__/teams.mock";
import { DEFAULT_LEAGUE_ID, LEAGUE_META } from "@/lib/teams/leagues";

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function TeamsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // -- STATE ------------------------------------------------------------------
  // NOTE: Initialise league from ?league= param when present and valid,
  //       otherwise fall back to DEFAULT_LEAGUE_ID.
  const [selectedLeagueId, setSelectedLeagueId] = useState(() => {
    const fromUrl = searchParams.get("league");
    return fromUrl && LEAGUE_META[fromUrl] ? fromUrl : DEFAULT_LEAGUE_ID;
  });

  const leagueMeta = LEAGUE_META[selectedLeagueId];

  // Base teams list (mocked for v1.0; future versions can fetch by league).
  const baseTeams = ALL_LEAGUES_MOCK_TEAMS;

  // Derived teams list based on current league selection.
  const filteredTeams = baseTeams.filter((team) => {
    if (!leagueMeta) return true;
    // NOTE: For now we key off leagueName; future API may provide leagueId.
    return team.leagueName === leagueMeta.name;
  });

  // -- HANDLERS ---------------------------------------------------------------
  const handleLeagueChange = (nextLeagueId: string) => {
    setSelectedLeagueId(nextLeagueId);

    // Sync league selection to URL (?league=...) without full navigation.
    const params = new URLSearchParams(searchParams.toString());

    if (nextLeagueId === DEFAULT_LEAGUE_ID) {
      // Keep default league as "clean URL" by omitting the param.
      params.delete("league");
    } else {
      params.set("league", nextLeagueId);
    }

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(nextUrl, { scroll: false });
  };

  // -- RENDER -----------------------------------------------------------------
  return (
    <>
      <TeamsPageHeader
        league={selectedLeagueId}
        onLeagueChange={handleLeagueChange}
      />

      {leagueMeta && <LeagueInfoBanner league={leagueMeta} />}

      <TeamsGrid teams={filteredTeams} />
    </>
  );
}
