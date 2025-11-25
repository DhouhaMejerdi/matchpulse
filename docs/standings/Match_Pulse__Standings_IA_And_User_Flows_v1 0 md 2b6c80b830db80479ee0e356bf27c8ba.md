# Match_Pulse__Standings_IA_And_User_Flows_v1.0.md

**Owner:** UX & Frontend Team

**Audience:** Junior → Senior Engineers

**Status:** v1.0

**Last Updated:** 2025-11-25

---

# 1. Information Architecture (IA)

The Standings Page fits into the Match Pulse navigation system as a **primary content page**, alongside Matches, Teams, and (future) Team Detail pages.

## 1.1 Route Structure

```
/standings
  └── ?league=premier-league   (optional; defaults to PL)

```

- Route mirrors structure of `/teams`.
- League selection is URL-controlled for shareability and future SEO.

---

## 1.2 Sitemap Context (Global IA)

```
<Header Navigation>
  /matches
  /standings     ← Current Page
  /teams
  /team/[id]     (future)

```

Standings is positioned between Matches and Teams for intuitive league exploration.

---

## 1.3 Content Zones (Page Anatomy)

```
<main id="main-content">

  1) Page Header
     • H1 “Standings”
     • Subtitle: “Current season • {n} matches played”

  2) Filter Controls
     • League selector (reuses /teams control patterns)

  3) Competition Legend
     • Champions League
     • Europa
     • Relegation

  4) StandingsTable
     • Table (POS, TEAM, P, W, D, L, GD, PTS)

</main>

```

This mirrors the `/teams` structural patterns for consistency.

---

## 1.4 Table IA (Semantic Layout)

```
<table role="table">
  <thead>
     <tr>
        <th scope="col">POS</th>
        <th scope="col">Team</th>
        <th scope="col">P</th>
        <th scope="col">W</th>
        <th scope="col">D</th>
        <th scope="col">L</th>
        <th scope="col">GD</th>
        <th scope="col">PTS</th>
     </tr>
  </thead>

  <tbody>
     <tr role="link" tabindex="0">
        <th scope="row">1</th>
        <td>Team</td>
        <td>28</td>
        ...
     </tr>
  </tbody>
</table>

```

- True table semantics required for accessibility.
- Row links mirror card interactions from `/teams` grid.

---

# 2. User Flows

User flows describe exactly how a visitor moves through the page and interacts with key actions.

---

## 2.1 Entry Flow — default league

```
User opens /standings
       ↓
Page loads default league = "premier-league"
       ↓
Table renders instantly with mock data
       ↓
User scrolls → sees mobile table or full desktop table

```

### Design Notes

- Initial load must have **zero UI flicker**.
- No loading state for MVP (static data).

---

## 2.2 League Switching Flow

```
User clicks league selector
       ↓
Dropdown opens showing available competitions
       ↓
User selects "La Liga"
       ↓
URL updates → /standings?league=la-liga
       ↓
Table rerenders with new league data

```

### UX Requirements

- Reuse `/teams` filter control styling and behavior.
- Dropdown must be keyboard navigable.
- Crest icons visually support league recognition.

---

## 2.3 Row Navigation Flow (Future-ready)

Although MVP does not include `/team/[id]` pages yet, the interaction is defined for future compatibility.

```
User clicks a team row in the table
       ↓
Navigate to: /team/[teamId]

```

### Implementation Notes

- Rows should already behave like `<a>` or have `onClick` mapped.
- `role="link"` + `tabIndex="0"` + `Enter` key → triggers navigation.

---

## 2.4 Mobile Flow

```
User on mobile → opens /standings
       ↓
Sees header + league selector
       ↓
Table appears as a horizontal scroll container
       ↓
User swipes horizontally to view more columns
       ↓
User taps rows to explore team (v1.1+)

```

### Why

This mirrors UEFA Champions League table behavior on mobile.

---

## 2.5 Empty / Error Flow (MVP placeholder)

Although MVP uses mock data, the IA defines future states:

```
If no data:
  Show: “Standings unavailable for {leagueName}.”
If league unsupported:
  Fallback to default league

```

This aligns with empty-state patterns established in `/teams`.

(See Teams Empty State spec )

---

# 3. Key UX Rules

### 3.1 Glanceability

- Position column left-aligned and sticky on mobile.
- Points column right-aligned for fast scanning.

### 3.2 Visual Zones

- Top 4 = Champions League
- Bottom 3 = Relegation zone
- Must use subtle token-color stripes (not loud backgrounds).

### 3.3 Consistency with Match Pulse

- Filters match `/teams` filters.
- Table typography matches DS tokens.
- Padding and surfaces follow Quality Gate (v1.1).
    
    (Spacing, ink colors, surface tokens)
    

---

# 4. High-Level Data Flow (MVP)

```
/standings/page.tsx
   ↓
Static mock → standingsData[]
   ↓
<StandingsTable rows={standingsData} />
   ↓
Rendered UI table

```

This mirrors the simple version of `/api/leagues` flow before backend integration.

(Reference: /api/leagues Data Flow Spec )

---

# 5. Breakpoint Behaviors

| Breakpoint | Behavior |
| --- | --- |
| **Mobile (<640px)** | Table scrolls horizontally, sticky POS + TEAM columns |
| **Tablet (≥768px)** | Full table visible, moderate padding |
| **Desktop (≥1024px)** | Full-width table, hover states, row navigation |

---

# 6. Accessibility IA

- The table **must** use native `<table>` markup.
- Screen-reader row labels:
    
    `"Manchester City — 1st place"`
    
- `:focus-visible` must outline the full row.
- Sticky columns must preserve reading order.

---

# 7. Risks & Considerations (IA)

- Horizontal scroll needs visible affordances on mobile.
- Sticky columns may behave differently in iOS Safari.
- Visual hierarchy must avoid clutter.

---

# 8. Versioning

- **v1.0**: MVP IA (static table, league selector, horizontal scroll on mobile).
- **v1.1**: Sticky header, contextual empty states, clickable rows.
- **v2.0**: Server-side API integration, season picker, advanced sorting.