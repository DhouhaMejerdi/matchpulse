# 📘 Match Pulse — /teams Data Loading Strategy (v1.0)

**Scope:** Define a **two-phase plan** for how the `/teams` page loads data:

1. **Phase 1 (v1.0):** Use existing mock data + a tiny artificial delay to exercise loading / empty / error states.  
2. **Phase 2 (vNext):** Swap to a real API via an adapter pattern, without rewriting the UI.

**Owner:** Frontend Team  
**Last updated:** 2025-11-07  

---

## 🧩 Responsibility

This document describes **how the Teams page gets its data**, not the UI itself.

- Where data loading should live.  
- How to **toggle** between mock + real data.  
- How to keep `/teams` UI **stable** while changing the backend.

It complements:

- `README_TeamsPageStates_Implementation.md`  
- `/teams` Page Implementation Plan (v1.0)  
- Styles Quality Gate (v1.1)  
- Frontend Architecture & Project Structure (v1.0)

---

## 🎯 High-Level Goals

| Goal | Description |
| --- | --- |
| ✅ **Exercise states** | Make sure loading / empty / error UIs are actually used, not theoretical. |
| ✅ **UI stability** | `/teams` React tree and styles remain stable when switching data sources. |
| ✅ **Adapter pattern** | All data loading goes through a small API layer, not scattered `fetch` calls. |
| ✅ **Env-driven** | Be able to toggle between `mock` and `api` modes without code changes. |
| ✅ **Testable** | Easy to simulate slow network, empty results, and errors. |

---

## 🧱 File Structure (Proposed)

```bash
src/
  app/
    teams/
      page.tsx           # Uses API adapter + status enum
      types.ts           # TeamSummary, LeagueMeta, TeamFormEntry, etc.
  lib/
    teams/
      api.ts             # Adapter: mock + (future) real API
      transforms.ts      # (vNext) Shape external API → TeamSummary
  components/
    teams/
      TeamsGridSkeleton.tsx
      TeamsEmptyState.tsx
      TeamCard.tsx
```

---

## Phase 1 — Mock Data + Tiny Artificial Delay

### 1.1 Goals

- Keep using `ALL_LEAGUES_MOCK_TEAMS` as the **source of truth**.  
- Add a **thin async layer** on top to:
  - Trigger `"loading"` → `"success"` transitions.  
  - Allow future `"error"` simulation.  
- Avoid any **real HTTP calls** for now (no keys, no quotas).

---

### 1.2 API Adapter (Mock Mode)

**File:** `src/lib/teams/api.ts`

**Responsibility:** Provide an async function that:

- Accepts `{ leagueId?: string }`.  
- Returns `Promise<TeamSummary[]>`.  
- Uses a small artificial delay to simulate network latency.

**Contract (v1.0):**

```ts
// src/lib/teams/api.ts
import { ALL_LEAGUES_MOCK_TEAMS } from "@/components/teams/__mocks__/teams.mock";
import type { TeamSummary } from "@/app/teams/types";
import { LEAGUE_META } from "@/lib/teams/leagues";

export type LoadTeamsParams = {
  leagueId?: string;
};

export async function loadTeamsMock(
  params: LoadTeamsParams
): Promise<TeamSummary[]> {
  const { leagueId } = params;

  // 1) Simulate network delay (~600–900ms)
  await new Promise((resolve) => setTimeout(resolve, 700));

  // 2) Filter by league, same logic as current page.tsx
  const leagueMeta = leagueId ? LEAGUE_META[leagueId] : undefined;
  const baseTeams = ALL_LEAGUES_MOCK_TEAMS;

  if (!leagueMeta) {
    return baseTeams;
  }

  return baseTeams.filter((team) => team.leagueName === leagueMeta.name);
}
```

> In v1.0 we **only export `loadTeamsMock`**, but the file is named `api.ts` so we can later add `loadTeamsFromApi` without changing imports in `page.tsx`.

---

### 1.3 `/teams/page.tsx` — Using `status` + async mock

**Current situation (v1.0):**

- `status` is a **constant**:  
  `const status: TeamsPageStatus = "success";`  
- `filteredTeams` is computed synchronously from `ALL_LEAGUES_MOCK_TEAMS`.

**Target (Phase 1):**

- Promote `status` to **state**:
  - Start at `"loading"`.  
  - Switch to `"success"` when `loadTeamsMock` resolves.  
  - Optionally set to `"error"` if `loadTeamsMock` throws (we can simulate this later).  
- Replace inline filter logic with a call to `loadTeamsMock({ leagueId })`.

**Conceptual sketch (not yet implemented):**

```ts
const [status, setStatus] = useState<TeamsPageStatus>("loading");
const [teams, setTeams] = useState<TeamSummary[]>([]);

useEffect(() => {
  let cancelled = false;

  setStatus("loading");

  loadTeamsMock({ leagueId: selectedLeagueId })
    .then((result) => {
      if (cancelled) return;
      setTeams(result);
      setStatus("success");
    })
    .catch(() => {
      if (cancelled) return;
      setStatus("error");
    });

  return () => {
    cancelled = true;
  };
}, [selectedLeagueId]);
```

Then, instead of `filteredTeams`, the `gridContent` branches become:

- `status === "loading"` → show skeleton.  
- `status === "success"` & `teams.length === 0` → show empty.  
- `status === "success"` & `teams.length > 0` → normal grid.  
- `status === "error"` → (vNext) show an error callout.

> For Phase 1, we can use **only `"loading"` + `"success"`** and treat `"error"` as “not used yet” but ready.

---

### 1.4 Tiny Steps to Introduce Async Mock (Implementation Order)

| Step | Description |
| --- | --- |
| 1️⃣ | Create `src/lib/teams/api.ts` with `loadTeamsMock` as above. |
| 2️⃣ | Promote `status` to state in `page.tsx` (start at `"loading"`). |
| 3️⃣ | Use `useEffect` to call `loadTeamsMock({ leagueId })` and update `status` + `teams`. |
| 4️⃣ | Remove old synchronous filter logic. |
| 5️⃣ | Test manually → skeleton appears → grid renders. |
| 6️⃣ | Run `npm run lint:css:fix && npm run check`. |

---

## Phase 2 — Real API (vNext) via Adapter Pattern

Phase 2 is **NOT for now**, but we want a clear path so future changes don’t wreck the UI.

### 2.1 Goals

- Introduce a **real football API** (e.g., API-Football or Football-Data.org).  
- Keep `/teams/page.tsx` mostly unchanged.  
- Use environment variables to switch between **mock** and **real** modes.

---

### 2.2 Adapter Design

**File:** `src/lib/teams/api.ts`

Evolution from Phase 1:

```ts
export async function loadTeams(params: LoadTeamsParams): Promise<TeamSummary[]> {
  if (process.env.NEXT_PUBLIC_TEAMS_API_MODE === "real") {
    return loadTeamsFromApi(params);
  }

  // Default: mock mode
  return loadTeamsMock(params);
}
```

Where:

- `loadTeamsMock` remains as in Phase 1.  
- `loadTeamsFromApi`:  
  - Calls a **Next.js Route Handler** or **server action** (never directly from client).  
  - Maps the external API shape → `TeamSummary[]` via `transforms.ts`.

---

### 2.3 Route Handler (Server-Side Fetch)

**File:** `src/app/api/teams/route.ts` (example)

- Receives `leagueId` as query param.  
- Calls real external API using `fetch` with API key in `process.env`.  
- Maps to internal `TeamSummary` objects.  
- Handles errors and returns a clean error shape to the client.

Then `loadTeamsFromApi` can simply:

```ts
export async function loadTeamsFromApi(
  params: LoadTeamsParams
): Promise<TeamSummary[]> {
  const url = new URL("/api/teams", window.location.origin);
  if (params.leagueId) {
    url.searchParams.set("leagueId", params.leagueId);
  }

  const res = await fetch(url.toString(), { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to load teams");
  }

  const data = await res.json();
  return data.teams as TeamSummary[];
}
```

> The **UI does not care** if data came from mocks or the real API — it only talks to `loadTeams()` and updates `status` + `teams`.

---

### 2.4 Error State Integration

Once `loadTeamsFromApi` is in play:

- Real network failures can occur.  
- We reuse the existing `status` enum:

  ```ts
  setStatus("loading");
  try {
    const result = await loadTeams(...);
    setTeams(result);
    setStatus("success");
  } catch (e) {
    setStatus("error");
  }
  ```

- For `status === "error"`, we can add a minimal UI:

  ```tsx
  if (status === "error") {
    gridContent = (
      <section className="teams-grid container">
        <div className="teams-grid__empty" role="status" aria-live="polite">
          <p className="teams-grid__empty-title">Unable to load teams.</p>
          <p className="teams-grid__empty-message">
            Please check your connection and try again.
          </p>
        </div>
      </section>
    );
  }
  ```

---

## ✅ Summary

- **Phase 1 (Now):**
  - Add `loadTeamsMock` with artificial delay.  
  - Promote `status` + `teams` to state in `/teams/page.tsx`.  
  - Drive UI purely from `status` + `teams.length`.

- **Phase 2 (Later):**
  - Add `loadTeamsFromApi` + route handler.  
  - Introduce `loadTeams` adapter that switches on `NEXT_PUBLIC_TEAMS_API_MODE`.  
  - Use the same `status` + `teams` state + branching UI.  
  - Implement real `"error"` branch.

This keeps your `/teams` page **professional, testable, and future-proof**, while still being safe and lightweight right now.

---

## 🧭 Developer Action Plan (for /teams API work)

| Step | File | Description | Owner |
|------|------|--------------|--------|
| 1️⃣ | `src/lib/teams/api.ts` | Add `loadTeamsMock()` with 700 ms delay. | Frontend |
| 2️⃣ | `src/app/teams/page.tsx` | Replace inline filter logic with `useEffect` using `loadTeamsMock()`. | Frontend |
| 3️⃣ | `src/lib/teams/api.ts` | Prepare placeholder for `loadTeamsFromApi()` (comment only). | Frontend |
| 4️⃣ | `.env.local` | Add `NEXT_PUBLIC_TEAMS_API_MODE=mock`. | DevOps |
| 5️⃣ | (Later) `src/app/api/teams/route.ts` | Implement real API proxy when backend key is ready. | Backend/Fullstack |
