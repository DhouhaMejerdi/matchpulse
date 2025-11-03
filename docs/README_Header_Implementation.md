# README_Header_Implementation

# 🧭 Match Pulse — Header Implementation Guide (v1)

**Owner:** Frontend Team

**Last Updated:** 02 Nov 2025

**Module:** `<SiteHeader />`

**Responsibility:** Implements the main header landmark that delivers global navigation, brand identity, and “Today’s Matches” context.

---

## 1️⃣ Scope

This guide connects all required design + engineering documents and defines the **exact workflow** for building and submitting the Header feature.

Applies to: `src/components/layout/SiteHeader.tsx` + `src/styles/components/_header.scss`

---

## 2️⃣ Branch Setup

| Step | Command | Notes |
| --- | --- | --- |
| Create branch | `git switch -c feature/header-base` | Prefix all header-related work with `feature/header-*`. |
| Verify pipeline | `npm run check` | Runs lint + typecheck + stylelint (strict). |
| Commit format | `feat(header): add base structure` | Follow Conventional Commit spec. |

Use `git rebase origin/main` before PR to keep history linear.

---

## 3️⃣ Files to Work In

```
src/
├── components/
│   └── layout/
│       └── SiteHeader.tsx        # Main component
├── styles/
│   └── components/
│       └── _header.scss          # Header SCSS (tokens-first)
└── styles/index.scss             # Already imports component layer

```

Ensure `layout.tsx` includes:

```tsx
<header role="banner">
  <SiteHeader />
</header>

```

---

## 4️⃣ Development Checklist

✅  Follow **📗 Frontend Architecture & Project Structure Guide (v1)**

✅  Adhere to **📘 Styles Quality Gate (v1.1)** rules

✅  Comment headers using **📗 Commenting & Docstring Conventions V1**

✅  Implement according to **📘 Header Design Brief (v1)** and **Wireframes & Viewports (v1)**

✅  Use only design tokens (`var(--*)`)

✅  Maintain accessibility: role="banner", aria-current="page", visible focus ring, motion-safe transitions.

✅  Validate in Safari (macOS + iOS) and Chromium

✅  Attach screenshots to PR

---

## 5️⃣ Definition of Done (DoD)

| Category | Requirement |
| --- | --- |
| Lint | `npm run lint && npm run lint:css:strict` passes (no warnings) |
| Typecheck | `npm run typecheck` passes |
| Accessibility | Keyboard navigable, visible focus, reduced-motion respected |
| Tokens | No raw hex/px; tokens-first |
| Responsiveness | Verified 360 / 768 / 1024 / 1440 px |
| CI Status | ✅ Green across ESLint + Stylelint + TypeScript |
| Review | Screenshots + A11y evidence attached |

---

## 6️⃣ Related References

| Document | Purpose |
| --- | --- |
| 📘 Styles Quality Gate (v1.1) | Linting + CI requirements |
| 📗 Frontend Architecture & Project Structure Guide (v1) | Project structure and header contract |
| 📗 Commenting & Docstring Conventions V1 | Code documentation rules |
| 📘 Header Design Brief (v1) | Functional spec + DoD |
| 📘 Header Design Brief — Layout Wireframes & Viewports (v1) | Responsive wireframes + breakpoints |

---

## 7️⃣ Final Pre-Push Gate

Before pushing:

```bash
npm run lint && npm run typecheck && npm run lint:css:strict

```

All gates must pass → open PR → attach screenshots → tag `@frontend-reviewers`.

---

## 8️⃣ Expected Output

At merge time, repository should contain:
- ✅ `src/components/layout/SiteHeader.tsx` — complete, lint-clean, typed
- ✅ `src/styles/components/_header.scss` — token-driven, responsive
- ✅ Screenshots attached for 360 / 768 / 1024 / 1440 px
- ✅ PR checklist ticked and CI green
