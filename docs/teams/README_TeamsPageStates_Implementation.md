// =============================================================================
// 📘 Match Pulse — /teams Empty & Loading States Implementation Guide (v1.0)
// -----------------------------------------------------------------------------
// Responsibility: Define and implement loading & empty states for the /teams page
// Components: TeamsGridSkeleton · TeamsEmptyState
// Owner: Frontend Team
// Last updated: 2025-11-07
// Depends on: TeamsGrid, TeamsPageHeader, LeagueInfoBanner
// =============================================================================

# 📘 Match Pulse — `/teams` Empty & Loading States Implementation Guide (v1.0)

**Components:** `TeamsGridSkeleton` · `TeamsEmptyState`  
**Owner:** Frontend Team  
**Last updated:** 2025-11-07

---

## 🧩 Responsibility

Render the **loading** and **empty** states for the `/teams` page, ensuring a smooth and consistent user experience when:

- Data is **loading** (initial load or filter change).  
- No teams match the current **search or league filter**.

These states appear **within the TeamsGrid region**, without affecting the visibility or layout of the `TeamsPageHeader` or `LeagueInfoBanner`.

---

## 🎯 Goals

| Goal | Description |
| --- | --- |
| ✅ **Prevent layout jumps** | Maintain consistent height using skeleton placeholders to avoid CLS. |
| ✅ **Accessible feedback** | Screen readers receive polite updates for loading and empty results. |
| ✅ **Visual consistency** | Uses same container width, spacing, and card proportions as the TeamsGrid. |
| ✅ **Tokens-first styling** | All colors, radii, and spacing pulled from tokens (no raw px/hex). |
| ✅ **Pure presentation** | Components receive only visual state props; no data fetching. |
| ✅ **Motion-safe polish** | Skeleton shimmer and hover effects wrapped in `motion-safe()`. |
| ✅ **CI-compliant** | Must pass lint strict, typecheck, and stylelint rules. |

---

## 🧱 File Structure

```bash
src/
  components/
    teams/
      TeamsGridSkeleton.tsx
      TeamsEmptyState.tsx
  styles/
    components/
      _teams-grid.scss
      _team-card.scss

docs/
  teams/
    README_TeamsPageStates_Implementation.md
```

All style partials are imported through  
`src/styles/components/_index.scss`.

---

## 🧩 Component Contracts

| Component | Responsibility | Parent | Key Props |
| --- | --- | --- | --- |
| **TeamsGridSkeleton** | Displays placeholder cards during loading. | `/teams/page.tsx` | `count?: number` (default 8) |
| **TeamsEmptyState** | Shows centered message when no teams match filters. | `/teams/page.tsx` | `title?`, `message?` |
| **Page logic** | Decides which state to render (`loading`, `success`, `empty`). | `/teams/page.tsx` | Internal `status` state |

---

## 🧠 Type & State Example

Defined in `/teams/page.tsx`:

```ts
type TeamsPageStatus = 'idle' | 'loading' | 'success' | 'error';

const [status, setStatus] = useState<TeamsPageStatus>('loading');
const [teams, setTeams] = useState<TeamSummary[]>([]);
```

Rendering logic:

```tsx
if (status === 'loading') {
  return (
    <section className="teams-grid container" aria-busy="true">
      <p className="teams-grid__status" aria-live="polite">
        🌀 Loading teams…
      </p>
      <TeamsGridSkeleton />
    </section>
  );
}

if (status === 'success' && teams.length === 0) {
  return (
    <section className="teams-grid container">
      <TeamsEmptyState />
    </section>
  );
}

return (
  <section className="teams-grid container">
    <TeamsGrid teams={teams} />
  </section>
);
```

---

## 🧱 Final TSX Implementations

### 🌀 `TeamsGridSkeleton.tsx`

```tsx
import * as React from "react";

type TeamsGridSkeletonProps = {
  count?: number; // Default: 8
};

export default function TeamsGridSkeleton({ count = 8 }: TeamsGridSkeletonProps) {
  return (
    <div className="teams-grid__list">
      {Array.from({ length: count }).map((_, i) => (
        <article
          key={i}
          className="team-card team-card--skeleton"
          aria-hidden="true"
        >
          <div className="team-card__crest team-card__crest--skeleton" />
          <div className="team-card__line team-card__line--primary" />
          <div className="team-card__line team-card__line--secondary" />
          <div className="team-card__form team-card__form--skeleton" />
        </article>
      ))}
    </div>
  );
}
```

---

### 🔍 `TeamsEmptyState.tsx`

```tsx
import * as React from "react";

type TeamsEmptyStateProps = {
  title?: string;
  message?: string;
};

const DEFAULT_TITLE = "No teams match your search.";
const DEFAULT_MESSAGE = "Try a different league or keyword.";

export default function TeamsEmptyState({
  title = DEFAULT_TITLE,
  message = DEFAULT_MESSAGE,
}: TeamsEmptyStateProps) {
  return (
    <div className="teams-grid__empty" role="status" aria-live="polite">
      <div className="teams-grid__empty-icon" aria-hidden="true">
        🔍
      </div>
      <p className="teams-grid__empty-title">{title}</p>
      <p className="teams-grid__empty-message">{message}</p>
    </div>
  );
}
```

---

## 🎨 SCSS Implementation

### `_team-card.scss`

```scss
.team-card {
  &--skeleton {
    pointer-events: none;
    background: var(--surface-2);
    box-shadow: none;

    .team-card__crest--skeleton,
    .team-card__line,
    .team-card__form--skeleton {
      border-radius: var(--r-sm);
      background: var(--skeleton-base);
      position: relative;
      overflow: hidden;

      &::after {
        content: "";
        position: absolute;
        inset: 0;
        transform: translateX(-100%);
        background: linear-gradient(
          90deg,
          transparent,
          var(--skeleton-shimmer),
          transparent
        );

        @include abstracts.motion-safe() {
          animation: teams-skeleton-shimmer 1.2s infinite;
        }
      }
    }

    .team-card__crest--skeleton {
      inline-size: 56px;
      block-size: 56px;
      border-radius: 999px;
    }

    .team-card__line--primary {
      block-size: 12px;
      inline-size: 70%;
      margin-block-start: var(--s-3);
    }

    .team-card__line--secondary {
      block-size: 10px;
      inline-size: 50%;
      margin-block-start: var(--s-2);
    }

    .team-card__form--skeleton {
      block-size: 16px;
      inline-size: 100%;
      margin-block-start: var(--s-4);
    }
  }
}

@keyframes teams-skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}
```

---

### `_teams-grid.scss`

```scss
.teams-grid {
  &__status {
    margin-block-end: var(--s-3);
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  &__empty {
    min-block-size: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding-block: var(--s-8);
    padding-inline: var(--s-4);
    gap: var(--s-3);
  }

  &__empty-icon {
    font-size: clamp(1.75rem, 4vw, 2.25rem);
  }

  &__empty-title {
    font-weight: 600;
    font-size: var(--text-base);
  }

  &__empty-message {
    max-inline-size: 32rem;
    font-size: var(--text-sm);
    color: var(--text-muted);
  }
}
```

---

## ♿ Accessibility

| Aspect | Implementation |
| --- | --- |
| **Loading** | `aria-busy="true"` on grid; message inside `aria-live="polite"`. |
| **Skeletons** | `aria-hidden="true"` to avoid fake card narration. |
| **Empty state** | `role="status"` + `aria-live="polite"` to announce result message. |
| **Focus behavior** | Focus remains on filter controls; skeletons and empty view non-interactive. |

---

## ✅ Definition of Done

| Category | Requirement |
| --- | --- |
| **Tokens-first** | No raw px/hex values; all pulled from design tokens. |
| **A11y-compliant** | All states properly announced via ARIA roles. |
| **Maintainable** | BEM naming, ≤3 nesting levels, motion-safe guards. |
| **Layout-safe** | Grid area keeps height; prevents visual jumps. |
| **Mobile-first** | Typography and icon size use `clamp()`. |
| **CI-passed** | Lint, stylelint strict, typecheck, and build OK. |
| **Visual QA** | Tested across mobile, tablet, desktop. |
