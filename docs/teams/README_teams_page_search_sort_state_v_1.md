# 📘 Match Pulse — `/teams` Search & Sort State Model (v1.0)

**Module:** `/teams/page.tsx`  
**Owner:** Frontend Team  
**Last updated:** 2025-11-10

---

## 🧩 Responsibility

Extend the `/teams` page with **typed, sanitized state** for search and sort controls.

- Manage `searchQuery` and `sortOrder` as controlled state in React.  
- Initialize both from URL query parameters (`?search=&sort=`).  
- Sanitize all incoming values for stability and security.  
- Prepare foundation for filtering and sorting logic in later phases.

---

## 🎯 Goals

| Goal | Description |
| --- | --- |
| ✅ **Typed state** | Define strict `TeamsSortOrder` union to constrain sort values. |
| ✅ **Sanitized URL parsing** | Normalize, trim, and length-limit search input; validate sort values. |
| ✅ **Future-proof** | Structure state cleanly for integration with `TeamsSearchField` and `TeamsSortSelect`. |
| ✅ **Tokens-agnostic** | Keep state logic UI-independent and reusable. |
| ✅ **No side effects** | No API calls or filtering performed yet; only state modeling. |

---

## 🧱 File Structure

```bash
src/
  app/
    teams/
      page.tsx          # Main page (search/sort state defined here)
      TeamsPageHeader.tsx
      TeamsSearchField.tsx
      TeamsSortSelect.tsx

docs/
  teams/
    README_TeamsPage_SearchSort_State.md
```

---

## 🧠 Type Definition

```ts
type TeamsSortOrder = "alpha-asc" | "alpha-desc";
const DEFAULT_SORT_ORDER: TeamsSortOrder = "alpha-asc";

function parseSortOrder(param: string | null): TeamsSortOrder {
  if (param === "alpha-desc") return "alpha-desc";
  return DEFAULT_SORT_ORDER; // fallback for unknown/missing values
}

function parseSearchQuery(param: string | null): string {
  if (!param) return "";
  return param.trim().slice(0, 50); // prevent excessive length or spaces
}
```

### 🧩 Explanation
- **`TeamsSortOrder`**: a union ensures only valid sort modes are stored.
- **`parseSortOrder()`**: clamps arbitrary inputs to known values.
- **`parseSearchQuery()`**: removes whitespace, limits to 50 chars, avoids injection.

---

## ⚙️ Implementation in `/teams/page.tsx`

```tsx
// -- STATE ------------------------------------------------------------------
const [selectedLeagueId, setSelectedLeagueId] = useState(() => {
  const fromUrl = searchParams.get("league");
  return fromUrl && LEAGUE_META[fromUrl] ? fromUrl : DEFAULT_LEAGUE_ID;
});

// New state additions -------------------------------------------------------
const [searchQuery, setSearchQuery] = useState<string>(() =>
  parseSearchQuery(searchParams.get("search"))
);

const [sortOrder, setSortOrder] = useState<TeamsSortOrder>(() =>
  parseSortOrder(searchParams.get("sort"))
);
```

At this stage, `searchQuery` and `sortOrder` are typed and safe to pass as props to child components (`TeamsPageHeader`, `TeamsSearchField`, `TeamsSortSelect`).

---

## 🧠 Future Integration (Phase 4–5)

| Feature | Description |
| --- | --- |
| **Filtering logic** | Use `searchQuery` and `sortOrder` to derive `filteredTeams` inside `/teams/page.tsx`. |
| **Controlled inputs** | Convert `TeamsSearchField` and `TeamsSortSelect` to controlled components using these props. |
| **URL sync** | Push updates to query params (`?search=&sort=`) using `router.replace()`. |
| **Analytics hooks** | Fire events `teams_search_change` and `teams_sort_change`. |

---

## ✅ Definition of Done

| Category | Requirement |
| --- | --- |
| **Typed** | `TeamsSortOrder` union declared and used. |
| **Sanitized** | Search and sort parsed safely from URL. |
| **Initialized** | `useState` values populate correctly on page load. |
| **CI-compliant** | Lint, Typecheck, Build pass under `npm run verify`. |
| **Agnostic** | No UI or filtering logic introduced yet. |
| **Documented** | This README committed under `docs/teams/`. |